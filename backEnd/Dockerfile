FROM php:8.3-fpm

# ติดตั้ง dependency
RUN apt-get update && apt-get install -y \
    curl git unzip libpq-dev libzip-dev zip \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip

# ติดตั้ง Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# กำหนด working directory
WORKDIR /var/www/html

# ติดตั้ง Laravel dependency
COPY . .
RUN composer install --no-scripts --no-autoloader \
    && composer dump-autoload --optimize

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
