# Файл metadata.json (APGv1)

:::warning Устаревшая версия
Это документация для APG v1 (Legacy). Рекомендуется использовать [APG v2](../apgv2/fail-metadata.json.md).
:::

## Документация по файлу metadata.json

Файл `metadata.json` содержит информацию о пакете и используется системой управления пакетами APG.

## Пример файла metadata.json

```json
{
    "name": "TestAPG",
    "version": "0.0",
    "architecture": "x86_64",
    "description": "The test package.",
    "maintainer": "NurOS Developers",
    "license": "MIT",
    "homepage": "https://nuros.org",
    "dependencies": [
        "testapg2"
    ],
    "conflicts": [
        "testapg3"
    ],
    "provides": [
        "libfoo-dev"
    ],
    "replaces": [
        "example-apg"
    ]
}
```

## Описание полей

| Поле | Описание | Пример | Обязательное |
|------|----------|--------|:------------:|
| `name` | Название пакета | `example-package` | Да |
| `version` | Версия программы | `1.2.3` | Да |
| `architecture` | Целевая архитектура | `x86_64`, `aarch64`, `risc_v`, `all`, `null` | Нет |
| `description` | Подробное описание пакета | `"Текстовый редактор с подсветкой синтаксиса"` | Нет |
| `maintainer` | Сопровождающий пакета | `"Иван Петров <ivan@example.com>"` | Нет |
| `license` | Лицензия | `MIT`, `GPL-3.0`, `Apache-2.0` | Нет |
| `homepage` | Веб-сайт проекта | `https://example.com` | Нет |
| `dependencies` | Список зависимостей | `["lib-example >= 2.0.0"]` | Нет |
| `conflicts` | Конфликтующие пакеты | `["old-package"]` | Нет |
| `provides` | Виртуальные пакеты | `["virtual-package"]` | Нет |
| `replaces` | Заменяемые пакеты | `["legacy-package"]` | Нет |

## Подробное описание полей

### name (обязательное)

Уникальное имя пакета в системе.

**Правила:**
- Только строчные буквы латинского алфавита
- Цифры разрешены (но не в начале)
- Дефис `-` разрешен (но не в начале и конце)
- Длина: 2-64 символа

**Примеры:**
```json
"name": "firefox"
"name": "lib-archive-dev"
"name": "python3"
```

### version (обязательное)

Версия программного обеспечения.

**Формат:** произвольная строка (рекомендуется semver)

**Примеры:**
```json
"version": "1.0.0"
"version": "2.3.4-beta"
"version": "20230101"
```

### architecture

Целевая архитектура процессора.

**Допустимые значения:**
- `x86_64` — 64-битные процессоры Intel/AMD
- `aarch64` — 64-битные процессоры ARM
- `risc_v` — RISC-V процессоры
- `all` — архитектурно-независимый пакет
- `null` или отсутствует — не указано

**Примеры:**
```json
"architecture": "x86_64"
"architecture": "all"
"architecture": null
```

### description

Краткое описание пакета на русском или английском языке.

**Примеры:**
```json
"description": "Веб-браузер Mozilla Firefox"
"description": "The test package."
```

### maintainer

Информация о сопровождающем пакета.

**Формат:** `Имя <email>`

**Примеры:**
```json
"maintainer": "NurOS Developers"
"maintainer": "Иван Петров <ivan@example.com>"
```

### license

Лицензия программного обеспечения.

**Примеры:**
```json
"license": "MIT"
"license": "GPL-3.0"
"license": "Apache-2.0"
"license": "BSD-2-Clause"
"license": null
```

### homepage

URL домашней страницы проекта.

**Примеры:**
```json
"homepage": "https://nuros.org"
"homepage": "https://github.com/example/project"
```

### dependencies

Список пакетов, необходимых для работы.

**Формат:** массив строк

**Поддержка версий в APGv1:**
- ❌ Операторы версий не поддерживаются полноценно
- ✅ Можно указать, но не будут проверяться

**Примеры:**
```json
"dependencies": ["libc", "libarchive"]
"dependencies": ["lib-example >= 2.0.0"]
"dependencies": []
```

