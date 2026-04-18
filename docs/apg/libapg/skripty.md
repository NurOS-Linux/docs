# Скрипты установки

Модуль `apg/scripts.h` отвечает за выполнение install-скриптов, входящих в пакет.

## run_script

```c
bool run_script(const char *pkg_dir, const char *name);
```

Ищет и выполняет скрипт из директории `pkg_dir/scripts/`.

| Параметр | Описание |
|----------|----------|
| `pkg_dir` | путь к распакованному пакету |
| `name` | имя скрипта |

**Возвращаемые значения:**

- `true` — скрипт выполнен успешно
- `true` — скрипт не существует (не является ошибкой)
- `false` — скрипт вернул ненулевой код выхода

## Поиск скриптов

Имена скриптов нормализуются перед поиском:

- Регистронезависимо
- Символы `-` и `_` считаются эквивалентными

Например, `run_script(dir, "pre-install")` найдёт файл `pre_install`, `Pre-Install`, `pre_Install` и т.д.

Скрипт должен иметь флаг исполняемого файла (`chmod +x`).

## Стандартные скрипты

| Имя | Когда выполняется |
|-----|-------------------|
| `pre-install` | до копирования файлов в систему |
| `post-install` | после копирования файлов |

Оба вызываются автоматически внутри `install_package`. Дополнительные скрипты с любыми именами также поддерживаются.

## Структура директории скриптов

```
package.tar.xz
└── scripts/
    ├── pre-install    # обязателен chmod +x
    └── post-install
```

## Пример скриптов

### pre-install

```bash
#!/bin/sh
# Создать пользователя если не существует
id -u myapp 2>/dev/null || useradd -r -s /sbin/nologin myapp
```

### post-install

```bash
#!/bin/sh
# Перезагрузить systemd
systemctl daemon-reload
systemctl enable myapp.service
```

## Пример использования из C

```c
#include <apg/scripts.h>

const char *pkg_dir = "/tmp/apg/extracted";

if (!run_script(pkg_dir, "pre-install")) {
    fprintf(stderr, "pre-install script failed\n");
    return false;
}

// ... установка файлов ...

if (!run_script(pkg_dir, "post-install")) {
    fprintf(stderr, "post-install script failed\n");
    return false;
}
```
