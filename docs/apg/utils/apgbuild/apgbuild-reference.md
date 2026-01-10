# apgbuild - Полное руководство

## Обзор

**apgbuild** — инструмент командной строки для создания и управления пакетами формата APGv2. Написан на языке Go для обеспечения высокой производительности и кроссплатформенности.

## Технические характеристики

* **Язык**: Go 1.21+
* **Лицензия**: GNU GPL 3.0
* **Автор**: AnmiTaliDev
* **Email**: anmitali198@gmail.com
* **Репозиторий**: https://github.com/NurOS-Linux/apgbuild

### Ключевые особенности

1. **Создание пакетов APGv2**
   * Автоматическая упаковка в tar.xz
   * Генерация CRC32 контрольных сумм
   * Валидация структуры пакета

2. **Извлечение пакетов**
   * Безопасная распаковка с защитой от path traversal
   * Проверка контрольных сумм
   * Сохранение прав доступа к файлам

3. **Интерактивный мастер**
   * Создание metadata.json через диалог
   * Подсказки и валидация полей
   * Поддержка всех полей APGv2

4. **Работа с контрольными суммами**
   * Генерация crc32sums
   * Проверка существующих контрольных сумм
   * Поддержка обратной совместимости с md5sums

## Установка

### Метод 1: Сборка через Meson (рекомендуется)

```bash
# Клонировать репозиторий
git clone https://github.com/NurOS-Linux/apgbuild
cd apgbuild

# Обновить подмодули (включая libapg)
git submodule update --init --recursive

# Конфигурация и сборка
meson setup build
meson compile -C build

# Установка (требует root)
sudo meson install -C build
```

**Установится:**
* Бинарный файл: `/usr/bin/apgbuild`
* Man-страница: `/usr/share/man/man1/apgbuild.1`

### Метод 2: Сборка через Go

```bash
# Клонировать репозиторий
git clone https://github.com/NurOS-Linux/apgbuild
cd apgbuild

# Скачать зависимости
go mod download

# Собрать бинарник
go build -o apgbuild ./cmd/apgbuild

# Установить вручную
sudo cp apgbuild /usr/local/bin/
```

### Метод 3: Из готового пакета

#### NurOS

```bash
tulpar install apgbuild
```

#### Arch Linux (AUR)

```bash
yay -S apgbuild
# или
paru -S apgbuild
```

## Синтаксис команд

### Общий формат

```
apgbuild <command> [options] [arguments]
```

### Глобальные опции

| Опция | Описание |
|-------|----------|
| `-h, --help` | Показать справку |
| `-v, --version` | Показать версию |

## Команды

### build / -b

Создание пакета APG из директории.

**Синтаксис:**
```bash
apgbuild build <directory> [-o <output>]
apgbuild -b <directory> [-o <output>]
```

**Параметры:**
* `<directory>` — директория с содержимым пакета
* `-o <output>` — имя выходного файла (по умолчанию: `<name>-<version>-<release>-<arch>.apg`)

**Структура входной директории:**
```
mypackage/
├── metadata.json     # Обязательно
├── crc32sums         # Обязательно (или md5sums)
├── data/             # Обязательно
│   └── usr/bin/myapp
├── scripts/          # Опционально
│   ├── pre-install
│   └── post-install
└── home/             # Опционально
    └── .config/myapp/
```

**Примеры:**
```bash
# Создать пакет с автоматическим именем
apgbuild build ./mypackage

# Создать пакет с заданным именем
apgbuild build ./mypackage -o custom-name.apg

# Короткая форма
apgbuild -b ./mypackage
```

**Процесс сборки:**
1. Проверка наличия metadata.json
2. Валидация metadata.json
3. Проверка наличия data/
4. Проверка контрольных сумм (crc32sums или md5sums)
5. Создание tar.xz архива
6. Сохранение как .apg файл

**Коды выхода:**
* `0` — успех
* `1` — отсутствует metadata.json
* `2` — некорректный metadata.json
* `3` — отсутствует data/
* `4` — ошибка при создании архива
* `5` — ошибка контрольных сумм

### extract / -x

Извлечение пакета APG.

