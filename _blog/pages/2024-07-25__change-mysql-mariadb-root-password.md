title: تغییر کلمه عبور کاربر root در mysql/mariadb
briefing: گاهی ممکن لازم باشه تا کلمه عبور کاربر root دیتابیس را بخواهیم تغییر بدیم.
date_time: 2024-07-25 11:03
slug: change-mysql-mariadb-root-password
tags: database, mariadb, mysql, tips
type: post

#مقدمه
هر دیتابیس `mysql/mariadb` یک حساب کاربری پیش فرض با دسترسی کامل و بیشترین توانایی به نام 'root' دارد.  گاهی
 ممکن این کلمه عبور را بخواهیم تغییر بدیم، برای این کار می توان به صورت زیر عمل نمود

#تغییر کلمه عبور
برای تغییر کلمه عبور طرق مختلفی هستند، موارد زیر از این دست هستند. در تمامی این حالات زیر لازم است تا به
 'mysql' لاگین شد.

## mysql 5.7.5 به قبل
جهت تغییر کلمه عبور ستور زیر در `mysql` اجرا می شود:

    SET PASSWORD FOR 'user-name-here'@'hostname' = PASSWORD('new-password');

## mysql 5.7.6 به بعد و mariadb
جهت تغییر کلمه عبور دستور زیر در 'mysql 5.7.6' و `mariadb` به بعد اجرا می شود:

    ALTER USER 'user'@'hostname' IDENTIFIED BY 'newPass';

همچنین می توان به صورت زیر عمل نمود:

    UPDATE mysql.user SET Password=PASSWORD('new-password-here') WHERE USER='user-name-here' AND Host='host-name-here';

با اجرای دستورت فوق اگر خروجی زیر نمایش داده شود، یعنی بدون مشکل تغییر کلمه انجام شده است:

    Query OK, 1 row affected (0.00 sec)
    Rows matched: 1  Changed: 1  Warnings: 0

سپس برای اعمال نهایی دستور زیر اجرا می شود:

    FLUSH PRIVILEGES;

#تغییر کلمه عبور با mysqladmin
یکی دیگر از راههایی که می توان کلمه عبور کاربر `root` را تغییر داد، دستور `mysqladmin` در خط فرمان می باشد.
 برای این کار کافی است تا دستور زیر را با کابر `root‍‍‍` سیستم عامل اجرا کرد:

    mysqladmin --user={USER_NAME} password "{NEW_PASSWORD_HERE}"
    # example
    mysqladmin --user=root password "5b350f65542fdb74e74ef7b815f86ad5"
    mysqladmin --user=root --host=192.168.2.200 --password password "5b350f65542fdb74e74ef7b815f86ad5"

#منابع
 - [MySQL Change a User Password Command Tutorial](https://www.cyberciti.biz/faq/mysql-change-user-password/)
 - [MySQL root password change](https://stackoverflow.com/q/7534056)