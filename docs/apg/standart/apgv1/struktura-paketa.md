# Структура пакета APGv1

:::warning Устаревшая версия
Это документация для APG v1 (Legacy). Рекомендуется использовать [APG v2](../apgv2/struktura-paketa.md).
:::

## Обзор

APGv1 (Advanced Package v1) — первая версия формата пакетов для NurOS. Пакет представляет собой tar-архив с дополнительным сжатием.

## Структура архива

```
package.apg
├── metadata.json      # Метаданные пакета (обязательно)
├── md5sums            # MD5 контрольные суммы (обязательно)
├── data/              # Файлы для установки в / (обязательно)
│   ├── usr/
│   │   ├── bin/
│   │   └── lib/
│   └── etc/
├── scripts/           # Скрипты установки (опционально)
│   ├── pre-install
│   ├── post-install
│   ├── pre-remove
│   └── post-remove
└── home/              # Файлы для $HOME (опционально)
    └── .config/
```

## Компоненты пакета

| Компонент | Описание | Обязательный |
|-----------|----------|:------------:|
| `metadata.json` | Информация о пакете: имя, версия, зависимости | Да |
| `md5sums` | Контрольные суммы MD5 всех файлов пакета | Да |
| `data/` | Файлы, устанавливаемые в корень файловой системы `/` | Да |
| `scripts/` | Скрипты pre/post install/remove | Нет |
| `home/` | Файлы, устанавливаемые в домашний каталог `$HOME` | Нет |

## Подробнее о компонентах

### metadata.json

Содержит всю информацию о пакете в формате JSON. Подробнее см. [Файл metadata.json](./fail-metadata.json.md).

**Минимальный пример:**
```json
{
    "name": "myapp",
    "version": "1.0.0"
}
```

**Полный пример:**
```json
{
    "name": "myapp",
    "version": "1.0.0",
    "architecture": "x86_64",
    "description": "My application",
    "maintainer": "Developer <dev@example.com>",
    "license": "MIT",
    "homepage": "https://example.com",
    "dependencies": ["libc", "libarchive"],
    "conflicts": [],
    "provides": ["myapp-bin"],
    "replaces": []
}
```

### md5sums

Текстовый файл с MD5 контрольными суммами всех файлов пакета.

**Формат:**
```
<md5sum>  <relative-path>
```

**Пример:**
```
d41d8cd98f00b204e9800998ecf8427e  data/usr/bin/example
e99a18c428cb38d5f260853678922e03  data/etc/example.conf
5d41402abc4b2a76b9719d911017c592  data/usr/lib/libexample.so.1.0
```

**Генерация:**
```bash
# Для всех файлов в data/
find data -type f -exec md5sum {} \; > md5sums

# Или с помощью apgbuild (APGv1)
# apgbuild --makesums .
```

:::info Только MD5
APGv1 поддерживает только MD5 контрольные суммы. APGv2 добавляет поддержку CRC32.
:::

### data/

Каталог с файлами, которые будут распакованы в корень системы `/`. Структура внутри `data/` повторяет структуру файловой системы.

**Примеры:**

```
data/usr/bin/myapp          → /usr/bin/myapp
data/etc/myapp.conf         → /etc/myapp.conf
data/usr/lib/libmyapp.so.1  → /usr/lib/libmyapp.so.1
```

**Типичная структура:**
```
data/
├── usr/
│   ├── bin/              # Исполняемые файлы
│   ├── lib/              # Библиотеки
│   ├── share/            # Общие данные
│   │   ├── applications/ # .desktop файлы
│   │   ├── icons/        # Иконки
│   │   └── man/          # Man-страницы
│   └── include/          # Заголовочные файлы
├── etc/                  # Конфигурационные файлы
└── var/                  # Переменные данные
```

### scripts/

Каталог со скриптами, выполняемыми при установке/удалении.

| Скрипт | Когда выполняется | Описание |
|--------|-------------------|----------|
| `pre-install` | Перед распаковкой файлов | Подготовка к установке |
| `post-install` | После распаковки файлов | Настройка после установки |
| `pre-remove` | Перед удалением файлов | Подготовка к удалению |
| `post-remove` | После удаления файлов | Очистка после удаления |

