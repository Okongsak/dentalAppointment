FROM php:8.3-fpm

# ติดตั้ง dependency
RUN apt-get update && apt-get install -y \
    curl git unzip libpq-dev libzip-dev zip \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip

# ติดตั้ง Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# กำหนด working directory
WORKDIR /var/www/html

# คัดลอกไฟล์ทั้งหมด
COPY . .

# ใช้ entrypoint/command ให้รัน composer install ทุกครั้งที่ container start
CMD composer install --no-interaction --prefer-dist --optimize-autoloader \
    && php artisan migrate --force \
    && php artisan serve --host=0.0.0.0 --port=8000