**Синтаксис:**
```bash
apgbuild extract <package.apg> [destination]
apgbuild -x <package.apg> [destination]
```

**Параметры:**
* `<package.apg>` — файл пакета для извлечения
* `[destination]` — директория назначения (по умолчанию: `./<package-name>`)

**Примеры:**
```bash
# Извлечь в текущую директорию
apgbuild extract firefox-120.0-1-x86_64.apg

# Извлечь в заданную директорию
apgbuild extract firefox-120.0-1-x86_64.apg ./output

# Короткая форма
apgbuild -x package.apg
```

**Защита от path traversal:**
```
# Эти пути будут отклонены:
../etc/passwd
/../../root/.ssh/
data/../../../tmp/evil
```

**Проверки при извлечении:**
1. Валидность tar.xz архива
2. Наличие metadata.json
3. Проверка контрольных сумм
4. Проверка на path traversal
5. Проверка прав доступа

### list / -l

Показать содержимое пакета без извлечения.

**Синтаксис:**
```bash
apgbuild list <package.apg>
apgbuild -l <package.apg>
```

**Параметры:**
* `<package.apg>` — файл пакета

**Примеры:**
```bash
apgbuild list firefox-120.0-1-x86_64.apg
```

**Вывод:**
```
Package: firefox
Version: 120.0-1
Architecture: x86_64

Files:
  metadata.json
  crc32sums
  data/usr/bin/firefox
  data/usr/lib/firefox/
  data/usr/share/applications/firefox.desktop
  scripts/post-install
```

**Формат вывода:**
* Имя, версия, архитектура из metadata.json
* Список всех файлов в архиве
* Размеры файлов (опционально с `-s`)

### meta / -m

Интерактивное создание metadata.json.

**Синтаксис:**
```bash
apgbuild meta [output]
apgbuild -m [output]
```

**Параметры:**
* `[output]` — имя выходного файла (по умолчанию: `metadata.json`)

**Примеры:**
```bash
# Создать metadata.json в текущей директории
apgbuild meta

# Создать с другим именем
apgbuild meta my-metadata.json
```

**Интерактивный процесс:**

```
APGv2 Metadata Generator
========================

Required Fields:
--------------
Package name: myapp
Version: 1.0.0
Release: 1
Architecture [x86_64]:
Description: My awesome application

Optional Fields:
---------------
Maintainer []: John Doe <john@example.com>
License []: GPL-3.0
Homepage []: https://example.com
Build date [auto]:

Dependencies (comma-separated, empty to skip):
> libc,libarchive

Conflicts (comma-separated, empty to skip):
>

Provides (comma-separated, empty to skip):
> myapp-bin

Replaces (comma-separated, empty to skip):
> oldapp

Tags (comma-separated, empty to skip):
> utility,cli

Install size (bytes, empty for auto):
>

Created: metadata.json
```

**Валидация:**
* Имя пакета: `[a-z0-9][a-z0-9-]*`
* Версия: следует semver или `X.Y.Z-R`
* Архитектура: `x86_64`, `aarch64`, `riscv64`, `all`
* Release: положительное целое число

**Результат (metadata.json):**
```json
{
  "package": {
    "name": "myapp",
    "version": "1.0.0",
    "release": 1,
    "architecture": "x86_64",
    "description": "My awesome application",
    "maintainer": "John Doe <john@example.com>",
    "license": "GPL-3.0",
    "homepage": "https://example.com",
    "build_date": "2025-01-10T22:15:00Z",
    "dependencies": ["libc", "libarchive"],
    "conflicts": [],
    "provides": ["myapp-bin"],
    "replaces": ["oldapp"],
    "tags": ["utility", "cli"]
  }
}
```

### sums

Генерация файла контрольных сумм CRC32.

**Синтаксис:**
```bash
apgbuild sums <directory> [output]
```

**Параметры:**
* `<directory>` — директория для сканирования (обычно `data/`)
* `[output]` — имя выходного файла (по умолчанию: `crc32sums`)

**Примеры:**
```bash
# Создать crc32sums для data/
apgbuild sums ./data

# Создать с другим именем
apgbuild sums ./data my-checksums.txt

# Только для определенной поддиректории
apgbuild sums ./data/usr/bin checksums-bin.txt
```