**Пример pre-install:**
```bash
#!/bin/bash
# Создать пользователя перед установкой
useradd -r -s /bin/false myapp
```

**Пример post-install:**
```bash
#!/bin/bash
# Обновить кэш иконок
gtk-update-icon-cache /usr/share/icons/hicolor

# Обновить базу данных MIME
update-mime-database /usr/share/mime

# Обновить desktop database
update-desktop-database /usr/share/applications
```

**Пример pre-remove:**
```bash
#!/bin/bash
# Остановить сервис перед удалением
systemctl stop myapp.service
```

**Пример post-remove:**
```bash
#!/bin/bash
# Удалить пользователя после удаления
userdel myapp
```

:::warning Права выполнения
Скрипты должны иметь права на выполнение (`chmod +x`).
:::

### home/

Каталог с файлами для домашнего каталога пользователя. Работает аналогично `data/`, но относительно `$HOME`.

**Примеры:**

```
home/.config/myapp/config.ini  → ~/.config/myapp/config.ini
home/.local/share/myapp/       → ~/.local/share/myapp/
```

**Типичная структура:**
```
home/
├── .config/              # Конфигурация приложений
│   └── myapp/
│       └── config.ini
├── .local/
│   └── share/            # Данные приложений
│       └── myapp/
└── .bashrc               # Shell конфигурация (осторожно!)
```

:::tip Совет
Используйте `home/` для конфигурационных файлов пользователя, но будьте осторожны с изменением системных файлов типа `.bashrc`.
:::

## Формат архива

APGv1 использует **tar** с дополнительным сжатием.

**Поддерживаемые форматы:**
- `.tar.xz` (LZMA2) — рекомендуется
- `.tar.gz` (gzip) — поддерживается
- `.tar.zst` (Zstandard) — не поддерживается в v1

**Расширение файла:**
- `.apg` — стандартное расширение для пакетов

**Создание архива:**
```bash
# Создать tar.xz архив
tar -cJf package.apg metadata.json md5sums data/ scripts/ home/

# Или с помощью apgbuild
# apgbuild -o package.apg .
```

## Пример полного пакета

### Структура директории

```
myapp-1.0.0/
├── metadata.json
├── md5sums
├── data/
│   ├── usr/
│   │   ├── bin/
│   │   │   └── myapp
│   │   └── share/
│   │       └── applications/
│   │           └── myapp.desktop
│   └── etc/
│       └── myapp.conf
├── scripts/
│   └── post-install
└── home/
    └── .config/
        └── myapp/
            └── settings.ini
```

### metadata.json

```json
{
    "name": "myapp",
    "version": "1.0.0",
    "architecture": "x86_64",
    "description": "My awesome application",
    "maintainer": "Developer <dev@example.com>",
    "license": "MIT",
    "homepage": "https://example.com",
    "dependencies": ["libc", "gtk3"],
    "conflicts": [],
    "provides": ["myapp-bin"],
    "replaces": ["oldapp"]
}
```

### md5sums

```
a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6  data/usr/bin/myapp
e5f6a7b8c9d0e1f2a3b4c5d6a1b2c3d4  data/etc/myapp.conf
c9d0e1f2a3b4c5d6a1b2c3d4e5f6a7b8  data/usr/share/applications/myapp.desktop
```

### scripts/post-install

```bash
#!/bin/bash
echo "MyApp installed successfully!"
gtk-update-icon-cache /usr/share/icons/hicolor
```

## Отличия от APGv2

| Характеристика | APGv1 | APGv2 |
|----------------|-------|-------|
| **metadata.json** | Плоская структура | Вложенная в объект `package` |
| **Контрольные суммы** | Только MD5 | MD5 или CRC32 |
| **Поле release** | Отсутствует | Обязательное |
| **Поле build_date** | Отсутствует | Автоматическое |
| **Поле install_size** | Отсутствует | Опциональное |
| **Архитектура RISC-V** | `risc_v` | `riscv64` |
| **Операторы версий** | Не работают | Полная поддержка |

## Миграция на APGv2

### Автоматическая миграция

