title: راه اندازی Mysql/Mariadb Slave Replication بدون توقف
briefing: یکی از راه های افزایش پایداری دیتابیس ها، و به طور نانوشته ایجاد یک بکاپ از دیتابیس اصلی، ایجاد رپلیکیشن اسلیو است.
date_time: 2022-07-02 09:57
slug: mysql-slave-replicaion
tags: mysql, mariadb, linux, database, replication 
type: post

در این نوشته سعی می کنیم تا نحوه راه اندزی `Mysql/Mariadb Slave Replication` را بدون متوقف کردن دیتابیس بیان کنیم.
در اکثر آموزش های راه اندازی رپلیکیشن `master-slave` دیتابیس باید جداول قفل شوند تا بتوان رپلیکیشن را منتقل و راه اندزای نمود، که در دیتابیس های حجیم یا پر تراکنش این امر می تواند موجب قطعی توقف برنامه شود. 

## مراحل راه اندزی رپلیکیشن

 ۱- از فعال بودن `bin-logging` مطمئن باشید. این مرحله به علت این که دیتابیس `slave` براساس آن ایجاد و جلو می رود، خیلی مهم هست.

 ۲- ایجاد فایل بکاپ از دیتابیس مد نظر با `mysqldump` به همراه موقعیت مکانی `binlog`، که در آینده برای ایجاد رپلیکیشن به آن نیاز است.

 ۳- انتقال فایل بکاپ به سرور مقصد برای راه اندزای رپلیکیشن، و برگرداند دیتابیس بکاپ. اکنون یک دیتابیس `slave` تا نقطه ای که بکاپ گرفته شده، داریم.

 ۴- تنظیم دیتابیس `slave` برای آگاهی از دیتبایس `master` و شروع به کار رپلیکیشن برای همسان سازی داده ها.


### گام۱: فعال سازی binlog در سرور مستر

برای فعال سازی `binlog` ها باید تنظیمات زیر را در فایل `/etc/mysql/my.cnf` قرار دهید:

    server-id=1
    binlog-format=mixed
    log-bin=mysql-bin
    innodb_flush_log_at_trx_commit=1
    sync_binlog=1
    binlog_do_db = dbname

سپس برای اعمال تنظیمات باید سرویس دیتابیس ریست شود:

    systemctl restart mysqld


### گام۲: ایجاد کاربری با دسترسی رپلیکیشن
برای برقراری ارتباط رپلیکیشن لازم است تا دیتابیس `slave` از طریق این کابر به دیتابیس `master` متصل بشه:

    CREATE USER 'replicant'@'%';
    GRANT REPLICATION SLAVE ON *.* TO 'replicant'@'%' IDENTIFIED BY 'password';
    FLUSH PRIVILEGES;


###گام۳: ایجاد بکاپ از دیتابیس
در این مرحله لازم اس تا بک بکاپ با `mysqldump` برای ایجاد دیتابیس `slave` ایجاد شود.

    mysqldump --skip-lock-tables --single-transaction --flush-logs --master-data=2 dbname > ~/mysqldump.sql
    gzip -9 ~/mysqldump.sql
    scp ~/mysqldump.sql.gz root@salveServer:~/


###گام۴: بازگرداندن بکاپ
مراحل برگرداندن فایل بکاپ دیتابیس روی سرور `slave` به این صورت می باشد:

    gunzip ~/mysqldump.sql.gz
    mysql -u root -p -e 'create database dbname;'
    mysql -uroot -p dbname < ~/mysqldump.sql


###گام۵:  تنظیمات سرور slave
لازم است تا روی سرور مقصد تنظیمات زیر نیز اعمال شوند:

    server-id = 2
    binlog-format = mixed
    log_bin = mysql-bin
    relay-log = mysql-relay-bin
    log-slave-updates = 1
    read-only = 1
    binlog_do_db = dbname

برای اعمال تنظیمات لازم است تا سرویس دیتابیس ریست شود:

    systemctl restart mysqld


###گام۶:  راه اندزای slave replication
ابتدا لازم است تا مقادیر `MASTER_LOG_FILE` و `MATER_LOG_POS`  را بدست بیاریم:

    head dump.sql -n80 | grep "MASTER_LOG_POS"

سپس به کنسول `mysql` لاگین کرده و تنظیمات و دستورات زیر را اجرا می کنیم:

    CHANGE MASTER TO MASTER_HOST='<>',MASTER_USER='replicant',MASTER_PASSWORD='<>', MASTER_LOG_FILE='<>', MASTER_LOG_POS=<>;
    START SLAVE;

اگر اطلاعات بالا درست تنظیم شوند و مشکلی بین سرور `master` و `slave` وجود نداشته باشد، رپلیکیشن باید برقرار شده باشد.

در نهایت برای بررسی برقراری ارتباط پلیکیشن می توان دستور زیر را اجرا نمود:

    SHOW SLAVE STATUS G

##منابع
[MySQL Replication Setup without Downtime](https://linuxscriptshub.com/mysql-replication-setup-without-downtime/)
[MariaDB Replication - Replicate only specific tables and views](https://dba.stackexchange.com/questions/268192/mariadb-replication-replicate-only-specific-tables-and-views)