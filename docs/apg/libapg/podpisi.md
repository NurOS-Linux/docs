# Цифровые подписи

Модуль `apg/sign.h` обеспечивает проверку и создание цифровых подписей пакетов. Поддерживает два бэкенда, выбор происходит на этапе сборки библиотеки.

## Бэкенды

### GPGME (предпочтительный)

Использует GnuPG через библиотеку GPGME.

- Поддерживает ECC-ключи: Ed25519, ECDSA
- Опционально: RSA (через параметр `allow_rsa`)
- Подпись — detached (отдельный `.sig` файл)
- Ключи берутся из системного GPG-хранилища

### libsodium (fallback)

Используется если GPGME недоступен при сборке.

- Только Ed25519
- Параметр `allow_rsa` игнорируется
- Публичные ключи читаются из `/etc/apg/keys/`
- Подпись — бинарный файл

## Функции

### sign_verify

```c
bool sign_verify(const char *pkg_path, const char *sig_path, bool allow_rsa);
```

Проверяет цифровую подпись пакета.

| Параметр | Описание |
|----------|----------|
| `pkg_path` | путь к файлу пакета |
| `sig_path` | путь к файлу подписи |
| `allow_rsa` | разрешить RSA-ключи (только для GPGME) |

Возвращает `true` если подпись корректна.

```c
if (!sign_verify("curl.apg", "curl.apg.sig", false)) {
    fprintf(stderr, "signature verification failed\n");
    return false;
}
```

### sign_file

```c
bool sign_file(const char *pkg_path, const char *sig_path);
```

Подписывает файл пакета и сохраняет подпись в `sig_path`.

```c
if (!sign_file("curl.apg", "curl.apg.sig")) {
    fprintf(stderr, "signing failed\n");
    return false;
}
```

## Пример: верификация перед установкой

```c
#include <apg/sign.h>
#include <apg/package.h>
#include <stdio.h>

int main(int argc, char *argv[]) {
    if (argc < 3) return 1;

    const char *pkg_path = argv[1];
    const char *sig_path = argv[2];

    if (!sign_verify(pkg_path, sig_path, false)) {
        fprintf(stderr, "package signature is invalid\n");
        return 1;
    }

    struct package *pkg = parse_package(pkg_path, "/");
    if (!pkg) return 1;

    if (!install_package(pkg)) {
        package_free(pkg);
        return 1;
    }

    package_free(pkg);
    return 0;
}
```

## Управление ключами (libsodium)

При использовании libsodium бэкенда публичные ключи хранятся в `/etc/apg/keys/`. Каждый ключ — отдельный бинарный файл с 32-байтным Ed25519 публичным ключом.

```
/etc/apg/keys/
├── nuros-official.key
└── maintainer.key
```
