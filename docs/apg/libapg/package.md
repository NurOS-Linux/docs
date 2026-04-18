# Управление пакетами

Модуль `apg/package.h` — центральный API библиотеки. Управляет жизненным циклом объектов пакета и запускает процесс установки.

## Создание объектов

### package_new

```c
struct package *package_new(void);
```

Создаёт пустой объект пакета с выделенной памятью для метаданных. Все поля инициализированы нулями.

Возвращает `NULL` при ошибке аллокации.

### package_metadata_new

```c
struct package_metadata *package_metadata_new(void);
```

Создаёт пустой объект метаданных. Все строковые поля и списки инициализированы нулями.

Возвращает `NULL` при ошибке аллокации.

## Освобождение памяти

### str_list_free

```c
void str_list_free(struct str_list *list);
```

Освобождает все строки в списке. Не освобождает саму структуру — она может быть встроена в другую.

### package_metadata_free

```c
void package_metadata_free(struct package_metadata *meta);
```

Освобождает все строковые поля, все вложенные `str_list` и саму структуру.

### package_free

```c
void package_free(struct package *pkg);
```

Полностью освобождает пакет: метаданные, `pkg_path`, `package_files` и структуру.

## Разбор пакетов

### parse_package

```c
struct package *parse_package(const char *path, const char *root_path);
```

Разбирает пакет из файла: извлекает `meta.json`, составляет список файлов.

| Параметр | Описание |
|----------|----------|
| `path` | путь к файлу `.tar.xz` |
| `root_path` | корневой путь для временной распаковки |

Возвращает заполненный `package` или `NULL` при ошибке.

## Установка

### install_package

```c
bool install_package(const struct package *pkg);
```

Устанавливает пакет в корень системы `/`. Полная последовательность:

1. Распаковка архива во временную директорию
2. Проверка контрольных сумм (`sha256sums` / `crc32sums` / `md5sums`)
3. Запуск `pre-install`
4. Копирование `data/` → `/`
5. Копирование `home/` → `$HOME`
6. Запуск `post-install`

Возвращает `true` при успехе. При любой ошибке возвращает `false` и прекращает установку.

### install_package_in_root

```c
bool install_package_in_root(const struct package *pkg, const char *root_path);
```

Устанавливает пакет в указанный корень. Используется для chroot-окружений, live-систем, тестирования. Логика идентична `install_package`.

## Пример: полный цикл

```c
#include <apg/package.h>
#include <stdio.h>

int main(int argc, char *argv[]) {
    if (argc < 2) return 1;

    struct package *pkg = parse_package(argv[1], "/");
    if (!pkg) {
        fprintf(stderr, "failed to parse package\n");
        return 1;
    }

    printf("installing %s %s\n", pkg->meta->name, pkg->meta->version);

    if (!install_package(pkg)) {
        fprintf(stderr, "installation failed\n");
        package_free(pkg);
        return 1;
    }

    package_free(pkg);
    return 0;
}
```

## Пример: установка в chroot

```c
struct package *pkg = parse_package("/cache/vim.apg", "/mnt/system");
if (!pkg) return 1;

if (!install_package_in_root(pkg, "/mnt/system")) {
    package_free(pkg);
    return 1;
}

package_free(pkg);
```
