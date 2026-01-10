# libapg API Reference

## Обзор

**libapg** — библиотека для работы с пакетами APG, написанная на языке C. Предоставляет низкоуровневый API для чтения, записи и управления пакетами формата APG.

## Технические характеристики

* **Язык**: C (C11)
* **Лицензия**: GNU GPL 3.0
* **Зависимости**:
  * libarchive — для работы с архивами
  * libiron — для логирования
* **Установка**: через meson/ninja

## Структуры данных

### str_list

Список строк с динамическим размером.

```c
struct str_list {
    char **items;    // Массив строк (heap-allocated)
    size_t count;    // Количество элементов
};
```

**Примечание**:
* Массив `items` не null-terminated
* Владельцем памяти является родительская структура
* Используется `size_t` вместо `int` для стабильности размеров

### package_metadata

Метаданные пакета APG.

```c
struct package_metadata {
    char *name;                      // Имя пакета
    char *version;                   // Версия
    char *architecture;              // Архитектура (x86_64, aarch64, riscv64, all)
    char *description;               // Описание пакета
    char *maintainer;                // Мейнтейнер
    char *license;                   // Лицензия
    char *homepage;                  // Домашняя страница
    struct str_list dependencies;    // Зависимости
    struct str_list conflicts;       // Конфликты
    struct str_list provides;        // Виртуальные пакеты
    struct str_list replaces;        // Замены
    struct str_list tags;            // Теги/категории
};
```

**Соответствие полям metadata.json:**

| Поле C структуры | Поле JSON | Тип | Обязательное |
|------------------|-----------|-----|:------------:|
| `name` | `package.name` | string | Да |
| `version` | `package.version` | string | Да |
| `architecture` | `package.architecture` | string | Да |
| `description` | `package.description` | string | Нет |
| `maintainer` | `package.maintainer` | string | Нет |
| `license` | `package.license` | string | Нет |
| `homepage` | `package.homepage` | string | Нет |
| `dependencies` | `package.dependencies` | array | Нет |
| `conflicts` | `package.conflicts` | array | Нет |
| `provides` | `package.provides` | array | Нет |
| `replaces` | `package.replaces` | array | Нет |
| `tags` | `package.tags` | array | Нет |

### package

Представление пакета APG.

```c
struct package {
    struct package_metadata *meta;   // Метаданные пакета
    char *pkg_path;                  // Путь к файлу .apg
    struct str_list package_files;   // Список файлов в пакете
    bool installed_by_hand;          // Установлен ли вручную
};
```

## API функции

### Управление памятью

#### str_list_free

Освобождение памяти списка строк.

```c
void str_list_free(struct str_list *list);
```

**Параметры:**
* `list` — указатель на структуру str_list

**Поведение:**
* Освобождает каждый элемент массива `items`
* Освобождает сам массив `items`
* Обнуляет `count`

**Пример:**
```c
struct str_list deps = {0};
// ... заполнение списка
str_list_free(&deps);
```

#### package_metadata_free

Освобождение памяти метаданных пакета.

```c
void package_metadata_free(struct package_metadata *meta);
```

**Параметры:**
* `meta` — указатель на структуру package_metadata

**Поведение:**
* Освобождает все строковые поля
* Освобождает все вложенные str_list
* Освобождает саму структуру

**Пример:**
```c
struct package_metadata *meta = package_metadata_new();
// ... работа с метаданными
package_metadata_free(meta);
```

#### package_free

Освобождение памяти пакета.

```c
void package_free(struct package *pkg);
```

**Параметры:**
* `pkg` — указатель на структуру package

**Поведение:**
* Освобождает метаданные через `package_metadata_free`
* Освобождает путь к пакету
* Освобождает список файлов
* Освобождает саму структуру

**Пример:**
```c
struct package *pkg = package_new();
// ... работа с пакетом
package_free(pkg);
```

### Создание объектов

#### package_new

Создание нового объекта пакета.

```c
struct package *package_new(void);
```

**Возвращает:**
* Указатель на новый объект package
* NULL при ошибке выделения памяти

**Поведение:**
* Выделяет память для структуры
* Инициализирует все поля нулями
* Выделяет память для метаданных

**Пример:**
```c
struct package *pkg = package_new();
if (!pkg) {
    // Ошибка выделения памяти
    return -1;
}
```

#### package_metadata_new

Создание нового объекта метаданных.

