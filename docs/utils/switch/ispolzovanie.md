# Использование Switch

## Синтаксис командной строки

### Базовый формат

```bash
switch [ОПЦИИ] <модуль> <действие> [аргументы...]
```

### Компоненты команды

* **ОПЦИИ** — глобальные флаги программы
* **модуль** — имя модуля для работы (editor, java, python и т.д.)
* **действие** — операция над модулем (list, show, set, help)
* **аргументы** — дополнительные параметры для действия

## Глобальные опции

### Список опций

| Опция | Краткая форма | Описание |
|-------|---------------|----------|
| `--list-modules` | `-l` | Показать все доступные модули |
| `--help` | `-h` | Показать справочное сообщение |
| `--version` | `-V` | Показать версию программы |
| `--no-color` | — | Отключить цветной вывод |

### Примеры использования опций

```bash
# Показать все доступные модули
switch --list-modules
switch -l

# Показать справку
switch --help
switch -h

# Показать версию
switch --version
switch -V

# Отключить цветной вывод
switch --no-color editor list
```

## Действия модулей

### list — Показать доступные альтернативы

Выводит список всех найденных альтернатив для данного модуля.

```bash
switch <модуль> list
```

**Пример вывода:**

```
Available alternatives for editor:
  [1] nvim      /usr/bin/nvim      (priority: 80)
  [2] vim       /usr/bin/vim       (priority: 70)
  [3] nano      /usr/bin/nano      (priority: 60)
  [4] vi        /usr/bin/vi        (priority: 30)
```

### show — Показать текущую конфигурацию

Отображает, какая альтернатива активна в данный момент.

```bash
switch <модуль> show
```

**Пример вывода:**

```
Current configuration for editor:
  Link: /usr/bin/editor
  Target: /usr/bin/vim
  Alternative: vim (priority: 70)
```

### set — Установить альтернативу

Устанавливает указанную альтернативу как активную.

```bash
switch <модуль> set <цель>
```

**Пример:**

```bash
switch editor set nvim
```

**Пример вывода:**

```
Setting editor to nvim...
  Created symlink: /usr/bin/editor → /usr/bin/nvim
Successfully set editor to nvim
```

### help — Справка по модулю

Показывает информацию о модуле: описание, управляемые ссылки, категорию.

```bash
switch <модуль> help
```

**Пример вывода:**

```
Module: editor
Category: system
Description: Manage default text editor

Managed links:
  /usr/bin/editor

Available actions:
  list    List available editors
  show    Show current editor
  set     Set default editor
  help    Show this help
```

## Примеры работы с модулями

### Управление текстовым редактором

```bash
# Показать доступные редакторы
switch editor list

# Показать текущий редактор
switch editor show

# Установить vim как редактор по умолчанию
switch editor set vim

# Установить nvim как редактор по умолчанию
switch editor set nvim

# Справка по модулю
switch editor help
```

### Управление версией Java

```bash
# Показать доступные версии Java
switch java list

# Показать текущую версию
switch java show

# Установить Java 17
switch java set java-17-openjdk

# Установить Java 21
switch java set java-21-openjdk
```

### Управление версией Python

```bash
# Показать доступные версии Python
switch python list

# Показать текущую версию
switch python show

# Установить Python 3.11
switch python set python3.11

# Установить Python 3.12
switch python set python3.12
```

### Управление ядром системы

:::warning Внимание
Управление ядром требует прав суперпользователя (root).
:::

```bash
# Показать доступные ядра
sudo switch kernel list

# Показать текущее ядро
sudo switch kernel show

# Установить ядро версии 6.8.0
sudo switch kernel set 6.8.0

# Установить ядро версии 6.9.0
sudo switch kernel set 6.9.0
```

## Переменные окружения

### NO_COLOR

Стандартная переменная для отключения цветного вывода в Unix-программах.

```bash
# Отключить цвет через переменную окружения
NO_COLOR=1 switch editor list

# Экспортировать для всех команд в сессии
export NO_COLOR=1
switch editor list
```

### SWITCH_NO_COLOR

Специфичная для switch переменная отключения цвета.

```bash
# Отключить цвет только для switch
SWITCH_NO_COLOR=1 switch editor list

# Экспортировать
export SWITCH_NO_COLOR=1
switch editor list
```

## Расположение файлов

### Директории модулей

| Тип | Путь | Приоритет |
|-----|------|-----------|
| Системные | `/usr/share/switch/modules/` | Низкий |
| Пользовательские | `~/.local/share/switch/modules/` | Высокий |

При совпадении имен модулей используется пользовательский модуль.

### Создание директории для пользовательских модулей

```bash
mkdir -p ~/.local/share/switch/modules/
```

## Советы по использованию

### Быстрая проверка доступных модулей

```bash
# Краткий список
switch -l

# Подробная информация о каждом модуле
for module in $(switch -l | tail -n +2); do
  echo "=== $module ==="
  switch $module help
  echo
done
```

### Проверка всех текущих конфигураций

```bash
# Показать текущие настройки всех модулей
for module in $(switch -l | tail -n +2); do
  echo "=== $module ==="
  switch $module show
  echo
done
```

### Автоматизация установки

```bash
#!/bin/bash
# Скрипт для установки предпочитаемых альтернатив

switch editor set nvim
switch python set python3.12
switch java set java-17-openjdk

echo "Альтернативы установлены"
```

## Обработка ошибок

### Модуль не найден

```
Error: Module 'unknown' not found

Use 'switch --list-modules' to see available modules.
```

**Решение**: Проверьте написание имени модуля или установите необходимый модуль.

### Альтернатива не найдена

```
Error: Alternative 'emacs' not found for module 'editor'

Available alternatives:
  nvim, vim, nano, vi
```

**Решение**: Установите программу или выберите другую доступную альтернативу.

### Недостаточно прав

```
Error: Permission denied when creating symlink
```

**Решение**: Используйте `sudo` для модулей, требующих прав root (например, kernel).

### Некорректный синтаксис

```
Error: Missing argument for 'set' action
Usage: switch editor set <target>
```

**Решение**: Укажите все необходимые аргументы команды.