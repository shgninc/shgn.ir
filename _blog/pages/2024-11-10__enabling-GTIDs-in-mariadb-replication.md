title: فعال سازی gtid در رپلیکیشن
briefing: ممکن است که در رپلیکیشنی که ایجاد شده است، نیاز به فعال سازی gtid باشد.
date_time: 2024-11-10 11:44
slug: enabling-GTIDs-in-mariadb-replication
tags: database, mariadb, learn, replication
type: post

استفاده از `GTID`، به خصوص در محیط‌هایی که نیاز به اطمینان بالا، مدیریت پیشرفته و کاهش خطا دارند، یک انتخاب
بسیار مؤثر است. با این حال، برای بهره‌برداری بهتر از `GTID`، باید سیستم را به درستی پیکربندی کرده و 
با محدودیت‌ها و نیازهای خاص محیط خود هماهنگ کرد.

از جمله مزایای استفاده از `GTID` موارد زیر می باشند:

 - ردیابی منحصر به فرد تراکنش ها
 - مدیریت آسان failover
 - ساده سازی راه اندازی رپلیکیشن
 - بازیابی خودکار
 - حذف خطای انسانی
 - پشتیبانی از تغییرات پویا در توپولوژی رپلیکیشن
 - امکان مقیاس پذیریبیشتر
 - سازگار با ابزارهای پیشرفته
 - بهبود کارایی در سناریوهای failback
 - کاهش پیچیدگی ریکاوری داده ها

 در این نوشته ما ۳ سرور داریم که یک مستر و ۲ اسلیو گرفته شده از آن را بدون `gtid` داریم و نیاز است تا بر
 روی آنها `gtid` فعال شود.
 
در گام اول، لازم است تا متغییر `gtid_domain_id` به ازاء هر کدام از سرورها مقدار دهی شود.

    SET GLOBAL gtid_domain_id = 1;

در گام بعدی سرور اسلیو استاپ و عملیات زیر را روی آن انجام می شود:

    STOP SLAVE;
    SHOW SLAVE STATUS \G

    *************************** 1. row ***************************
    Slave_IO_State: NULL
    Master_Host: 192.168.56.101
    Master_User: repl
    Master_Port: 3306
    Connect_Retry: 60
    Master_Log_File: mariadb-bin.000001
    Read_Master_Log_Pos: 510
    Relay_Log_File: mysqld-relay-bin.000002
    Relay_Log_Pos: 642
    Relay_Master_Log_File: mariadb-bin.000001
    Slave_IO_Running: No
    Slave_SQL_Running: No
    ...
    Exec_Master_Log_Pos: 510
    ...
    1 row in set (0.00 sec)

در خروجی حاصل، مقدار ۲ متغییر برای به دست آوردن `gtid` از روی سرور مستر بسیار مورد نیاز می باشد. 
`Relay_master_log_file` و `Exec_Master_Log_Pos`. روی سرور مستر، مقادیر این دو متغییر برای دستور
`BINLOG_GTID_POS` لازم هستند.

    SELECT BINLOG_GTID_POS('mariadb-bin.000001', 510);
    +--------------------------------------------+
    | BINLOG_GTID_POS('mariadb-bin.000001', 510) |
    +--------------------------------------------+
    | 1-101-1                                    |
    +--------------------------------------------+
    1 row in set (0.00 sec)

سپس، با اجرای دستورات زیر `gtid` روی اسلوی راه اندازی می شود:

    SET GLOBAL gtid_slave_pos = '1-101-1';
    CHANGE MASTER TO master_use_gtid=slave_pos;
    START SLAVE;

در پایان، برای چک وضعیت به صورت زیر عمل می شود:

    MariaDB [mysql]> SHOW SLAVE STATUS\G
    *************************** 1. row ***************************
    Slave_IO_State: Waiting for master to send event
    Master_Host: 192.168.56.101
    Master_User: repl
    Master_Port: 3306
    Connect_Retry: 60
    Master_Log_File: mariadb-bin.000001
    Read_Master_Log_Pos: 510
    Relay_Log_File: mysqld-relay-bin.000002
    Relay_Log_Pos: 642
    Relay_Master_Log_File: mariadb-bin.000001
    Slave_IO_Running: Yes
    Slave_SQL_Running: Yes
    ...
    Exec_Master_Log_Pos: 510
    ...
    Using_Gtid: Slave_Pos
    Gtid_IO_Pos: 1-101-1
    1 row in set (0.00 sec)

مشخصا، `gtid` فعال شده است. این پروسه را روی تمامی سرورهای اسلیو دیگر باید اجرا شود.

# منابع
 - [Enabling GTIDs for Server Replication in MariaDB Server](https://mariadb.com/resources/blog/enabling-gtids-for-server-replication-in-mariadb-server-10-2/)