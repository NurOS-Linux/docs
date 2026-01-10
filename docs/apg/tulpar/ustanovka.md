# Установка Tulpar

## Системные требования

### Минимальные требования

* **Операционная система**: Linux (NurOS или другой дистрибутив)
* **Архитектура**: x86_64, aarch64, riscv64
* **Свободное место**: минимум 50 МБ для программы
* **Оперативная память**: минимум 128 МБ

### Зависимости времени выполнения

* **libc**: glibc >= 2.28 или musl
* **libarchive**: >= 3.4.0 (для работы с архивами)
* **libcurl**: >= 7.60.0 (для загрузки пакетов)
* **libjson-c** или **nlohmann-json**: для парсинга JSON

### Зависимости для сборки

* **Компилятор**: GCC >= 7.0 или Clang >= 8.0 (с поддержкой C11)
* **Система сборки**:
  * meson >= 0.55.0
  * ninja
* **Инструменты**:
  * git (для клонирования репозитория)
  * pkg-config

## Установка из исходников

### Метод 1: Стандартная установка

#### Шаг 1: Клонирование репозитория

```bash
git clone https://github.com/NurOS-Linux/Tulpar.git
cd Tulpar
```

#### Шаг 2: Конфигурация проекта

```bash
meson setup builddir --prefix=/usr
```

**Опции конфигурации:**

| Опция | Значение по умолчанию | Описание |
|-------|----------------------|----------|
| `--prefix` | `/usr/local` | Префикс установки |
| `--bindir` | `{prefix}/bin` | Директория исполняемых файлов |
| `--libdir` | `{prefix}/lib` | Директория библиотек |
| `--sysconfdir` | `/etc` | Директория конфигурации |
| `--buildtype` | `release` | Тип сборки (debug/release) |

#### Шаг 3: Компиляция

```bash
meson compile -C builddir
```

Для параллельной компиляции:
```bash
meson compile -C builddir -j $(nproc)
```

#### Шаг 4: Установка

```bash
sudo meson install -C builddir
```

### Метод 2: Установка в пользовательскую директорию

Если у вас нет прав root, можно установить в домашнюю директорию:

```bash
# Конфигурация с установкой в ~/.local
meson setup builddir --prefix=$HOME/.local

# Компиляция
meson compile -C builddir

# Установка (без sudo)
meson install -C builddir

# Добавить в PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Метод 3: Создание пакета для системы

#### Для NurOS (APG)

```bash
# Сборка
meson setup builddir --prefix=/usr
meson compile -C builddir

# Установка в временную директорию
DESTDIR=$(pwd)/tulpar-pkg meson install -C builddir

# Создание пакета APG
cd tulpar-pkg
apgbuild -m .
# Заполнить metadata.json
apgbuild --makesums .
cd ..
apgbuild -o tulpar-1.0.0-1-x86_64.apg tulpar-pkg
```

#### Для Debian/Ubuntu (DEB)

```bash
# Установка зависимостей для создания пакета
sudo apt install build-essential debhelper

# Сборка DEB пакета
dpkg-buildpackage -b -uc -us
```

#### Для Arch Linux (PKG)

Создайте `PKGBUILD`:

```bash
pkgname=tulpar
pkgver=1.0.0
pkgrel=1
arch=('x86_64' 'aarch64')
depends=('libarchive' 'curl' 'nlohmann-json')
makedepends=('meson' 'ninja')

build() {
  meson setup build --prefix=/usr
  meson compile -C build
}

package() {
  DESTDIR="$pkgdir" meson install -C build
}
```

Затем:
```bash
makepkg -si
```

## Установка из готовых пакетов

### NurOS (Tulpar)

```bash
# Обновить базу данных пакетов
tulpar update

# Установить tulpar (bootstrap версия уже установлена)
tulpar upgrade tulpar
```

### Arch Linux (AUR)

```bash
# Используя yay
yay -S tulpar

# Используя paru
paru -S tulpar
```

### Debian/Ubuntu (PPA)

```bash
# Добавить PPA репозиторий
sudo add-apt-repository ppa:nuros/tulpar
sudo apt update