**Вывод (crc32sums):**
```
a1b2c3d4  data/usr/bin/myapp
e5f6a7b8  data/usr/lib/libmyapp.so.1.0.0
c9d0e1f2  data/etc/myapp.conf
```

**Формат:**
```
<crc32>  <relative-path>
```

**Поддерживаемые алгоритмы:**
* CRC32 (по умолчанию, рекомендуется)
* MD5 (legacy, через флаг `--md5`)

**Опции:**
* `--md5` — использовать MD5 вместо CRC32
* `--recursive` — рекурсивное сканирование (по умолчанию)
* `--verbose` — показывать прогресс

### verify

Проверка контрольных сумм.

**Синтаксис:**
```bash
apgbuild verify <checksums-file> [basedir]
```

**Параметры:**
* `<checksums-file>` — файл с контрольными суммами
* `[basedir]` — базовая директория (по умолчанию: `.`)

**Примеры:**
```bash
# Проверить crc32sums в текущей директории
apgbuild verify crc32sums

# Проверить с другой базовой директорией
apgbuild verify crc32sums /tmp/package-build
```

**Вывод при успехе:**
```
Verifying checksums...
✓ data/usr/bin/myapp: OK
✓ data/usr/lib/libmyapp.so.1.0.0: OK
✓ data/etc/myapp.conf: OK

All files verified successfully (3/3)
```

**Вывод при ошибке:**
```
Verifying checksums...
✓ data/usr/bin/myapp: OK
✗ data/usr/lib/libmyapp.so.1.0.0: FAILED
  Expected: e5f6a7b8
  Got:      12345678
✓ data/etc/myapp.conf: OK

Verification failed: 1 of 3 files corrupted
```

**Коды выхода:**
* `0` — все файлы прошли проверку
* `1` — один или более файлов не прошли проверку
* `2` — файл контрольных сумм не найден
* `3` — один или более файлов отсутствует

## Полный workflow создания пакета

### Шаг 1: Подготовка структуры

```bash
# Создать директорию пакета
mkdir -p myapp-1.0.0/{data/usr/{bin,lib},scripts}

# Скопировать файлы программы
cp /path/to/myapp myapp-1.0.0/data/usr/bin/
cp /path/to/libmyapp.so myapp-1.0.0/data/usr/lib/
```

### Шаг 2: Создание metadata.json

```bash
cd myapp-1.0.0
apgbuild meta
# ... заполнить поля в интерактивном режиме
```

### Шаг 3: Создание скриптов (опционально)

```bash
cat > scripts/post-install << 'EOF'
#!/bin/bash
echo "Thank you for installing myapp!"
ldconfig
EOF

chmod +x scripts/post-install
```

### Шаг 4: Генерация контрольных сумм

```bash
apgbuild sums data
```

### Шаг 5: Сборка пакета

```bash
cd ..
apgbuild build myapp-1.0.0
```

**Результат:**
```
Building package from myapp-1.0.0...
✓ Validated metadata.json
✓ Found 2 files in data/
✓ Verified checksums (2/2)
✓ Created archive
✓ Package saved: myapp-1.0.0-1-x86_64.apg

Package information:
  Name: myapp
  Version: 1.0.0-1
  Architecture: x86_64
  Size: 1.2 MB
```

## Продвинутые возможности

### Пакетирование скомпилированного проекта

```bash
#!/bin/bash
# build-package.sh - автоматизированная сборка пакета

set -e

PROJECT="myapp"
VERSION="1.0.0"
RELEASE="1"
ARCH="x86_64"

PKGDIR="${PROJECT}-${VERSION}"

# Сборка проекта
make clean
make -j$(nproc)
make DESTDIR="${PKGDIR}/data" install

# Создание metadata.json программно
cat > "${PKGDIR}/metadata.json" << EOF
{
  "package": {
    "name": "${PROJECT}",
    "version": "${VERSION}",
    "release": ${RELEASE},
    "architecture": "${ARCH}",
    "description": "My application",
    "dependencies": ["libc", "libarchive"]
  }
}
EOF

# Генерация контрольных сумм
apgbuild sums "${PKGDIR}/data" "${PKGDIR}/crc32sums"

# Сборка пакета
apgbuild build "${PKGDIR}"

echo "Package created: ${PROJECT}-${VERSION}-${RELEASE}-${ARCH}.apg"
```

