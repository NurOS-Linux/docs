# Встроенные модули Switch

## Обзор встроенных модулей

Switch поставляется с набором готовых модулей для управления наиболее распространенными альтернативами в системе.

## Модуль: editor

### Описание

Управление текстовым редактором по умолчанию, используемым системными скриптами и приложениями.

### Метаданные

* **Имя**: `editor`
* **Категория**: `system`
* **Управляемая ссылка**: `/usr/bin/editor`
* **Файл модуля**: `editor.sh`

### Поддерживаемые редакторы

| Редактор | Путь | Приоритет | Описание |
|----------|------|-----------|----------|
| nvim | `/usr/bin/nvim` | 80 | Neovim - современный форк Vim |
| vim | `/usr/bin/vim` | 70 | Vi IMproved - расширенный vi |
| nano | `/usr/bin/nano` | 60 | Простой консольный редактор |
| emacs | `/usr/bin/emacs` | 50 | Расширяемый редактор GNU |
| micro | `/usr/bin/micro` | 45 | Современный терминальный редактор |
| helix | `/usr/bin/helix` | 40 | Пост-современный модальный редактор |
| vi | `/usr/bin/vi` | 30 | Классический vi |
| code | `/usr/bin/code` | 20 | Visual Studio Code (консольная версия) |
| kate | `/usr/bin/kate` | 15 | KDE Advanced Text Editor |
| gedit | `/usr/bin/gedit` | 15 | GNOME Text Editor |

### Примеры использования

```bash
# Показать доступные редакторы
switch editor list

# Установить nvim
switch editor set nvim

# Проверить текущий редактор
switch editor show
```

### Использование в скриптах

После установки альтернативы, переменная `$EDITOR` и команда `editor` будут указывать на выбранный редактор:

```bash
# Открыть файл в редакторе по умолчанию
editor myfile.txt

# Использовать в переменной окружения
export EDITOR=/usr/bin/editor
git config --global core.editor editor
```

## Модуль: java

### Описание

Управление версией Java Development Kit (JDK) и Java Runtime Environment (JRE).

### Метаданные

* **Имя**: `java`
* **Категория**: `development`
* **Управляемые ссылки**:
  * `/usr/bin/java`
  * `/usr/bin/javac`
  * `/usr/bin/jar`
* **Файл модуля**: `java.sh`

### Поддерживаемые версии

Модуль автоматически находит установленные версии Java в стандартных расположениях:

* `/usr/lib/jvm/java-*-openjdk/bin/java`
* `/usr/lib/jvm/java-*/bin/java`
* `/opt/java/*/bin/java`

### Приоритеты версий

| Версия | Приоритет |
|--------|-----------|
| Java 21 | 100 |
| Java 17 (LTS) | 95 |
| Java 11 (LTS) | 85 |
| Java 8 (LTS) | 75 |
| Другие версии | 50 |

### Примеры использования

```bash
# Показать доступные версии Java
switch java list

# Установить Java 17
switch java set java-17-openjdk

# Проверить текущую версию
switch java show

# Проверить через java напрямую
java -version
```

### Использование в разработке

```bash
# Установить JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk

# Проверить версию компилятора
javac -version

# Запуск Java-приложения
java -jar application.jar
```

## Модуль: python

### Описание

Управление версией интерпретатора Python, используемого по умолчанию.

### Метаданные

* **Имя**: `python`
* **Категория**: `development`
* **Управляемые ссылки**:
  * `/usr/bin/python`
  * `/usr/bin/python3`
* **Файл модуля**: `python.sh`

### Поддерживаемые версии

Модуль находит все установленные версии Python 3.x:

* `/usr/bin/python3.12`
* `/usr/bin/python3.11`
* `/usr/bin/python3.10`
* `/usr/bin/python3.9`
* И другие версии в `/usr/bin/`

### Приоритеты версий

| Версия | Приоритет |
|--------|-----------|
| Python 3.12 | 100 |
| Python 3.11 | 95 |
| Python 3.10 | 90 |
| Python 3.9 | 85 |
| Более старые | Динамически (версия × 10) |

### Примеры использования

```bash
# Показать доступные версии Python
switch python list

# Установить Python 3.12
switch python set python3.12

# Проверить текущую версию
switch python show

# Проверить через python напрямую
python --version
python3 --version
```

### Использование в разработке

```bash
# Создание виртуального окружения
python -m venv myenv

# Установка пакетов
pip install package-name

# Запуск скриптов
python script.py
```

## Модуль: kernel

### Описание

Управление версией ядра Linux, используемой при загрузке системы.

### Метаданные

* **Имя**: `kernel`
* **Категория**: `system`
* **Управляемые ссылки**:
  * `/boot/vmlinuz`
  * `/boot/initrd.img`
* **Файл модуля**: `kernel.sh`
* **Требования**: Права root

:::warning Внимание
Этот модуль требует прав суперпользователя для работы. Неправильная конфигурация может привести к невозможности загрузки системы.
:::

### Поддерживаемые ядра

Модуль находит все установленные ядра в `/boot/`:

* `/boot/vmlinuz-*`
* Соответствующие initrd/initramfs образы

### Примеры использования

```bash
# Показать доступные ядра (требует root)
sudo switch kernel list

# Установить ядро 6.8.0
sudo switch kernel set 6.8.0

# Проверить текущее ядро
sudo switch kernel show

# Проверить загруженное ядро
uname -r
```

### Интеграция с загрузчиком

После изменения ядра необходимо обновить конфигурацию загрузчика:

```bash
# Для GRUB
sudo grub-mkconfig -o /boot/grub/grub.cfg

# Для systemd-boot
sudo bootctl update
```

## Расположение модулей

### Системные модули

```
/usr/share/switch/modules/
├── editor.sh
├── java.sh
├── kernel.sh
└── python.sh
```

### Пользовательские модули

```
~/.local/share/switch/modules/
└── (пользовательские модули)
```

## Проверка модулей

### Список всех модулей

```bash
switch --list-modules
```

**Пример вывода:**

```
Available modules:
  editor     (system)      Manage default text editor
  java       (development) Manage Java version
  kernel     (system)      Manage kernel version
  python     (development) Manage Python version
```

### Подробная информация о модуле

```bash
switch <модуль> help
```

### Проверка файлов модуля

```bash
# Просмотр системных модулей
ls -l /usr/share/switch/modules/

# Просмотр пользовательских модулей
ls -l ~/.local/share/switch/modules/
```