# Установить
sudo apt install tulpar
```

## Проверка установки

### Проверка версии

```bash
tulpar --version
```

**Ожидаемый вывод:**
```
tulpar 1.0.0
Copyright (C) 2025 NurOS Developers
License GPLv3+: GNU GPL version 3 or later
```

### Проверка работоспособности

```bash
# Показать справку
tulpar --help

# Проверить доступность команд
tulpar list
```

### Проверка зависимостей

```bash
# Проверить наличие необходимых библиотек
ldd $(which tulpar)
```

**Ожидаемый вывод (пример):**
```
linux-vdso.so.1
libarchive.so.13 => /usr/lib/libarchive.so.13
libcurl.so.4 => /usr/lib/libcurl.so.4
libc.so.6 => /usr/lib/libc.so.6
```

## Конфигурация после установки

### Создание директорий

Tulpar автоматически создаст необходимые директории при первом запуске:

```bash
# Директории системы
/var/lib/tulpar/          # База данных пакетов
/var/cache/tulpar/        # Кэш загруженных пакетов
/etc/tulpar/              # Конфигурация

# Пользовательские директории
~/.config/tulpar/         # Пользовательская конфигурация
~/.cache/tulpar/          # Пользовательский кэш
```

### Настройка репозиториев

Конфигурационный файл `/etc/apg/tulpar.conf`:

```ini
# Основные настройки Tulpar

[repositories]
official = https://repo.nuros.org
community = https://community.nuros.org

[options]
cache_dir = /var/cache/apg
db_dir = /var/lib/apg
parallel_downloads = 5
check_space = true
```

### Инициализация базы данных

```bash
# Обновить базу данных репозиториев
sudo tulpar update
```

## Обновление Tulpar

### Обновление через пакетный менеджер

```bash
# NurOS
sudo tulpar upgrade tulpar

# Arch Linux
sudo pacman -Syu tulpar

# Debian/Ubuntu
sudo apt update && sudo apt upgrade tulpar
```

### Обновление из исходников

```bash
cd Tulpar
git pull
meson compile -C builddir
sudo meson install -C builddir
```

## Удаление Tulpar

### Удаление установленного через meson

```bash
cd Tulpar
sudo ninja -C builddir uninstall
```

### Удаление через пакетный менеджер

```bash
# NurOS (осторожно!)
sudo tulpar remove tulpar

# Arch Linux
sudo pacman -R tulpar

# Debian/Ubuntu
sudo apt remove tulpar
```

### Очистка данных

```bash
# Удалить базу данных пакетов
sudo rm -rf /var/lib/apg

# Удалить кэш
sudo rm -rf /var/cache/apg

# Удалить конфигурацию
sudo rm -rf /etc/apg
```

## Устранение неполадок

### Проблема: отсутствуют зависимости при компиляции

**Решение для Debian/Ubuntu:**
```bash
sudo apt install build-essential meson ninja-build \
  libarchive-dev libcurl4-openssl-dev nlohmann-json3-dev
```

**Решение для Arch Linux:**
```bash
sudo pacman -S base-devel meson ninja libarchive curl nlohmann-json
```

**Решение для Fedora:**
```bash
sudo dnf install gcc-c++ meson ninja-build \
  libarchive-devel libcurl-devel json-devel
```

### Проблема: ошибки компиляции C11

```bash
# Проверить версию компилятора
gcc --version

# Обновить GCC (если нужно)
# Debian/Ubuntu
sudo apt install gcc

# Arch Linux
sudo pacman -S gcc
```

### Проблема: конфликт версий библиотек

```bash
# Проверить установленные библиотеки
pkg-config --modversion libarchive
pkg-config --modversion libcurl

# Указать конкретные пути при конфигурации
PKG_CONFIG_PATH=/usr/local/lib/pkgconfig meson setup builddir
```

### Проблема: недостаточно прав

```bash
# Использовать sudo для установки
sudo meson install -C builddir

# Или установить в пользовательскую директорию
meson setup builddir --prefix=$HOME/.local
```

## Дополнительная информация

* [Обзор Tulpar](./obzor.md)
* [FAQ](./faily-tulpar.md)
* [libapg API](./libapg-api.md)
