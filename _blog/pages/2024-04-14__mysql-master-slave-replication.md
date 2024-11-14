title: راه اندازی Mysql/Mariadb Slave Replication
briefing: یکی از روش های راه اندازی رپلیکیشن در دیتابیس ها master/slave است
date_time: 2024-04-14 16:10
slug: mysql-master-slave-replication
tags: database, mariadb, mysql, replication
type: post

دیتابیس `mysql/mariadb` توپولوژی های رپلیکیشن مختلفی را معرفی کرده اند، معروف ترین آنها
توپولوژی `Master/Slave` می باشد که در آن یک سرور به عنوان مستر عمل کرده و دیگری به عنوان اسلیو.
به طور پیش فرض، رپلیکیشن به صوت نامتقارن بوده که با ارسال وقایع مستر به باینری لاگ دیتابیس که
 توضیح دهنده تغییرات لحظه ای دیتابیس بوده و اسلیوها این وقایع را زمانی که آماده باشند درخواست
 می کنند. نکته مهم این است که در این روش، امکان عملبات `write/read` فقط روی سرور مستر می باشد و
 روی سرور اسلیو فقط امکان `read` وجود دارد.

![maridb-replication](mariadb-replication.png "Mysql/Mariadb Master/Salve Replication")

یکی دیگر از روشهای راه اندازی رپلیکیشن، `master-master` است که در دیتابیس `mysql/mariadb` به وسیله
 تکنولوژی `Galera cluster` قابل پیاده سازی و راه اندازی می باشد. در این روش امکان `read` و`write`
به صورت همزمان وجود دارد. ما هم راه اندازی این روش رپلیکیشن به
 صورت ساده در لینک
