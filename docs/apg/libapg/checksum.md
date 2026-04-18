# Контрольные суммы

Модуль `apg/checksum.h` проверяет целостность файлов в распакованном пакете перед установкой.

## Функции

### verify_checksums

```c
bool verify_checksums(const char *pkg_dir);
```

Проверяет контрольные суммы всех файлов в директории распакованного пакета.

| Параметр | Описание |
|----------|----------|
| `pkg_dir` | путь к директории распакованного пакета |

Алгоритм выбирается автоматически в порядке приоритета:

1. `sha256sums` — предпочтительно
2. `crc32sums`
3. `md5sums`

Если ни один файл сумм не найден — возвращает `false`. Если хотя бы одна сумма не совпадает — возвращает `false`.

```c
if (!verify_checksums("/tmp/apg/extracted")) {
    fprintf(stderr, "integrity check failed\n");
    return false;
}
```

## Формат файлов сумм

Все файлы (`sha256sums`, `crc32sums`, `md5sums`) используют единый формат — по одной записи на строку:

```
<хеш>  <путь_к_файлу>
```

Между хешем и путём — два пробела (стандарт GNU coreutils).

### Пример sha256sums

```
a3f1c2e8...64  data/usr/bin/curl
9b2d4f7a...12  data/usr/lib/libcurl.so.4
```

### Пример crc32sums

```
1a2b3c4d  data/usr/bin/curl
5e6f7a8b  data/usr/lib/libcurl.so.4
```
