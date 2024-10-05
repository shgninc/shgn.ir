title: پشتیبان گیری سریع دیتابیس mariadb
briefing: یکی از سریع ترین روش های پشتیبان گیری از دیتابیس mariadb استفاده از mariadb-backup است.
date_time: 2024-09-03 10:59
slug: backup-mriadb-with-mariadb-backup
tags: database, mariadb, backup
type: post

یکی از سریع ترین روش های پشتیبان گیری از دیتابیس `mariadb` استفاده از `mariadb-backup` است. در حقیقت این
 این برنامه از `xtrabackup` که از دیتابیس های `mysql` و `xtradb` پشتیبان گیری می کند، گرفته شده است.

<img src="mariadb-backup.jpg" alt="Mariadb Backup" style="width:700px;" />

قبلا درباره دیگر روش های پشتیبان گیری از دیتابیس `mysql/mariadb` صحبت کرده ایم، از جمله 
[آشنایی با mydumper/myloader](https://shgn.ir/2023-12-16/mydumper-myloader.html)
 و یک اشاره اولیه به `mysqldump` در مقاله
 (راه اندازی Mysql/Mariadb Slave Replication)[https://shgn.ir/2024-04-14/mysql-master-slave-replication.html]
 کرده ایم. در این دو حالت مطمئن ترین روش `mysqldump/mariadb-dump` می باشد اما سرعت در
 `mydumper/myloader` خیلی بیشتر است.

در روش `mariadb-backup` ما در پشتیبان گیری به ویژه به صورت افزایشی - incremantal - نیز سرعت بسیار قابل
 قبولی را داریم. نکته ای که باید در نظر داشت، **از هر نسخه ای از `mariadb` پشتیبان گیری انجام شود، بازگرداندن
 نیز باید روی همان نسخه صورت پذیرد.**

## پشتیبان گیری کامل از دیتابیس
به صورت خیلی ساده برای پشتیبان گیری از دیتابیس می توان با اجرا دستور زیر پشتیبان گیری انجام داد. نکته حائز
 اهمیت این است که، هاستی که قرار است پشتیبان گیری آن جا انجام شود، نیازمند به *فضای دیسکی برابر با میزان فعلی
 دیتابیس* می باشد. 

    mariadb-backup --backup --target-dir=/path/to/save/backup/files --user=backup_user --password="${PASSWORD}" --host=mariadb-host-address

بعد از اجرای دستور فوق باید دستور زیر اجرا شود تا پشتیبان گرفته شده جهت بازیابی معتبر و پایدار شود:

    mariadb-backup --prepare --target-dir=/path/to/save/backup/files 
### پشتیبان گیری افزایشی
برای انجام پشتیبان گیری افزایشی از دیتابیس، مراحل به این صورت است که ابتدا باید یک پشتیبان گیری کامل از
 دیتابیس انجام شود، که بالاتر بیان شد، سپس با دستور زیر به صورت افزایشی از دیتابیس پشتیبان گیری انجام شود:

    mariabackup --backup --target-dir=/path/to/save/backup/inc1 --incremental-basedir=/path/to/save/backup/files --host=host-maridb-address --user=backup_user --password="${PASSWORD"
گزینه `--target-dir` مشخص کننده مسیر قرار گیری فایل های تغییرات بر اساس گزینه `--incremental-basedir` می باشد
 که محل قرارگیری پشتیبان کامل است.

برای انجام پشتیبان گیری افزایش بعدی، به صورت زیر عمل می شود:

    mariabackup --backup --target-dir=/path/to/save/backup/inc2 --incremental-basedir=/path/to/save/backup/inc1 --host=host-maridb-address --user=backup_user --password="${PASSWORD"

### آماده سازی پشتیبان
در پشتیبان گیری افزایشی ما حداقل ۲ یا بیشتر پشتیبان خواهیم داشت که اولین آن پشتیبان کامل و مابقی افزایشی
 می باشد. جهت بازگرداندن پشیتبان، ابتدا باید افزایشی ها را به پشتیبان کامل پایه اعمال نمود، برای این مهم
 با گزینه `--prepare` و همچنین `--aply-log-only` قابل انجام است.

    mariadb-backup --prepare --target-dir=/path/to/save/backup/files
با این دستور، پشتیبان کامل پایه گرفته شده، در مسیر مشخص شده، با تغییرات `InnoDB redo log` همسان سازی
 می شوند، سپس با دستور زیر پشتیبان های افزایشی به پشیتبان کامل اعمال می شود:

    mariadb-backup --prepare --target-dir=/path/to/save/backup/files --incremental-dir=/path/to/save/backup/inc1
با اجرای این دستور پشتیبان افزایشی اول به پشتیبان کامل پایه اعمال می گردد.

##  بازیابی دیتابیس پشتیبان گرفته شده
بعد از انجام پشتیبان گیری از دیتابیس و آماده سازی پشتیبان های کامل و افزایشی، گام بعدی، انتقال فایل ها و 
 بازگرداندن پشتیبان در سرور مقصد می باشد. برای این مهم باید از گزینه های `--copy-back` یا`--move-back`
 استفاده کرد. با گزینه `--copy-back`علاوه بر بازگرداندن پشتیبان دیتابیس، فایل های پشتیبان نیز حفظ می شوند،
 اما در گزینه `--move-back` فقط پشتیبان بازگردانده می شود و فایل ها حذف می شوند.
مراحل بازگرداندن پشتیبان دیتابیس:

 * توقف سرویس دیتابیس `MariaDB Server`

        sudo systemctl stop mariadb.service

 * از خالی بودن `datadir` اطمینان حاصل کنید

        sudo rm -rf /var/lib/mysql/*

 * اجرای دستور بازگردانی پشتیبان:

        sudo rsync -avrP /path/to/save/backup/files /var/lib/mysql/

 * تصحیح دسترسی و مجوز فایل های بازگردانده شده:
 
        sudo chown -R mysql:mysql /var/lib/mysql

 * در پایان راه اندازی مجدد سرویس دیتابیس:
       
        sudo systemctl strat mariadb.service

این مراحل خیلی ساده و سریع انجام می شود.

# منابع
 - [full backup and restore with mariabackup](https://mariadb.com/kb/en/full-backup-and-restore-with-mariabackup/)
 - [incremental backup and restore with mariabackup](https://mariadb.com/kb/en/incremental-backup-and-restore-with-mariabackup/)
 - [comprehensive guide backing up and recovering data in mariadb](https://travishorn.com/comprehensive-guide-backing-up-and-recovering-data-in-mariadb)