```bash
# Извлечь APGv1 пакет
tar -xJf package-v1.apg

# Обновить metadata.json для APGv2
# (вручную или скриптом)

# Создать crc32sums вместо md5sums
apgbuild sums data crc32sums

# Собрать как APGv2
apgbuild build .
```

### Ручная миграция metadata.json

**Было (v1):**
```json
{
    "name": "myapp",
    "version": "1.0.0",
    "architecture": "risc_v"
}
```

**Стало (v2):**
```json
{
    "package": {
        "name": "myapp",
        "version": "1.0.0",
        "release": 1,
        "architecture": "riscv64",
        "build_date": "2025-01-10T00:00:00Z"
    }
}
```

## Официальный пример

### Скачать пример

```bash
# Клонировать репозиторий с примером APGv1
git clone -b APGv1 https://github.com/NurOS-Linux/APGexample
cd APGexample

# Просмотреть структуру
tree

# Просмотреть metadata.json
cat metadata.json

# Создать пакет (если установлен apgbuild)
# apgbuild -o example.apg .
```

### Ссылки на примеры

- **APGv1 пример**: https://github.com/NurOS-Linux/APGexample/tree/APGv1
- **APGv2 пример**: https://github.com/NurOS-Linux/APGexample

## Создание пакета APGv1

### Вручную

```bash
# 1. Создать структуру
mkdir -p myapp-1.0.0/{data/usr/bin,scripts}

# 2. Скопировать файлы
cp /path/to/myapp myapp-1.0.0/data/usr/bin/

# 3. Создать metadata.json
cat > myapp-1.0.0/metadata.json << 'EOF'
{
    "name": "myapp",
    "version": "1.0.0"
}
EOF

# 4. Генерация MD5 сумм
cd myapp-1.0.0
find data -type f -exec md5sum {} \; > md5sums

# 5. Создать архив
tar -cJf ../myapp-1.0.0.apg .
cd ..
```

### С помощью apgbuild (старая версия)

```bash
# Если доступна старая версия apgbuild для APGv1
apgbuild --metadata myapp-1.0.0/
apgbuild --makesums myapp-1.0.0/
apgbuild -o myapp-1.0.0.apg myapp-1.0.0/
```

## Проверка пакета

### Проверка структуры

```bash
# Просмотр содержимого
tar -tJf package.apg

# Извлечь для проверки
tar -xJf package.apg -C /tmp/check

# Проверить наличие обязательных файлов
ls -la /tmp/check/
```

### Проверка metadata.json

```bash
# Проверка JSON синтаксиса
tar -xJOf package.apg metadata.json | jq .

# Проверка обязательных полей
tar -xJOf package.apg metadata.json | jq '.name, .version'
```

### Проверка контрольных сумм

```bash
# Извлечь пакет
tar -xJf package.apg -C /tmp/verify
cd /tmp/verify

# Проверить MD5 суммы
md5sum -c md5sums
```

## Установка пакета APGv1

:::warning Устаревший формат
Для установки пакетов APGv1 требуется старая версия Tulpar или ручная установка.
:::

### Ручная установка

```bash
# 1. Извлечь пакет
mkdir /tmp/install
tar -xJf package.apg -C /tmp/install
cd /tmp/install

# 2. Проверить MD5 суммы
md5sum -c md5sums || exit 1

# 3. Выполнить pre-install (если есть)
if [ -x scripts/pre-install ]; then
    ./scripts/pre-install
fi

# 4. Копировать файлы
cp -a data/* /

# 5. Копировать файлы home (если есть)
if [ -d home ]; then
    cp -a home/* "$HOME/"
fi

# 6. Выполнить post-install (если есть)
if [ -x scripts/post-install ]; then
    ./scripts/post-install
fi
```

## Дополнительная информация

* [Файл metadata.json APGv1](./fail-metadata.json.md)
* [Обзор APGv1](./placeholder.md)
* [Миграция на APGv2](../apgv2/obzor.md)
* [Официальный пример APGv1](https://github.com/NurOS-Linux/APGexample/tree/APGv1)
* [Официальный пример APGv2](https://github.com/NurOS-Linux/APGexample)
