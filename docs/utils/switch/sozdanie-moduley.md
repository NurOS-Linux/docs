# Создание модулей для Switch

## Структура модуля

### Базовый шаблон

Модуль Switch представляет собой исполняемый shell-скрипт со следующей структурой:

```bash
#!/bin/bash
# switch module: <имя>
# Copyright (C) 2026 Ваше Имя
# SPDX-License-Identifier: GPL-3.0-or-later

# ============================================================
# Метаданные модуля
# ============================================================

MODULE_NAME="имя-модуля"
MODULE_CATEGORY="категория"
MODULE_DESCRIPTION="Краткое описание"
MODULE_LINK="/путь/к/символической/ссылке"
MODULE_EXTRA_LINKS="/путь1:/путь2"  # Опционально

# ============================================================
# Функция поиска альтернатив
# Формат вывода: путь|имя|приоритет (одна строка на альтернативу)
# ============================================================

find_alternatives() {
    # Ваша логика поиска альтернатив
    [[ -x /usr/bin/program1 ]] && echo "/usr/bin/program1|program1|50"
    [[ -x /usr/bin/program2 ]] && echo "/usr/bin/program2|program2|40"
}
```

## Метаданные модуля

### Обязательные поля

#### MODULE_NAME

Уникальный идентификатор модуля. Используется в командной строке.

```bash
MODULE_NAME="browser"
```

**Требования:**
* Только строчные буквы, цифры, дефис
* Без пробелов и специальных символов
* Уникальное имя в системе

#### MODULE_DESCRIPTION

Краткое описание назначения модуля (одна строка).

```bash
MODULE_DESCRIPTION="Управление веб-браузером по умолчанию"
```

**Рекомендации:**
* Максимум 60-80 символов
* Начинать с глагола ("Управление...", "Выбор...")
* Без точки в конце

#### MODULE_LINK

Путь к основной символической ссылке, которой управляет модуль.

```bash
MODULE_LINK="/usr/bin/x-www-browser"
```

**Требования:**
* Абсолютный путь
* Директория должна существовать
* Обычно в `/usr/bin/` или `/usr/local/bin/`

#### find_alternatives()

Функция bash, которая находит и выводит доступные альтернативы.

```bash
find_alternatives() {
    [[ -x /usr/bin/firefox ]] && echo "/usr/bin/firefox|firefox|80"
    [[ -x /usr/bin/chromium ]] && echo "/usr/bin/chromium|chromium|70"
}
```

**Формат вывода:** `путь|имя|приоритет`

* **путь** — полный путь к исполняемому файлу
* **имя** — отображаемое имя (для вывода пользователю)
* **приоритет** — целое число (выше = предпочтительнее)

### Опциональные поля

#### MODULE_CATEGORY

Категория модуля для группировки.

```bash
MODULE_CATEGORY="desktop"
```

**Допустимые значения:**
* `system` — системные утилиты
* `development` — инструменты разработки
* `desktop` — приложения рабочего стола
* Пользовательские категории

#### MODULE_EXTRA_LINKS

Дополнительные символические ссылки (через двоеточие).

```bash
MODULE_EXTRA_LINKS="/usr/bin/browser:/usr/local/bin/www-browser"
```

Все ссылки будут указывать на одну и ту же цель при установке альтернативы.

## Примеры модулей

### Пример 1: Простой модуль для браузера

```bash
#!/bin/bash
# switch module: browser
# SPDX-License-Identifier: GPL-3.0-or-later

MODULE_NAME="browser"
MODULE_CATEGORY="desktop"
MODULE_DESCRIPTION="Управление веб-браузером по умолчанию"
MODULE_LINK="/usr/bin/x-www-browser"

find_alternatives() {
    # Проверяем наличие браузеров
    [[ -x /usr/bin/firefox ]] && echo "/usr/bin/firefox|firefox|80"
    [[ -x /usr/bin/chromium ]] && echo "/usr/bin/chromium|chromium|70"
    [[ -x /usr/bin/brave ]] && echo "/usr/bin/brave|brave|60"
    [[ -x /usr/bin/qutebrowser ]] && echo "/usr/bin/qutebrowser|qutebrowser|50"
}
```

### Пример 2: Модуль с несколькими ссылками

```bash
#!/bin/bash
# switch module: shell
# SPDX-License-Identifier: GPL-3.0-or-later

MODULE_NAME="shell"
MODULE_CATEGORY="system"
MODULE_DESCRIPTION="Управление командной оболочкой по умолчанию"
MODULE_LINK="/bin/sh"
MODULE_EXTRA_LINKS="/usr/bin/sh"

find_alternatives() {
    [[ -x /bin/bash ]] && echo "/bin/bash|bash|100"
    [[ -x /bin/zsh ]] && echo "/bin/zsh|zsh|90"
    [[ -x /bin/fish ]] && echo "/bin/fish|fish|80"
    [[ -x /bin/dash ]] && echo "/bin/dash|dash|70"
}
```

### Пример 3: Модуль с динамическим поиском

```bash
#!/bin/bash
# switch module: gcc
# SPDX-License-Identifier: GPL-3.0-or-later

MODULE_NAME="gcc"
MODULE_CATEGORY="development"
MODULE_DESCRIPTION="Управление версией компилятора GCC"
MODULE_LINK="/usr/bin/gcc"
MODULE_EXTRA_LINKS="/usr/bin/cc:/usr/bin/g++"

find_alternatives() {
    # Поиск всех установленных версий GCC
    for gcc in /usr/bin/gcc-*; do
        if [[ -x "$gcc" ]]; then
            # Извлечь номер версии
            local version="${gcc##*-}"
            # Рассчитать приоритет на основе версии
            local priority=$((version * 10))
            local name="gcc-${version}"

            echo "$gcc|$name|$priority"
        fi
    done

    # Добавить стандартный gcc, если есть
    [[ -x /usr/bin/gcc ]] && echo "/usr/bin/gcc|gcc|50"
}
```

