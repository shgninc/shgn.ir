title: سریعترین راه mariadb master/slave replication
briefing: راه اندازی رپلیکیشن master/slave در mariadb در سریعترین حالت ممکن.
date_time: 2024-10-05 08:16
slug: mariadb-master-salve-replication-fastest
tags: database, mariadb, replication
type: post

دیتابیس mariadb توپولوژی های رپلیکیشن مختلفی را معرفی کرده، معروف ترین آنها توپولوژی Master/Slave می باشد. به طور 
پیش فرض، رپلیکیشن به صورت نامتقارن بوده که با ارسال وقایع مستر به باینری لاگ دیتابیس که توضیح دهنده تغییرات لحظه ای 
دیتابیس بوده و اسلیوها این وقایع را زمانی که آماده باشند درخواست می کنند. نکته مهم این است که در این روش، امکان 
عملیات write/read فقط روی سرور مستر می باشد و روی سرور اسلیو فقط امکان read وجود دارد.

در نوشته قبلی
[راه اندازی Mysql/Mariadb Slave Replication](https://shgn.ir/2024-04-14/mysql-master-slave-replication.html)
صرفا پیرامون راه اندازی یک رپلیکیشن `master/slave` روی `mariadb/mysql` به صورت ساده و با 
استفاده از دستور `mysqldump` با این ویژگی که نیازی به توقف دیتابیس در حین کار نباشد و یک نود 
`slave` را ایجاد نمود.

![replication.png](replication.png "Mariadb master/slave replication")

این روش، روشی مطمئن می باشد، اما یکی از مشکلات بزرگ آن زمان بر بودن اجرای آن می باشد. استفاده دستور `mysqldump`، 
چه در مرحله بکاپ گیری و چه در مرحله بازگردانی بکاپ، طولانی عمل کرده که این کندی در مجموع راه اندازی یک رپلیکیشن، 
بسیار *نمایان* خواهد بود.

پس راه دیگری که خیلی سریع تر از آن عمل می کند، استفاده از روش `mariadb-backup` می باشد.

تنظیمات اولیه روی سروی های `master` و `slave` همانطور که در نوشته قبلی توضیح داده شد، انجام
می گردد. در قسمت همگام سازی دیتابیس ها `master` با `slave` به جای `mysqldump` از 
`mariadb-backup` طبق نوشته
[پشتیبان گیری سریع دیتابیس mariadb](http://localhost:8000/2024-09-03/backup-mriadb-with-mariadb-backup.html)
 عمل می گردد.

##همگام سازی
از دیتابیس اصلی به صورت زیر بکاپ گیری می شود:

    mariadb-backup --backup --target-dir=/var/lib/mysql/backup --user=backup-user --password=${PASSWORD}
    mariadb-backup --prepare --target-dir=/var/lib/mysql/backup

انتقال به `datadir` سرور مقصد:

    rsync -azviP /var/lib/mysql/backup app-user@salve-server-ip:/var/lib/mysql

راه اندازی سرویس `mariadb` سرور مقصد و انجام تنظیمات نهایی رپلیکیشن:

    systemctl start mariadb

و

    change master to
         master_host='master-server-ip',
         master_user='salve1',
         master_password='1234',
         master_log_file='binalog_file_name',
         master_log_pos=345;
    start slave;
    show slave status \G

در پایان انتظار می رود تا رپلیکیشن با موفقیت ایجاد و اجرا شود.

# منابع:
 - [Global Tranaction ID](https://mariadb.com/kb/en/gtid/)
 - [setting up a replica with mariabackup](https://mariadb.com/kb/en/setting-up-a-replica-with-mariabackup/#gtids)