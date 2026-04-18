# Криптография

libapg содержит собственные реализации SHA-256, MD5 и CRC32, а также обёртки для удобного хеширования файлов.

## SHA-256

Заголовок: `apg/sha256.h`. Реализация соответствует FIPS 180-4. Выходной дайджест — 32 байта (256 бит).

### Потоковый API

```c
void sha256_init(sha256_ctx *ctx);
void sha256_update(sha256_ctx *ctx, const uint8_t *data, size_t len);
void sha256_final(sha256_ctx *ctx, uint8_t digest[32]);
```

Используется когда данные поступают частями:

```c
sha256_ctx ctx;
sha256_init(&ctx);

uint8_t buf[4096];
size_t n;
while ((n = fread(buf, 1, sizeof(buf), f)) > 0)
    sha256_update(&ctx, buf, n);

uint8_t digest[32];
sha256_final(&ctx, digest);
```

### Хеширование файла

```c
bool compute_sha256(const char *path, uint8_t digest[32]);
```

Удобная обёртка — открывает файл, читает целиком, закрывает. Возвращает `false` при ошибке чтения.

```c
uint8_t digest[32];
if (!compute_sha256("/var/cache/apg/curl.apg", digest)) return false;
```

### Перевод в hex

```c
void sha256_hex(const uint8_t digest[32], char *hex);
```

Записывает hex-представление дайджеста в буфер `hex`. Буфер должен быть не менее 65 байт (64 символа + `\0`).

```c
uint8_t digest[32];
char hex[65];

compute_sha256("curl.apg", digest);
sha256_hex(digest, hex);
printf("SHA256: %s\n", hex);
```

## MD5

Заголовок: `apg/md5.h`. Поддерживается для обратной совместимости с пакетами APGv1. Выходной дайджест — 16 байт (128 бит).

```c
void md5_init(md5_ctx *ctx);
void md5_update(md5_ctx *ctx, const uint8_t *data, size_t len);
void md5_final(uint8_t digest[16], md5_ctx *ctx);
bool compute_md5(const char *path, uint8_t digest[16]);
```

Порядок аргументов `md5_final` отличается от SHA-256: первый — `digest`, второй — `ctx`.

```c
uint8_t digest[16];
compute_md5("package.apg", digest);

for (int i = 0; i < 16; i++)
    printf("%02x", digest[i]);
printf("\n");
```

## CRC32

Заголовок: `apg/crc32.h`. Быстрый 32-битный алгоритм с предвычисленной таблицей.

```c
unsigned int crc32(const unsigned char *buffer, unsigned int len);
unsigned int crc32_simple(const unsigned char *message, unsigned int len);
```

- `crc32` — оптимизированная версия с развёрткой цикла (`DO8`)
- `crc32_simple` — простая реализация без оптимизаций

```c
#include <apg/crc32.h>

uint8_t data[] = {0x01, 0x02, 0x03};
unsigned int crc = crc32(data, sizeof(data));
printf("CRC32: %08x\n", crc);
```

## Сравнение алгоритмов

| Алгоритм | Размер | Скорость | Применение |
|----------|--------|----------|-----------|
| SHA-256 | 256 бит | средняя | основной (APGv2) |
| CRC32 | 32 бита | быстрая | альтернативный |
| MD5 | 128 бит | средняя | legacy (APGv1) |