[نصب Galera Cluster بر روی debian 10](https://shgn.ir/2021-03-07/galera-cluster-debian-10.html)
و راه اندازی همین رپلیکیشن بر بستر `Docker` در لینک
[راه اندزای گلرا کلاستر با داکر](https://shgn.ir/2023-12-20/galera-cluster-by-docker.html)
توضیح داده شده است.

در این نوشته نحوه راه اندازی یک رپلیکیشن `Master/Slave` از دیتابیسی که موجود و زیر بار است، 
روی `Mariadb`، طوری که قطعی اتفاق نیفتد را با هم مرور خواهیم کرد.

## تنظیمات سرور مستر
روی این سرور سرویسی دیتابیس `Mariadb` نصب شده است و حاوی دیتابیس به همراه داده ها و اطلاعات
 برنامه ها می باشد.
برای آماده سازی سرور اصلی، یک سری تنظیمات باید روی آن اعمال شود.

server-id یک شماره یکتا به مستر تخصیص داده می شود. تمام اسلیوها نیز یک id می گیرند که این عدد بیین
۱ تا ۲۳۲-۱ می باشد و برای هر سرور در گروه رپلیکیشن، این عدد باید یکتا باشد.

bind-address تنظیم کننده و تخصیص دهنده یک آدرس مشخص ip برای سرویس دهی روی آن آدرس می باشد.از `localhost`
 یا `127.0.0.1` استفاده نشود.

log-bin ویژگی ثبت باینری لاگ ها را فعال می کند

در نهایت این تنظیمات در فایل `/etc/mysql/my.cnf` به صورت زیر می شوند:

    [mariadb]
    bind-address                    = 0.0.0.0
    server-id                       = 10
    log_bin                         = mysql-bin
    binlog-format                   = mixed
    innodb_flush_log_at_trx_commit  = 1
    sync_binlog                     = 1

و در نهایت برای اعمال تنظیمات روی مستر باید سرویس ریست شود:

    systemctl restart mariadb.service

###ایجاد دسترسی رپلیکیشن
یک حساب کاربری با دسترسی `REPLICATION SLAVE` باید ایجاد شود:

    MariaDB [(none)]> CREATE USER 'slave1'@'%' IDENTIFIED BY 'slave@1234';
    Query OK, 0 rows affected (0.001 sec)

    MariaDB [(none)]>  GRANT REPLICATION SLAVE ON *.* TO 'slave1'@'%';
    Query OK, 0 rows affected (0.001 sec)

## تنظیم سرور Slave
همان تنظمیاتی که روی مستر ایجاد شده بود، را نیز روی اسلیوها در فایل 
`/etc/mysql/my.cnf`
اعمال می کنیم. فقط باید دقت شود 
تا sever-id متفاوتی از مستر داده شود.

    [mariadb]
    bind-address       = 0.0.0.0
    server-id          = 20
    log_bin            = mysql-bin
    binlog-format      = mixed
    relay-log          = mysql-relay-bin
    log-slave-updates  = 1
    read-only          = 1

لازم است تا سرویس ریست شود:

    systemctl restart mariadb.service

## همسان سازی اسلیو با مستر
زمانی که روی سرور مستر دیتابیسی دارید بزرگ و سنگین، برای انتقال آن به سرور اسلیو جهت همسان سازی
 لازم است تا یک `dump` از دیتابیس گرفته و روی اسلوی بازگردانده شود، سپس تنظیمات رپلیکیشن روی سرور
 اسلیو اعمال شد تا `mysql/mariadb` عملیات رپلیکشن را شروع کند.

برای انجام همسان سازی مراحل زیر را به ترتیب باید انجام شوند.

### بکاپ گیری دیتابیس-سرور مستر
ابتدا باید از دیتابیس مورد نظر،‌ بکاپی با گزینه های زیر گرفته شود:

    mysqldump --skip-lock-tables --single-transaction --flush-logs --master-data=2 mydb > ~/mysqldump.sql
گزینه `skip-lock-tables` باعث می شود تا زمان پشتیبان گیری، خللی در عملکرد جداول با لاک کردن آن ها
 ایجاد نشود.

گزینه مهم بعدی `master-data=2` است که در آن موجب می شود تا اطلاعات مربوط به مستر را نیز در 
 فایل یکاپ شامل اطلاعات مستر position و مستر فایل می باشد.

    gzip -9 ~/mysqldump.sql
    rsync -azv ~/mysqldump.sql.gz root@slave-server:

### بازگرداندن دیتابیس -اسلیو سرور

برای بازگرداندن پشتیبان روی سرور اسلیو مراحل زیر را باید طی شوند:

    gunzip ~/mysqldump.sql.gz
    mysql -uroot -p mydb < ~/mysqldump.sql

### راه اندازی رپلیکیشن
برای راه اندازی رپلیکیشن ما نیاز به دو داده مهم از سرور مستر داریم: `MASTER_LOG_FILE` و 
`MASTER_LOG_POS` که این ها در فایل یکاپ درج شده اند. پس:

    head dump.sql -n80 | grep "MASTER_LOG_POS"

در نهایت با لاگین به کنسول `mysql/mariadb` و اعمال تنظیمات نهایی رپلیکیشن راه اندازی خواهد شد:

    CHANGE MASTER TO MASTER_HOST='master-ip',MASTER_USER='slave1',MASTER_PASSWORD='slave@1234', MASTER_LOG_FILE='mster-log-file', MASTER_LOG_POS=master-log-pos;
    START SLAVE;

در پایان برای اطمینان از صحت رپلیکیشن دستور زیر را اجرا می کنیم:

    SHOW SLAVE STATUS \G

با خروجی زیر:

    MariaDB [(none)]> SHOW SLAVE STATUS\G
    *************************** 1. row ***************************
                   Slave_IO_State: Waiting for master to send event
                      Master_Host: master-ip
                      Master_User: slave1
                      Master_Port: 3306
                    Connect_Retry: 60
                  Master_Log_File: mysql-bin.000002
              Read_Master_Log_Pos: 665
                   Relay_Log_File: relay-bin.000002
                    Relay_Log_Pos: 555
            Relay_Master_Log_File: mysql-bin.000002
                 Slave_IO_Running: Yes
                Slave_SQL_Running: Yes
                  Replicate_Do_DB:
              Replicate_Ignore_DB:
               Replicate_Do_Table:
           Replicate_Ignore_Table:
          Replicate_Wild_Do_Table:
      Replicate_Wild_Ignore_Table:
                       Last_Errno: 0
                       Last_Error:
                     Skip_Counter: 0
              Exec_Master_Log_Pos: 665
                  Relay_Log_Space: 875
                  Until_Condition: None
                   Until_Log_File:
                    Until_Log_Pos: 0
               Master_SSL_Allowed: No
               Master_SSL_CA_File:
               Master_SSL_CA_Path:
                  Master_SSL_Cert:
                Master_SSL_Cipher:
                   Master_SSL_Key:
            Seconds_Behind_Master: 0
    Master_SSL_Verify_Server_Cert: No
                    Last_IO_Errno: 0
                    Last_IO_Error:
                   Last_SQL_Errno: 0
                   Last_SQL_Error:
      Replicate_Ignore_Server_Ids:
                 Master_Server_Id: 10
                   Master_SSL_Crl:
               Master_SSL_Crlpath:
                       Using_Gtid: No
                      Gtid_IO_Pos:
          Replicate_Do_Domain_Ids:
      Replicate_Ignore_Domain_Ids:
                    Parallel_Mode: optimistic
                        SQL_Delay: 0
              SQL_Remaining_Delay: NULL
          Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
                 Slave_DDL_Groups: 2
    Slave_Non_Transactional_Groups: 0
       Slave_Transactional_Groups: 0
    1 row in set (0.000 sec)

اگر در خروجی فوق این دو پارامتر با مقادیر `yes`باشند`Slave_IO_Running: Yes`و
`Slave_SQL_Running: Yes` رپلیکشین درست است و همچنین مقدار پارامتر `Seconds_Behind_Master` نشان
 دهنده میزان ثانیه ای است که اسلیو از مستر عقب است.

## رفع خطا در replication
در ارتباط بین سرور `master/slave` بعضا ممکن است خطایی رخ دهد که رپلیکیشن متأثر از آن شود.
ممکن است خطا جزئی باشد و بتوان دستی آن را رفع نمود، و گاها ممکن خطا اساسی باشد یا زمان زیادی
 از رخ دادن خطا گذشته باشد و `bonlog`های مربوطه در دسترس نباشند، که در این صورت لازم است تا 
رپلیکیشن از ابتدا ایجاد و راه اندازی شود.

اما در حالتی که خطایی چزئی رخ داده و بتوان آن را به صورت دستی رفع نمود، کافی است برای راه 
اندازی مجدد رپلیکیشن با استفاده از دستور`sql_slave_skip_counter = N` که`N`تعداد رخدادی 
است که در `binlog`ثبت شده و با این دستور اعلام می شود تا به اندازه آن، از آن رخدادها چشم 
پوشی شود. پس کافی است تا به ترتیب زیر عمل نمود.

        show slave status \G

خطا به صورت فرضی مشاهده شد.

        stop slave;
        -- THE COMMAND WHICH SOLVE TH PROBLEM --
        set global sql_slave_skip_counter = 1;
        start slave;
        show slave status \G
و این چرخه را ادامه می دهیم تا خطا رفع شود
        
***نکته مهم این که اگر این چشم پوشی ها زیاد اتفاق بیفتد، اون نود اسلیو از اعتبار لازم ساقط 
می شود و داده های آن ناقص می باشد و در این زمان، لازم است تا رپلیکیشن از ابتدا و کامل 
راه اندازی شود.***

#تغییرات ساختاری در رپلیکیشن

گاهی ممکن است تا یک سری دستورات `DDL` روی برخی جداول اعمال شوند. بعضا این نوع دستورات باعث `lock` شدن جدول (خواندن/نوشتن) می شوند؛ که این امر ممکن باعث نقص در روند رپلیکیشن یا یکپارچگی اطلاعات شود.
برهمین مبنا، به ویژه روی موتور دیتابیس `InnoDB` با یک سری استراتژی روی `lock` می توان این موضوع را مدیریت نمود.
فقط کافی است تا در دستور `alter` از استراتژی `lock=none` استفاده نمود:

    ALTER TABLE tab ADD COLUMN c varchar(50), ALGORITHM=INPLACE, LOCK=NONE;
    ALTER TABLE tab MODIFY user int null, algorithm=INPLACE, LOCK=NONE;
    ALTER TABLE tab drop index tab_user, algorithm=INPLACE, LOCK=NONE;

#منابع
 * [MySQL/MariaDB Master-Slave Replication](https://medium.com/@chandika.s/mysql-mariadb-master-slave-replication-feca556baa8f)
 * [MySQL Replication Setup without Downtime](https://linuxscriptshub.com/mysql-replication-setup-without-downtime/)
 * [How to setup MySQL replication with minimal downtime](https://serverfault.com/a/220435/194975)
 * [Setting Up Replication](https://mariadb.com/kb/en/setting-up-replication/)
 * [SET GLOBAL SQL_SLAVE_SKIP_COUNTER](https://mariadb.com/kb/en/set-global-sql_slave_skip_counter/)
 * [Alter Lock Strategy](https://mariadb.com/kb/en/innodb-online-ddl-overview/#alter-locking-strategies)