```c
struct package_metadata *package_metadata_new(void);
```

**Возвращает:**
* Указатель на новый объект package_metadata
* NULL при ошибке выделения памяти

**Поведение:**
* Выделяет память для структуры
* Инициализирует все поля нулями
* Инициализирует все str_list

**Пример:**
```c
struct package_metadata *meta = package_metadata_new();
if (!meta) {
    // Ошибка выделения памяти
    return -1;
}
meta->name = strdup("example");
meta->version = strdup("1.0.0");
```

### Операции с пакетами

#### install_package

Установка пакета в систему.

```c
void install_package(struct package *pkg, char *path);
```

**Параметры:**
* `pkg` — указатель на структуру package
* `path` — путь для установки (обычно "/")

**Поведение:**
1. Извлекает архив пакета
2. Проверяет контрольные суммы (crc32sums или md5sums)
3. Выполняет pre-install скрипт (если есть)
4. Копирует файлы из `data/` в целевую директорию
5. Копирует файлы из `home/` в домашний каталог
6. Выполняет post-install скрипт (если есть)
7. Регистрирует пакет в базе данных

**Пример:**
```c
struct package *pkg = package_new();
pkg->pkg_path = strdup("/var/cache/apg/packages/firefox.apg");

// Установить в корень системы
install_package(pkg, "/");

package_free(pkg);
```

## Модули библиотеки

### apg/archive.h

Работа с архивами APG.

```c
#include <apg/archive.h>
```

**Функции:**
* Извлечение tar.xz архивов
* Создание архивов
* Проверка целостности

### apg/crc32.h

Работа с контрольными суммами CRC32.

```c
#include <apg/crc32.h>
```

**Функции:**
* Вычисление CRC32 суммы файла
* Проверка crc32sums файла
* Генерация crc32sums

**Константы и типы:**
```c
// CRC32 полином (из заголовочного файла)
#define CRC32_POLYNOMIAL 0xEDB88320

// Функция вычисления CRC32
uint32_t calculate_crc32(const uint8_t *data, size_t length);
```

### apg/db.h

Работа с базой данных установленных пакетов.

```c
#include <apg/db.h>
```

**Функции:**
* Регистрация установленного пакета
* Удаление записи о пакете
* Поиск пакета в базе
* Получение списка файлов пакета

**Расположение базы данных:**
```
/var/lib/apg/
├── installed/
│   └── <package-name>-<version>-<release>/
│       ├── metadata.json
│       ├── files.list
│       └── install-date
```

## Примеры использования

### Пример 1: Чтение метаданных пакета

```c
#include <apg/package.h>
#include <stdio.h>

int main() {
    struct package *pkg = package_new();
    if (!pkg) {
        fprintf(stderr, "Failed to create package\n");
        return 1;
    }

    pkg->pkg_path = strdup("/path/to/package.apg");

    // Загрузить метаданные (реализуется через archive модуль)
    // load_package_metadata(pkg);

    printf("Package: %s\n", pkg->meta->name);
    printf("Version: %s\n", pkg->meta->version);
    printf("Architecture: %s\n", pkg->meta->architecture);

    // Вывести зависимости
    printf("Dependencies:\n");
    for (size_t i = 0; i < pkg->meta->dependencies.count; i++) {
        printf("  - %s\n", pkg->meta->dependencies.items[i]);
    }

    package_free(pkg);
    return 0;
}
```

### Пример 2: Установка пакета

```c
#include <apg/package.h>
#include <stdio.h>

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <package.apg>\n", argv[0]);
        return 1;
    }

    struct package *pkg = package_new();
    if (!pkg) {
        fprintf(stderr, "Failed to create package\n");
        return 1;
    }

    pkg->pkg_path = strdup(argv[1]);

    // Установить пакет в корень системы
    install_package(pkg, "/");

    printf("Package installed successfully\n");

    package_free(pkg);
    return 0;
}
```

### Пример 3: Работа со списками

