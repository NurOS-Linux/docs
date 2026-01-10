# API и техническая документация Switch

## Архитектура программы

### Компоненты системы

```
┌─────────────────────────────────────────┐
│         Пользовательский интерфейс      │
│              (main.c)                   │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────▼──────────┐
        │   Парсинг команд   │
        │    (getopt)        │
        └─────────┬──────────┘
                  │
        ┌─────────▼──────────┐
        │  Загрузчик модулей │
        │    (module.c)      │
        └─────────┬──────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
┌────▼────┐  ┌───▼────┐  ┌───▼────┐
│ editor  │  │  java  │  │ python │
│  .sh    │  │  .sh   │  │  .sh   │
└─────────┘  └────────┘  └────────┘
```

### Исходные файлы

| Файл | Описание |
|------|----------|
| `main.c` | Точка входа, обработка аргументов командной строки |
| `module.c` | Загрузка, парсинг и выполнение модулей |
| `module.h` | Заголовочный файл для работы с модулями |
| `config.c` | Управление конфигурацией |
| `config.h` | Заголовочный файл конфигурации |
| `utils.c` | Вспомогательные функции |
| `utils.h` | Заголовочный файл утилит |

## Структуры данных

### module_info_t

Структура, представляющая информацию о модуле.

```c
typedef struct {
    char *name;              // Имя модуля
    char *category;          // Категория (system, development, etc.)
    char *description;       // Описание
    char *link;              // Основная символическая ссылка
    char *extra_links;       // Дополнительные ссылки
    char *path;              // Путь к файлу модуля
} module_info_t;
```

### module_list_t

Список загруженных модулей.

```c
typedef struct {
    module_info_t *modules;  // Массив модулей
    size_t count;            // Количество модулей
    size_t capacity;         // Вместимость массива
} module_list_t;
```

### alternative_t

Структура, представляющая альтернативу.

```c
typedef struct {
    char *path;              // Полный путь к программе
    char *name;              // Отображаемое имя
    int priority;            // Приоритет
} alternative_t;
```

### switch_config_t

Конфигурация программы.

```c
typedef struct {
    char *modules_dir;       // Путь к системным модулям
    char *user_modules_dir;  // Путь к пользовательским модулям
    bool color_enabled;      // Включен ли цветной вывод
} switch_config_t;
```

## API модулей

### Функции инициализации

#### module_list_init

Инициализация списка модулей.

```c
int module_list_init(module_list_t *list);
```

**Параметры:**
* `list` — указатель на структуру module_list_t

**Возвращает:**
* `0` при успехе
* `-1` при ошибке

#### module_list_free

Освобождение памяти списка модулей.

```c
void module_list_free(module_list_t *list);
```

**Параметры:**
* `list` — указатель на структуру module_list_t

### Функции сканирования

#### module_scan

Сканирование директорий на наличие модулей.

```c
int module_scan(module_list_t *list, const switch_config_t *config);
```

**Параметры:**
* `list` — список для добавления найденных модулей
* `config` — конфигурация с путями к директориям

**Возвращает:**
* `0` при успехе
* `-1` при ошибке

**Логика работы:**
1. Сканирует системную директорию модулей
2. Сканирует пользовательскую директорию модулей
3. Пользовательские модули перезаписывают системные при совпадении имен

### Функции поиска

#### module_find

Поиск модуля по имени.

```c
const module_info_t *module_find(const module_list_t *list, const char *name);
```

**Параметры:**
* `list` — список модулей
* `name` — имя искомого модуля

**Возвращает:**
* Указатель на module_info_t при нахождении
* `NULL` если модуль не найден

### Функции действий

#### module_action_list

Показать список доступных альтернатив для модуля.

```c
int module_action_list(const module_info_t *module);
```

**Параметры:**
* `module` — информация о модуле

**Возвращает:**
* `0` при успехе
* `-1` при ошибке

**Вывод:**
```
Available alternatives for editor:
  [1] nvim      /usr/bin/nvim      (priority: 80)
  [2] vim       /usr/bin/vim       (priority: 70)
```

#### module_action_show

Показать текущую конфигурацию модуля.

```c
int module_action_show(const module_info_t *module);
```

**Параметры:**
* `module` — информация о модуле

**Возвращает:**
* `0` при успехе
* `-1` при ошибке

#### module_action_set

Установить альтернативу.

```c
int module_action_set(const module_info_t *module, const char *target);
```

**Параметры:**
* `module` — информация о модуле
* `target` — имя или путь к устанавливаемой альтернативе

**Возвращает:**
* `0` при успехе
* `-1` при ошибке

**Логика работы:**
1. Выполняет `find_alternatives()` модуля
2. Ищет совпадение с `target` по имени или пути
3. Создает/обновляет символическую ссылку
4. Если указаны EXTRA_LINKS, создает дополнительные ссылки

#### module_action_help

Показать справку по модулю.

```c
int module_action_help(const module_info_t *module);
```

**Параметры:**
* `module` — информация о модуле

**Возвращает:**
* `0` при успехе
* `-1` при ошибке

### Функции вывода

#### module_print_list

Показать список всех доступных модулей.

```c
void module_print_list(const module_list_t *list);
```

**Параметры:**
* `list` — список модулей

**Вывод:**
```
Available modules:
  editor     (system)      Manage default text editor
  java       (development) Manage Java version
```

## API конфигурации

### config_init

Инициализация конфигурации.

```c
int config_init(switch_config_t *config);
```

