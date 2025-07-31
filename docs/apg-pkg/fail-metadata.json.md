# Файл metadata.json

## Документация по файлу metadata.json

Файл `metadata.json` содержит информацию о пакете и используется системой управления пакетами apg.

### Пример файла metadata.json

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

### Описание полей


| Поле         | Описание                  | Пример                                                    |
| ------------ | ------------------------- | --------------------------------------------------------- |
| name         | Название пакета           | example-package                                           |
| version      | Версия программы          | 1.2.3                                                     |
| architecture | Целевая архитектура       | x86\_64, aarch64, risc_v, all, null                                     |
| description  | Подробное описание пакета | "Текстовый редактор с подсветкой синтаксиса"              |
| maintainer   | Сопровождающий пакета     | "Иван Петров [ivan@example.com](mailto:ivan@example.com)" |
| license      | Лицензия                  | MIT, GPL-3.0, Apache-2.0                                  |
| homepage     | Веб-сайт проекта          | https://example.com                                       |
| dependencies | Список зависимостей       | \["lib-example >= 2.0.0"]                                 |
| conflicts    | Конфликтующие пакеты      | \["old-package"]                                          |
| provides     | Виртуальные пакеты (Пакеты, которые предоставляет один пакет)        | \["virtual-package"]                                      |
| replaces     | Заменяемые пакеты         | \["legacy-package"]                                       |


### Важные замечания

* Поле `license` может быть `null`, но лучше указать соответствующую лицензию.
* Поле `architecture` может быть `null`.
* Убедитесь, что список зависимостей (`dependencies`) корректен, чтобы избежать проблем при установке.

### Дополнительная информация

Файл `metadata.json` играет важную роль в системе управления пакетами Tulpar. Правильное заполнение этого файла обеспечивает корректную установку и управление пакетами.