### Пример 4: Модуль с проверкой зависимостей

```bash
#!/bin/bash
# switch module: nodejs
# SPDX-License-Identifier: GPL-3.0-or-later

MODULE_NAME="nodejs"
MODULE_CATEGORY="development"
MODULE_DESCRIPTION="Управление версией Node.js"
MODULE_LINK="/usr/bin/node"
MODULE_EXTRA_LINKS="/usr/bin/nodejs:/usr/bin/npm"

find_alternatives() {
    # Проверка установленных версий через nvm
    if [[ -d "$HOME/.nvm/versions/node" ]]; then
        for nodedir in "$HOME/.nvm/versions/node"/v*; do
            local node="$nodedir/bin/node"
            if [[ -x "$node" ]]; then
                local version="${nodedir##*/v}"
                local priority=$((${version%%.*} * 10))
                echo "$node|node-${version}|$priority"
            fi
        done
    fi

    # Системный Node.js
    [[ -x /usr/bin/node ]] && echo "/usr/bin/node|node-system|100"
}
```

## Установка модуля

### Пользовательский модуль

```bash
# Создать директорию
mkdir -p ~/.local/share/switch/modules/

# Скопировать модуль
cp mymodule.sh ~/.local/share/switch/modules/

# Сделать исполняемым
chmod +x ~/.local/share/switch/modules/mymodule.sh

# Проверить
switch --list-modules
switch mymodule list
```

### Системный модуль (требует root)

```bash
# Скопировать в системную директорию
sudo cp mymodule.sh /usr/share/switch/modules/

# Установить права
sudo chmod +x /usr/share/switch/modules/mymodule.sh
sudo chown root:root /usr/share/switch/modules/mymodule.sh

# Проверить
switch --list-modules
```

## Рекомендации по разработке

### Проверка существования файлов

Всегда проверяйте, существует ли файл перед добавлением в список:

```bash
find_alternatives() {
    # Правильно
    [[ -x /usr/bin/program ]] && echo "/usr/bin/program|program|50"

    # Неправильно (без проверки)
    echo "/usr/bin/program|program|50"
}
```

### Приоритеты

Используйте осмысленные приоритеты:

* **90-100**: Новейшие/рекомендуемые версии
* **70-89**: Стабильные версии
* **50-69**: Старые, но поддерживаемые версии
* **30-49**: Устаревшие версии
* **10-29**: Минимально функциональные версии

### Производительность

Избегайте медленных операций в `find_alternatives()`:

```bash
# Плохо: медленная команда
find_alternatives() {
    find / -name "program*" -type f 2>/dev/null | while read file; do
        echo "$file|$(basename $file)|50"
    done
}

# Хорошо: известные пути
find_alternatives() {
    for prog in /usr/bin/program*; do
        [[ -x "$prog" ]] && echo "$prog|$(basename $prog)|50"
    done
}
```

### Обработка ошибок

Модули должны корректно работать даже если альтернативы не найдены:

```bash
find_alternatives() {
    local found=0

    [[ -x /usr/bin/prog1 ]] && { echo "/usr/bin/prog1|prog1|50"; found=1; }
    [[ -x /usr/bin/prog2 ]] && { echo "/usr/bin/prog2|prog2|40"; found=1; }

    # Если ничего не найдено, функция просто ничего не выведет
    # Switch сам сообщит пользователю об отсутствии альтернатив
}
```

## Тестирование модуля

### Базовая проверка

```bash
# Проверка синтаксиса
bash -n mymodule.sh

# Проверка исполняемости
chmod +x mymodule.sh

# Ручной запуск функции
source mymodule.sh
find_alternatives
```

### Интеграционное тестирование

```bash
# Установить модуль
cp mymodule.sh ~/.local/share/switch/modules/

# Проверить видимость
switch --list-modules | grep mymodule

# Проверить список альтернатив
switch mymodule list

# Проверить справку
switch mymodule help

# Проверить установку (если есть альтернативы)
switch mymodule set <альтернатива>
switch mymodule show
```

## Отладка

### Включение отладочной информации

```bash
# Добавить в начало функции find_alternatives
find_alternatives() {
    # Отладочный вывод в stderr
    echo "DEBUG: Searching for alternatives..." >&2

    [[ -x /usr/bin/prog ]] && {
        echo "DEBUG: Found prog" >&2
        echo "/usr/bin/prog|prog|50"
    }
}
```

### Проверка вывода

```bash
# Проверить формат вывода
source mymodule.sh
find_alternatives | while IFS='|' read path name prio; do
    echo "Path: $path"
    echo "Name: $name"
    echo "Priority: $prio"
    echo "---"
done
```

## Упаковка модуля

### Создание пакета APG

```bash
# Структура пакета
mkdir -p switch-module-browser/data/usr/share/switch/modules/
cp browser.sh switch-module-browser/data/usr/share/switch/modules/

# Создать metadata.json
cd switch-module-browser
apgbuild -m .

# Заполнить metadata.json
# name: switch-module-browser
# version: 1.0.0
# description: Browser module for switch

# Создать пакет
apgbuild --makesums .
cd ..
apgbuild -o switch-module-browser-1.0.0-1-all.apg switch-module-browser
```

## Публикация модуля

### Репозиторий

Создайте репозиторий для вашего модуля:

```
switch-module-browser/
├── README.md
├── LICENSE
├── browser.sh
└── metadata.json (для APG)
```

### Документация

Включите в README:
* Описание модуля
* Список поддерживаемых программ
* Инструкции по установке
* Примеры использования
* Информация о лицензии