title: پشتیبان گیری سریع دیتابیس mariadb
briefing: یکی از سریع ترین روش های پشتیبان گیری از دیتابیس mariadb استفاده از mariadb-backup است.
date_time: 2024-09-03 10:59
slug: backup-mriadb-with-mariadb-backup
tags: database, mariadb, backup
type: post

یکی از سریع ترین روش های پشتیبان گیری از دیتابیس `mariadb` استفاده از `mariadb-backup` است. در حقیقت این
 این برنامه از `xtrabackup` که از دیتابیس های `mysql` و `xtradb` پشتیبان گیری می کند، گرفته شده است.

قبلا درباره دیگر روش های پشتیبان گیری از دیتابیس `mysql/mariadb` صحبت کرده ایم، از جمله 
[آشنایی با mydumper/myloader](https://shgn.ir/2023-12-16/mydumper-myloader.html)
 و یک اشاره اولیه به `mysqldump` در مقاله
 (راه اندازی Mysql/Mariadb Slave Replication)[https://shgn.ir/2024-04-14/mysql-master-slave-replication.html]
 کرده ایم. در این دو حالت مطمئن ترین روش `mysqldump/mariadb-dump` می باشد اما سرعت در
 `mydumper/myloader` خیلی بیشتر است.

در روش `mariadb-backup` ما در پشتیبان گیری به ویژه به صورت افزایشی - incremantal - نیز سرعت بسیار قابل
 قبولی را داریم.
