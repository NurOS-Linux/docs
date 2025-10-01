# Файл metadata.json

## Документация по файлу metadata.json

Файл `metadata.json` содержит информацию о пакете и используется системой управления пакетами apg.

### Пример файла metadata.json

```json
{
    "name": "apgexample",
    "version": "0.0.0",
    "type": "misc",
    "architecture": null,
    "description": "The APG example package for NurOS (Tulpar).",
    "maintainer": "NurOS Developers",
    "license": null,
    "tags": [
        "example",
        "test",
        "apg"
    ]
    "homepage": "https://nuros.org",
    "dependencies": [],
    "conflicts": [
        "testapg"
    ],
    "provides": [],
    "replaces": [
        "example-apg"
    ],
    "conf": [
        "/etc/example.conf",
        "$HOME/exmplrc"
    ]
}
```

## Описание полей


| Поле         | Описание поля             | Пример содержания                                         |
| ------------ | ------------------------- | --------------------------------------------------------- |
| name         | Название пакета           | example-package                                           |
| version      | Версия программы          | 1.2.3                                                     |
| type         | Тип пакета                | misc, binary, source                                      |
| architecture | Целевая архитектура       | x86\_64, aarch64, risc_v, all, null                       |
| description  | Подробное описание пакета | "Текстовый редактор с подсветкой синтаксиса"              |
| maintainer   | Сопровождающий пакета     | "Иван Петров [ivan@example.com](mailto:ivan@example.com)" |
| license      | Лицензия                  | MIT, GPL-3.0, Apache-2.0                                  |
| tags         | Тэги для поиска по ним    | ["example", "test", "apg"]                                |
| homepage     | Веб-сайт проекта          | https://example.com                                       |
| dependencies | Список зависимостей       | \["lib-example >= 2.0.0"]                                 |
| conflicts    | Конфликтующие пакеты      | \["old-package"]                                          |
| provides     | Виртуальные пакеты (Пакеты, которые предоставляет один пакет)        | \["virtual-package"] |
| replaces     | Заменяемые пакеты         | \["legacy-package"]                                       |
| conf         | Файлы конфигурации        | ["/etc/example.conf", "$HOME/exmplrc"]                    |


### Важные замечания

* Поле `license` может быть `null`, но лучше указать соответствующую лицензию.
* Поле `architecture` может быть `null`.
* Убедитесь, что список зависимостей (`dependencies`) корректен, чтобы избежать проблем при установке.