### Разделение debug-символов

```bash
# Создать отдельный пакет с debug-символами
mkdir -p myapp-debug-1.0.0/data/usr/lib/debug

# Извлечь debug-символы
objcopy --only-keep-debug myapp-1.0.0/data/usr/bin/myapp \
        myapp-debug-1.0.0/data/usr/lib/debug/myapp.debug

# Удалить debug-символы из основного пакета
objcopy --strip-debug myapp-1.0.0/data/usr/bin/myapp

# Создать два пакета
apgbuild build myapp-1.0.0
apgbuild build myapp-debug-1.0.0
```

### Поддержка множественных архитектур

```bash
# Сборка для разных архитектур
for arch in x86_64 aarch64 riscv64; do
    # Кросс-компиляция
    make ARCH=${arch} clean all

    # Подготовка пакета
    PKGDIR="myapp-1.0.0-${arch}"
    mkdir -p "${PKGDIR}/data/usr/bin"
    cp build/${arch}/myapp "${PKGDIR}/data/usr/bin/"

    # Обновить архитектуру в metadata.json
    sed "s/\"architecture\": \".*\"/\"architecture\": \"${arch}\"/" \
        metadata.json > "${PKGDIR}/metadata.json"

    # Создать пакет
    apgbuild sums "${PKGDIR}/data" "${PKGDIR}/crc32sums"
    apgbuild build "${PKGDIR}"
done
```

## Интеграция с CI/CD

### GitHub Actions

```yaml
name: Build APG Package

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install apgbuild
        run: |
          wget https://github.com/NurOS-Linux/apgbuild/releases/latest/download/apgbuild
          chmod +x apgbuild
          sudo mv apgbuild /usr/local/bin/

      - name: Build project
        run: make

      - name: Create package
        run: |
          ./scripts/create-package.sh

      - name: Upload package
        uses: actions/upload-artifact@v3
        with:
          name: apg-package
          path: '*.apg'
```

## Устранение неполадок

### Проблема: "metadata.json not found"

**Решение:**
```bash
# Убедитесь что metadata.json существует
ls -la mypackage/metadata.json

# Если нет, создайте его
cd mypackage
apgbuild meta
```

### Проблема: "checksum verification failed"

**Решение:**
```bash
# Пересоздайте контрольные суммы
apgbuild sums data crc32sums

# Или проверьте что файлы не изменились
apgbuild verify crc32sums
```

### Проблема: "invalid metadata.json"

**Решение:**
```bash
# Проверьте синтаксис JSON
jq . metadata.json

# Или пересоздайте через мастер
apgbuild meta
```

### Проблема: "permission denied при установке"

**Решение:**
```bash
# Используйте sudo для установки
sudo meson install -C build

# Или установите в пользовательскую директорию
go build -o ~/bin/apgbuild ./cmd/apgbuild
```

## Часто задаваемые вопросы

**В: CRC32 или MD5?**

О: Используйте CRC32 (по умолчанию). MD5 поддерживается только для обратной совместимости.

**В: Можно ли создавать пакеты на Windows?**

О: Да, apgbuild написан на Go и работает кроссплатформенно. Однако пути к файлам должны использовать `/` а не `\`.

**В: Как создать пакет "all" архитектуры?**

О: Укажите `"architecture": "all"` в metadata.json для архитектурно-независимых пакетов (скрипты, данные, документация).

**В: Максимальный размер пакета?**

О: Технических ограничений нет, но рекомендуется разбивать большие пакеты (>500 МБ) на несколько частей.

## Дополнительная информация

* **Репозиторий**: https://github.com/NurOS-Linux/apgbuild
* **Баг-трекер**: https://github.com/NurOS-Linux/apgbuild/issues
* **Спецификация APGv2**: [Стандарт APG](obzor.md)
