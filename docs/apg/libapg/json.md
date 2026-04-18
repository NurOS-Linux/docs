# JSON-сериализация

Модуль `apg/json.h` отвечает за чтение метаданных из `meta.json` и сериализацию объектов пакетов. Использует библиотеку [yyjson](https://github.com/ibireme/yyjson) — быстрый C-парсер JSON.

## Чтение метаданных

### package_metadata_from_file

```c
struct package_metadata *package_metadata_from_file(const char *path);
```

Загружает и разбирает файл `meta.json` по указанному пути.

```c
struct package_metadata *meta =
    package_metadata_from_file("/tmp/apg/extracted/meta.json");

if (meta) {
    printf("%s %s\n", meta->name, meta->version);
    package_metadata_free(meta);
}
```

### package_metadata_from_json

```c
struct package_metadata *package_metadata_from_json(const char *json, size_t len);
```

Разбирает метаданные из строки JSON заданной длины. Удобно когда JSON уже загружен в память.

```c
const char *raw = "{\"package\":{\"name\":\"curl\",\"version\":\"8.0.0\",...}}";
struct package_metadata *meta =
    package_metadata_from_json(raw, strlen(raw));
```

## Сериализация

### package_to_json

```c
char *package_to_json(struct package *pkg);
```

Сериализует пакет в JSON-строку. Используется внутри `add_package` перед записью в LMDB.

Возвращает heap-allocated строку — освобождать через `free`. Возвращает `NULL` при ошибке.

```c
char *json = package_to_json(pkg);
if (json) {
    puts(json);
    free(json);
}
```

## Формат meta.json

```json
{
  "package": {
    "name": "curl",
    "version": "8.4.0",
    "release": "1",
    "architecture": "x86_64",
    "description": "Command line tool for transferring data with URLs",
    "maintainer": "NurOS Team <team@nuros.org>",
    "license": "MIT",
    "homepage": "https://curl.se",
    "dependencies": ["libssl", "zlib"],
    "conflicts": [],
    "provides": ["curl"],
    "replaces": [],
    "tags": ["network", "cli"],
    "conf": ["/etc/curl/curlrc"]
  }
}
```
