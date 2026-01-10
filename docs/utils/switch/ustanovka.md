# Установка Switch

## Системные требования

### Минимальные требования

* **Операционная система**: Linux (NurOS или любой современный дистрибутив)
* **Архитектура**: x86_64, aarch64, riscv64
* **Библиотеки**: libc (glibc или musl)
* **Оболочка**: bash >= 4.0 (для модулей)

### Требования для сборки

* **Компилятор**: GCC >= 7.0 или Clang >= 8.0
* **Система сборки**:
  * meson >= 0.60.0
  * ninja
* **Дополнительно**:
  * pkg-config
  * git (для клонирования репозитория)

## Установка из исходников

### Получение исходного кода

#### Клонирование репозитория

```bash
git clone https://github.com/NurOS-Linux/switch
cd switch
```

#### Загрузка релиза

```bash
wget https://github.com/NurOS-Linux/switch/archive/refs/tags/v1.0.0.tar.gz
tar -xzf v1.0.0.tar.gz
cd switch-1.0.0
```

### Конфигурация

#### Стандартная конфигурация

```bash
meson setup build --prefix=/usr
```

#### Опции конфигурации

| Опция | Значение по умолчанию | Описание |
|-------|----------------------|----------|
| `--prefix` | `/usr/local` | Префикс установки |
| `--bindir` | `{prefix}/bin` | Директория для исполняемых файлов |
| `--datadir` | `{prefix}/share` | Директория для данных |
| `--buildtype` | `release` | Тип сборки (debug/release) |

#### Пример пользовательской конфигурации

```bash
# Установка в /usr/local с отладочными символами
meson setup build \
  --prefix=/usr/local \
  --buildtype=debugoptimized
```

### Компиляция

```bash
meson compile -C build
```

#### Параллельная компиляция

```bash
# Использовать все доступные процессоры
meson compile -C build -j $(nproc)

# Использовать конкретное количество процессов
meson compile -C build -j 4
```

### Установка

#### Установка в систему (требует root)

```bash
sudo meson install -C build
```

#### Установка в пользовательскую директорию

```bash
# Изменить DESTDIR для установки в другую директорию
DESTDIR=/tmp/switch-install meson install -C build
```

### Проверка установки

```bash
# Проверить версию
switch --version

# Проверить доступность модулей
switch --list-modules

# Показать справку
switch --help
```

## Установка через пакетный менеджер

### Установка через Tulpar (NurOS)

```bash
# Установка из официального репозитория
tulpar install switch

# Обновление до последней версии
tulpar update switch
```

### Создание пакета APG

```bash
# Подготовка структуры пакета
mkdir -p switch-pkg/data
DESTDIR=$(pwd)/switch-pkg/data meson install -C build

# Создание метаданных
cd switch-pkg
apgbuild -m .

# Генерация контрольных сумм
apgbuild --makesums .

# Создание пакета
cd ..
apgbuild -o switch-1.0.0-1-x86_64.apg switch-pkg
```

## Деинсталляция

### Удаление через meson

```bash
# Из директории сборки
sudo ninja -C build uninstall
```

### Удаление через Tulpar

```bash
tulpar remove switch
```

### Ручное удаление

```bash
# Удалить исполняемый файл
sudo rm /usr/bin/switch

# Удалить модули
sudo rm -rf /usr/share/switch

# Удалить пользовательские модули (опционально)
rm -rf ~/.local/share/switch
```

## Обновление

### Обновление из исходников

```bash
cd switch
git pull
meson compile -C build
sudo meson install -C build
```

### Обновление через Tulpar

```bash
tulpar update switch
```

## Устранение неполадок

### Проблема: meson не найден

```bash
# Ubuntu/Debian
sudo apt install meson ninja-build

# Arch Linux
sudo pacman -S meson ninja

# Fedora
sudo dnf install meson ninja-build
```

### Проблема: ошибки компиляции

```bash
# Очистить директорию сборки
rm -rf build

# Пересоздать конфигурацию
meson setup build --wipe
meson compile -C build
```

### Проблема: отсутствуют права доступа

```bash
# Убедитесь, что используете sudo для установки
sudo meson install -C build

# Или установите в пользовательскую директорию
meson setup build --prefix=$HOME/.local
meson compile -C build
meson install -C build
```