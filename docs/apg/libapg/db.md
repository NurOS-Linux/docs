# База данных (LMDB)

Модуль `apg/db.h` управляет хранилищем установленных пакетов. В качестве движка используется LMDB — встраиваемая key-value база данных с поддержкой ACID-транзакций.

Ключ записи — имя пакета (`pkg->meta->name`). Значение — JSON-сериализация объекта `package`.

## Инициализация

### init_db

```c
MDB_env *init_db(const char *db_path);
```

Инициализирует окружение LMDB по указанному пути. Создаёт директорию если её нет.

| Параметр | Описание |
|----------|----------|
| `db_path` | путь к директории базы данных |

Размер по умолчанию — 10 МБ (10 485 760 байт).

Возвращает `MDB_env *` или `NULL` при ошибке.

```c
MDB_env *env = init_db("/var/lib/apg/db");
if (!env) {
    fprintf(stderr, "failed to open database\n");
    return 1;
}
```

## Запись

### add_package

```c
bool add_package(struct package *pkg, MDB_env *env);
```

Сериализует пакет в JSON через `package_to_json` и сохраняет в БД. Если запись с таким именем уже существует — перезаписывает.

Возвращает `true` при успехе.

```c
struct package *pkg = parse_package("/cache/curl.apg", "/");
if (pkg && add_package(pkg, env)) {
    printf("registered in database\n");
}
```

## Удаление

### remove_package

```c
bool remove_package(char *pkg_name, MDB_env *env);
```

Удаляет запись о пакете по имени. Возвращает `true` если запись найдена и удалена.

```c
remove_package("curl", env);
```

## Чтение

### get_package_by_name

```c
struct package *get_package_by_name(char *name, MDB_env *env);
```

Возвращает десериализованный пакет или `NULL` если пакет не найден. Возвращённый объект необходимо освободить через `package_free`.

```c
struct package *pkg = get_package_by_name("curl", env);
if (pkg) {
    printf("%s %s\n", pkg->meta->name, pkg->meta->version);
    package_free(pkg);
}
```

### get_all_packages

```c
struct package **get_all_packages(MDB_env *env, int *count);
```

Возвращает массив всех пакетов из БД. Количество записей сохраняется в `*count`.

Каждый элемент массива необходимо освободить через `package_free`, затем освободить сам массив через `free`.

Возвращает `NULL` при ошибке или пустой БД.

```c
int count = 0;
struct package **all = get_all_packages(env, &count);

for (int i = 0; i < count; i++) {
    printf("%s\n", all[i]->meta->name);
    package_free(all[i]);
}
free(all);
```

## Пример: список установленных пакетов

```c
#include <apg/db.h>
#include <apg/package.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    MDB_env *env = init_db("/var/lib/apg/db");
    if (!env) return 1;

    int count = 0;
    struct package **pkgs = get_all_packages(env, &count);

    printf("installed packages: %d\n", count);
    for (int i = 0; i < count; i++) {
        printf("  %-30s %s\n",
               pkgs[i]->meta->name,
               pkgs[i]->meta->version);
        package_free(pkgs[i]);
    }
    free(pkgs);

    return 0;
}
```
