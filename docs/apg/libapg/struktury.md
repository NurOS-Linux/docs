# Структуры данных

## str_list

Динамический список строк. Используется для всех массивных полей метаданных.

```c
struct str_list {
    char **items;   // массив строк
    int count;      // количество элементов
};
```

Память каждого элемента принадлежит структуре. Освобождать через `str_list_free`. Массив не является null-terminated — для итерации использовать `count`.

```c
for (int i = 0; i < meta->dependencies.count; i++) {
    printf("%s\n", meta->dependencies.items[i]);
}
```

## package_metadata

Метаданные пакета. Соответствует содержимому `meta.json`.

```c
struct package_metadata {
    char *name;
    char *version;
    char *type;
    char *architecture;
    char *description;
    char *maintainer;
    char *license;
    char *homepage;
    struct str_list tags;
    struct str_list dependencies;
    struct str_list conflicts;
    struct str_list provides;
    struct str_list replaces;
    struct str_list conf;
};
```

### Соответствие полям meta.json

| Поле структуры | Ключ JSON | Обязательное |
|----------------|-----------|:---:|
| `name` | `package.name` | Да |
| `version` | `package.version` | Да |
| `architecture` | `package.architecture` | Да |
| `type` | `package.type` | Нет |
| `description` | `package.description` | Нет |
| `maintainer` | `package.maintainer` | Нет |
| `license` | `package.license` | Нет |
| `homepage` | `package.homepage` | Нет |
| `dependencies` | `package.dependencies` | Нет |
| `conflicts` | `package.conflicts` | Нет |
| `provides` | `package.provides` | Нет |
| `replaces` | `package.replaces` | Нет |
| `tags` | `package.tags` | Нет |
| `conf` | `package.conf` | Нет |

## package

Полное представление пакета APG.

```c
struct package {
    struct package_metadata *meta;
    char *pkg_path;
    struct str_list package_files;
    bool installed_by_hand;
};
```

- `meta` — метаданные из `meta.json`
- `pkg_path` — путь к файлу `.tar.xz`
- `package_files` — список всех файлов в архиве
- `installed_by_hand` — `true` если пакет установлен пользователем напрямую, `false` если как зависимость

## config

Конфигурация системы управления пакетами.

```c
typedef enum {
    HTTP,
    FTP,
    RSYNC,
} repo_type;

typedef struct {
    const char *url;
    repo_type type;
} repo;

typedef struct {
    int db_size;
    char *tmp_dir;
    int repo_count;
    repo *repos;
} config;
```

- `db_size` — размер базы данных в байтах
- `tmp_dir` — директория для временных файлов (по умолчанию `/tmp/apg/`)
- `repos` — массив из `repo_count` репозиториев

## Контексты хеширования

Используются внутри функций вычисления хешей. Обычно не нужны напрямую — вместо них удобнее `compute_sha256`, `compute_md5`.

```c
struct sha256_ctx {
    uint32_t state[8];
    uint64_t count;
    uint8_t buf[64];
};

struct md5_ctx {
    uint32_t state[4];
    uint32_t count[2];
    uint8_t buf[64];
};
```