**Параметры:**
* `config` — указатель на структуру конфигурации

**Возвращает:**
* `0` при успехе
* `-1` при ошибке

**Устанавливает:**
* `modules_dir` = `SWITCH_MODULES_DIR` (из meson.build)
* `user_modules_dir` = `~/.local/share/switch/modules/`
* `color_enabled` = `true` (если не установлены NO_COLOR или SWITCH_NO_COLOR)

### config_free

Освобождение памяти конфигурации.

```c
void config_free(switch_config_t *config);
```

**Параметры:**
* `config` — указатель на структуру конфигурации

## API утилит

### Цветной вывод

#### color_init

Инициализация цветного вывода.

```c
void color_init(void);
```

Проверяет переменные окружения `NO_COLOR` и `SWITCH_NO_COLOR`.

#### color_set_enabled

Включение/отключение цветного вывода.

```c
void color_set_enabled(bool enabled);
```

**Параметры:**
* `enabled` — true для включения, false для отключения

#### print_error

Вывод сообщения об ошибке (красным цветом).

```c
void print_error(const char *format, ...);
```

**Параметры:**
* `format` — строка формата printf
* `...` — дополнительные аргументы

#### print_success

Вывод сообщения об успехе (зеленым цветом).

```c
void print_success(const char *format, ...);
```

#### print_info

Вывод информационного сообщения (синим цветом).

```c
void print_info(const char *format, ...);
```

#### print_warning

Вывод предупреждения (желтым цветом).

```c
void print_warning(const char *format, ...);
```

### Работа с файлами

#### file_exists

Проверка существования файла.

```c
bool file_exists(const char *path);
```

**Параметры:**
* `path` — путь к файлу

**Возвращает:**
* `true` если файл существует
* `false` если не существует

#### is_executable

Проверка, является ли файл исполняемым.

```c
bool is_executable(const char *path);
```

**Параметры:**
* `path` — путь к файлу

**Возвращает:**
* `true` если файл исполняемый
* `false` если нет

## Протокол взаимодействия с модулями

### Загрузка модуля

1. Switch читает shell-скрипт модуля
2. Извлекает метаданные через `grep` и `sed`:
   ```bash
   MODULE_NAME=$(grep '^MODULE_NAME=' module.sh | cut -d'"' -f2)
   ```
3. Сохраняет информацию в структуру `module_info_t`

### Выполнение find_alternatives

1. Switch выполняет скрипт модуля в subshell:
   ```bash
   bash module.sh find_alternatives
   ```
2. Читает вывод построчно
3. Парсит формат `path|name|priority`
4. Создает массив структур `alternative_t`

### Создание символической ссылки

1. Удаляет существующую ссылку (если есть):
   ```c
   unlink(link_path);
   ```
2. Создает новую символическую ссылку:
   ```c
   symlink(target_path, link_path);
   ```
3. Проверяет результат и выводит сообщение

## Переменные компиляции

Определяются в `meson.build`:

| Переменная | Значение по умолчанию | Описание |
|------------|----------------------|----------|
| `SWITCH_VERSION` | Из meson.project | Версия программы |
| `SWITCH_MODULES_DIR` | `{datadir}/switch/modules` | Системная директория модулей |
| `SWITCH_USER_MODULES_DIR` | `.local/share/switch/modules` | Пользовательская директория |

## Коды возврата

| Код | Значение |
|-----|----------|
| `0` | Успех |
| `1` | Общая ошибка |
| `2` | Ошибка парсинга аргументов |
| `3` | Модуль не найден |
| `4` | Альтернатива не найдена |
| `5` | Ошибка создания символической ссылки |

## Примеры использования API

### Пример 1: Программная загрузка модулей

```c
#include "module.h"
#include "config.h"

int main() {
    switch_config_t config;
    module_list_t modules;

    // Инициализация
    config_init(&config);
    module_list_init(&modules);

    // Сканирование модулей
    module_scan(&modules, &config);

    // Поиск модуля editor
    const module_info_t *editor = module_find(&modules, "editor");
    if (editor) {
        // Показать альтернативы
        module_action_list(editor);
    }

    // Очистка
    module_list_free(&modules);
    config_free(&config);

    return 0;
}
```

### Пример 2: Создание собственной обертки

```c
#include "module.h"

// Функция для автоматической установки приоритетной альтернативы
int auto_set_best_alternative(const char *module_name) {
    switch_config_t config;
    module_list_t modules;

    config_init(&config);
    module_list_init(&modules);
    module_scan(&modules, &config);

    const module_info_t *module = module_find(&modules, module_name);
    if (!module) {
        module_list_free(&modules);
        config_free(&config);
        return -1;
    }

    // Получить список альтернатив
    // Найти с наивысшим приоритетом
    // Установить её
    // (логика упрощена)

    module_list_free(&modules);
    config_free(&config);
    return 0;
}
```

## Расширение функциональности

### Добавление новых действий

1. Определить функцию в `module.c`:
   ```c
   int module_action_custom(const module_info_t *module) {
       // Ваша логика
       return 0;
   }
   ```

2. Добавить в `module.h`:
   ```c
   int module_action_custom(const module_info_t *module);
   ```

3. Обработать в `main.c`:
   ```c
   else if (strcmp(action, "custom") == 0) {
       ret = module_action_custom(module);
   }
   ```

### Добавление новых полей модуля

1. Расширить структуру `module_info_t`
2. Обновить логику парсинга в `module.c`
3. Обновить функцию освобождения памяти