### conflicts

Список пакетов, конфликтующих с данным.

**Примеры:**
```json
"conflicts": ["old-package", "alternative-package"]
"conflicts": []
```

### provides

Список виртуальных пакетов, которые предоставляет данный пакет.

**Примеры:**
```json
"provides": ["libfoo-dev", "foo-bin"]
"provides": []
```

**Использование:**
```
Пакет "gcc" может provides: ["c-compiler"]
Пакет "clang" может provides: ["c-compiler"]
Другие пакеты зависят от: "c-compiler"
```

### replaces

Список пакетов, которые заменяет данный пакет.

**Примеры:**
```json
"replaces": ["old-version", "deprecated-package"]
"replaces": []
```

## Важные замечания APGv1

### Отличия от APGv2

1. **Упрощенная структура**
   - Меньше обязательных полей
   - Отсутствует поле `release`
   - Отсутствует поле `build_date`
   - Отсутствует поле `install_size`

2. **Ограниченная поддержка зависимостей**
   - Операторы версий (`>=`, `<=`, `>`, `<`, `=`) указываются, но не проверяются
   - Нет поддержки виртуальных зависимостей

3. **Архитектура**
   - Используется `risc_v` вместо `riscv64`
   - Поле может быть `null`

4. **Контрольные суммы**
   - Только MD5 (в файле `md5sums`)
   - Нет поддержки CRC32

## Полный пример пакета

```json
{
    "name": "firefox",
    "version": "120.0",
    "architecture": "x86_64",
    "description": "Веб-браузер Mozilla Firefox",
    "maintainer": "NurOS Developers <dev@nuros.org>",
    "license": "MPL-2.0",
    "homepage": "https://firefox.com",
    "dependencies": [
        "gtk3",
        "dbus",
        "libx11"
    ],
    "conflicts": [
        "firefox-esr"
    ],
    "provides": [
        "web-browser"
    ],
    "replaces": []
}
```

## Структура пакета APGv1

```
package.apg
├── metadata.json      # Метаданные (этот файл)
├── md5sums            # MD5 контрольные суммы
├── data/              # Файлы для установки
│   ├── usr/
│   │   ├── bin/
│   │   └── lib/
│   └── etc/
├── scripts/           # Скрипты (опционально)
│   ├── pre-install
│   ├── post-install
│   ├── pre-remove
│   └── post-remove
└── home/              # Файлы для $HOME (опционально)
```

## Валидация metadata.json

### Минимально рабочий файл

```json
{
    "name": "myapp",
    "version": "1.0"
}
```

### Проверка синтаксиса

```bash
# Проверить JSON синтаксис
jq . metadata.json

# Проверить наличие обязательных полей
jq '.name, .version' metadata.json
```

## Миграция на APGv2

Для миграции пакета с APGv1 на APGv2:

1. Добавить поле `release` (целое число)
2. Изменить `risc_v` на `riscv64`
3. Обернуть все поля в объект `package`
4. Добавить `build_date` и `install_size`
5. Заменить `md5sums` на `crc32sums`

**Пример миграции:**

**APGv1:**
```json
{
    "name": "myapp",
    "version": "1.0.0",
    "architecture": "x86_64"
}
```

**APGv2:**
```json
{
    "package": {
        "name": "myapp",
        "version": "1.0.0",
        "release": 1,
        "architecture": "x86_64",
        "build_date": "2025-01-10T00:00:00Z"
    }
}
```

## Примеры пакетов

### Официальный пример APGv1

Смотрите полный пример пакета в формате APGv1:
- **Репозиторий**: https://github.com/NurOS-Linux/APGexample
- **Ветка APGv1**: https://github.com/NurOS-Linux/APGexample/tree/APGv1

### Структура примера

```bash
git clone -b APGv1 https://github.com/NurOS-Linux/APGexample
cd APGexample
cat metadata.json
```

## Дополнительная информация

* [Структура пакета APGv1](./struktura-paketa.md)
* [Миграция на APGv2](../apgv2/obzor.md)
* [Официальный пример](https://github.com/NurOS-Linux/APGexample/tree/APGv1)