```c
#include <apg/package.h>
#include <stdio.h>
#include <string.h>

// Добавление элемента в str_list
int str_list_add(struct str_list *list, const char *item) {
    char **new_items = realloc(list->items,
                               (list->count + 1) * sizeof(char *));
    if (!new_items) {
        return -1;
    }

    list->items = new_items;
    list->items[list->count] = strdup(item);
    if (!list->items[list->count]) {
        return -1;
    }

    list->count++;
    return 0;
}

int main() {
    struct package_metadata *meta = package_metadata_new();
    if (!meta) {
        return 1;
    }

    meta->name = strdup("myapp");
    meta->version = strdup("1.0.0");
    meta->architecture = strdup("x86_64");

    // Добавить зависимости
    str_list_add(&meta->dependencies, "libc");
    str_list_add(&meta->dependencies, "libarchive");

    // Добавить теги
    str_list_add(&meta->tags, "utility");
    str_list_add(&meta->tags, "cli");

    package_metadata_free(meta);
    return 0;
}
```

## Компиляция и линковка

### Компиляция программы с libapg

```bash
gcc -o myapp myapp.c $(pkg-config --cflags --libs libapg)
```

### Пример pkg-config

```bash
# Получить флаги компиляции
pkg-config --cflags libapg

# Получить флаги линковки
pkg-config --libs libapg
```

### Makefile пример

```makefile
CC = gcc
CFLAGS = $(shell pkg-config --cflags libapg)
LDFLAGS = $(shell pkg-config --libs libapg)

myapp: myapp.c
	$(CC) $(CFLAGS) -o $@ $< $(LDFLAGS)

clean:
	rm -f myapp
```

## Интеграция с другими языками

### Python (через ctypes)

```python
import ctypes

# Загрузить библиотеку
libapg = ctypes.CDLL('libapg.so')

# Определить структуры
class StrList(ctypes.Structure):
    _fields_ = [
        ('items', ctypes.POINTER(ctypes.c_char_p)),
        ('count', ctypes.c_size_t)
    ]

class PackageMetadata(ctypes.Structure):
    _fields_ = [
        ('name', ctypes.c_char_p),
        ('version', ctypes.c_char_p),
        # ... остальные поля
    ]

# Определить функции
libapg.package_new.restype = ctypes.POINTER(ctypes.c_void_p)
libapg.package_free.argtypes = [ctypes.POINTER(ctypes.c_void_p)]

# Использование
pkg = libapg.package_new()
# ... работа с пакетом
libapg.package_free(pkg)
```

## Логирование

libapg использует библиотеку **libiron** для логирования.

**Уровни логирования:**
* DEBUG — отладочная информация
* INFO — информационные сообщения
* WARN — предупреждения
* ERROR — ошибки

**Конфигурация:**
```c
// В коде libapg используется libiron
iron_log(INFO, "Installing package %s", pkg->meta->name);
iron_log(ERROR, "Failed to extract archive");
```

## Обработка ошибок

libapg не использует исключения (это C). Ошибки обрабатываются через возвращаемые значения:

**Соглашения:**
* `NULL` — ошибка выделения памяти
* `-1` — общая ошибка операции
* `0` — успех
* `> 0` — специфичные коды ошибок

**Пример обработки ошибок:**
```c
struct package *pkg = package_new();
if (!pkg) {
    iron_log(ERROR, "Failed to allocate memory for package");
    return -1;
}

// Проверить результат установки
int result = install_package(pkg, "/");
if (result != 0) {
    iron_log(ERROR, "Failed to install package");
    package_free(pkg);
    return -1;
}
```

## Производительность

### Оптимизации

* Использование `size_t` вместо `int` для размеров
* Минимальные копирования данных
* Эффективная работа с памятью через пулы

### Бенчмарки

**Типичная производительность:**
* Извлечение пакета 100 МБ: ~2-3 секунды
* Проверка CRC32 100 МБ: ~0.5 секунды
* Парсинг metadata.json: ~0.001 секунды

## Безопасность

### Path Traversal Protection

libapg защищает от атак path traversal при извлечении архивов:

```c
// Проверка на ../ в путях файлов
if (strstr(filename, "../")) {
    iron_log(ERROR, "Path traversal attempt detected");
    return -1;
}
```

### Проверка контрольных сумм

Обязательная проверка crc32sums/md5sums перед установкой файлов.

## Совместимость

* **Linux**: Полная поддержка (glibc, musl)
* **BSD**: Частичная поддержка
* **macOS**: Возможна с libarchive

**Архитектуры:**
* x86_64
* aarch64
* riscv64

## Дополнительная информация

* **Репозиторий**: https://github.com/NurOS-Linux/libapg
* **Баг-трекер**: https://github.com/NurOS-Linux/libapg/issues
* **libiron**: https://github.com/ruzen42/iron-log
