# Утилиты и вспомогательные функции

## Файловые операции (apg/copy.h)

### copy_dir

```c
bool copy_dir(const char *src, const char *dst);
```

Рекурсивно копирует директорию `src` в `dst`. Сохраняет права доступа файлов. Создаёт целевые поддиректории при необходимости.

Возвращает `false` при ошибке чтения или записи.

```c
if (!copy_dir("/tmp/apg/extracted/data", "/")) {
    fprintf(stderr, "failed to copy data directory\n");
    return false;
}
```

## Установка директорий (apg/install.h)

### install_data_dir

```c
bool install_data_dir(const char *pkg_dir, const char *root_path);
```

Копирует `pkg_dir/data/` в `root_path`. Если `data/` не существует — возвращает `true` без ошибки.

### install_home_dir

```c
bool install_home_dir(const char *pkg_dir);
```

Копирует `pkg_dir/home/` в директорию текущего пользователя (из `$HOME`). Если `home/` не существует — возвращает `true`.

## Распаковка (apg/archive.h)

### unarchive_package

```c
bool unarchive_package(const struct package *pkg);
```

Распаковывает пакет в текущую директорию через libarchive.

### unarchive_package_in_root

```c
bool unarchive_package_in_root(const struct package *pkg, const char *root);
```

Распаковывает пакет в указанную директорию.

## Строки и пути (util.h)

### concat

```c
char *concat(const char *str1, const char *str2);
```

Конкатенирует две строки. Возвращает heap-allocated строку — освобождать через `free`.

```c
char *path = concat("/usr/lib", "/libapg.so");
// path = "/usr/lib/libapg.so"
free(path);
```

### concat_dirs

```c
char *concat_dirs(const char *path1, const char *path2);
```

Соединяет два пути, убирая двойные слеши. Возвращает heap-allocated строку.

```c
char *full = concat_dirs("/tmp/apg/", "/extracted");
// full = "/tmp/apg/extracted"
free(full);
```

### create_dir

```c
void create_dir(const char *path);
```

Создаёт директорию если она не существует. Не создаёт промежуточные директории рекурсивно.

## Конфигурация (apg/config.h)

### parse_config

```c
config *parse_config(char *path);
```

Разбирает конфигурационный файл. Обычный путь — `/etc/apg.conf`. Возвращает `config *` или `NULL`.

### set_config

```c
void set_config(config *cfg);
```

Устанавливает глобальную конфигурацию библиотеки.

### config_free

```c
void config_free(config *cfg);
```

Освобождает объект конфигурации.

```c
config *cfg = parse_config("/etc/apg.conf");
if (cfg) {
    set_config(cfg);
    // ... работа с библиотекой ...
    config_free(cfg);
}
```
