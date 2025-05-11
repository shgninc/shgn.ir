title: مدیریت سرویس maxscale
briefing: در این نوشته با کنترل و مدیریت سرویس maxscale در حین اجرا آشنا می شویم.
date_time: 2025-05-07 13:00
slug: maxscale-management-by-maxctrl
tags: database, mariadb, mysql, maxscale
type: post

در مطلب قبلی،
[جلوگیری توقف سرویس دهی دیتابیس با maxscale](https://shgn.ir/2024-11-24/failover-by-maxscale.html)
پیرامون نحوه راه اندازی و انحام تنظیمات سرویس `maxscale` را بیان کردیم.

با توجه به مدل کارکرد و اهمیت این سرویس که آمده، تا سرویس دهی بدون وقفه را انجام دهد، 
کنترل و مدیریت روی این سرویس نیز از نظر نداشتن توقف بشدت دارای اهمیت می باشد

در این نوشته با کنترل و مدیریت سرویس `maxscale` برای موارد زیر که برای کنترل و مدیریت یک لودبالانسر 
مورد نیاز می باشد، آشنا می شویم:

 - مدیریت سرورها
 - مدیریت سرویس ها
 - مدیریت مانتورها
 - مدیریت listenerها
 - مدیریت فیلترها
 - مدیریت maxscale
 - مدیریت لاگ ها

پیش فرض این است که طبق نوشته قبلی که در بالاتر به آن اشاره شد، ما یک کلاستر از `maxscale` با سرورها، مانتورینگ
listener و ... داریم و در ادامه قصد کنترل أن ها بدون قطعی و در حال اجرا را داریم.

#مدیریت سروها
ابتدا لازم داریم تا لیستی از سرورهای موجود را مشاهده کنیم:

##فهرست یا نمایش سرورها
با دستور زیر لستی از سرورها ومشخصات آن ها را می توان مشاهده کرد:

    maxctrl: list servers
    ┌──────────┬───────────────┬──────┬─────────────┬─────────────────────────┬─────────────┐
    │ Server   │ Address       │ Port │ Connections │ State                   │ GTID        │
    ├──────────┼───────────────┼──────┼─────────────┼─────────────────────────┼─────────────┤
    │ mariadb1 │ 192.168.0.201 │ 3306 │ 0           │ Slave, Synced, Running  │ 100-100-203 │
    ├──────────┼───────────────┼──────┼─────────────┼─────────────────────────┼─────────────┤
    │ mariadb2 │ 192.168.0.202 │ 3306 │ 0           │ Slave, Synced, Running  │ 100-100-203 │
    ├──────────┼───────────────┼──────┼─────────────┼─────────────────────────┼─────────────┤
    │ mariadb3 │ 192.168.0.203 │ 3306 │ 0           │ Master, Synced, Running │ 100-100-203 │
    └──────────┴───────────────┴──────┴─────────────┴─────────────────────────┴─────────────┘
`MaxScale` از این وضعیت، برای الگوریتم مسیردهی استفاده می‌ کند:

 - Master (مستر) – در یک کلاستر با رپلیکیشن، این نقش به عنوان نود قابل نوشتن (Write-Master) در نظر گرفته می‌شود.
 - Slave (اسلیو) – نودهای با وضعیت خواندن، توسط `maxscale` برای عملبات (کوئری های)خواندن انتخاب می شوند. 
اگر تمام نودهای اسلیو از دسترس خارج شوند ولی مستر هنوز در دسترس باشد، روتر از مستر استفاده خواهد کرد.
 - Synced (همگام) – نشان دهنده وضعیت نودی از کلاستر/رپلیکیشن است که با سایر نودها در وضعیت همگام قرار دارد.
 - Running (در حال اجرا) – نشان دهنده وضعیت سروری که فعال و قابل دسترسی است. تمامی سرورهایی که `MariaDB MaxScale`
قادر به اتصال به آن‌هاست، به عنوان "در حال اجرا" علامت‌گذاری می‌شوند.

و برای نمایش جزئیات بیشتر از وضعیت و مشخصات یک سرور دیتبایس با دستور زیرقابل انجام می باشد:

    maxctrl show server mariadb1

#تغییر وضعیت سرور به حالت تعمیرات
گاهی پش می آید که لازم است تا برای تغییرات/تعمیرات روی یک سرور بکند دیتبایس، هیچ کوئری ای به آن سرور نرود،
 پس باید موقتا از لودبالانسر خارج شود. اصطلاحا به این وضعیت `maintenance mode` گفته می شود. برای تنظیم این
حالب برای یک سرور، دستور زیر قابل اجرا می باشد:

    maxctrl set server mariadb1 maintenance
    OK
پس اگر اکنون وضعیت سرورهای گرفته شود، به صورت زیر تغییر می کند:

    maxctrl: show server mariadb1
    ...
    │ State            │ Maintenance, Running
    ...

در این وضعیت هیچ ارتباط و کوئری ای سمت این سرور ارسال نخواهد شد.

همچنین برای خروج از وضعیت تغییرات/تعمیرات می توان دستور زیر را اجرا نمود:

    maxctrl clear server mariadb1 maintenace

#ایجاد سرور جدید

یکی از مرسوم ترین عملیات در لودبالانسر، ایجاد و اضافه نمودن یک بکند (سرور دیتابیس جدید) می باشد. برای این مهم
ابتدا باید سرور را در لودبالانسر ایجاد نمود:

    maxctrl create server mariadb4 address=192.168.0.204 port=3306
و سپس آن نود به یک مانیتور اضافه شود:

    maxctrl link monitor cluster-monitor mariadb4
حالا این سرور در مانتورینگ اضافه شده و قابلیت `failover` و `autorejoin` به آن افزوده شده است. اما قابلیت 
سرویس دهی و ارسال کوئری به سمت آن هنوز مهیا نیست. برای افزودن این سرور به سرویس دهی، باید این سرور به `service`
در `maxscale` اضافه شود.

     maxctrl link service cluster-service mariadb4
حالا سرور قابلیت سرویس دهی در لودبالانسر را دارد.

#حذف یک سرور
برای حذف یک سرور بکند از لودبالانسر چند مرجله باید طی شود. ابتدا باید سرور از سرویس های مرتبط جدا شود
سپس از مانیتورینگ جدا شود و در نهایت می توان سرور را حذف نمود.

##حذف از سرویس ها

ابتدا باید سرور را از سرویس هایی که به آنها متصل است جدا کنیم تا از چرخه بکند سرویس دهی خارج شده و کوئری ای
سمت آن ارسال نشود:

    maxctrl: list services
    ┌──────────────────┬────────────────┬─────────────┬───────────────────┬──────────────────────────────┐
    │ Service          │ Router         │ Connections │ Total Connections │ Servers                      │
    ├──────────────────┼────────────────┼─────────────┼───────────────────┼──────────────────────────────┤
    │ cluster-Service  │ readwritesplit │ 1           │ 1                 │ mariadb1, mariadb2, mariadb4 │
    └──────────────────┴────────────────┴─────────────┴───────────────────┴──────────────────────────────┘
لیستی از سرویس ها و سرروهایی که به آن سرویس متصل هستند نمایش داده می شود. حالا بر این مبنا می توان 
ادامه داد.

در گام بعدی باید سرور را از سرویس جدا کرد:

     maxctrl unlink service cluster-ervice mariadb4
     OK
حال سرور از سرویس جدا، و کوئری ای سمت آن ارسال نمی شود.

##حذف از مانیتورینگ
سپس باید سرور را از مانتیورینگ `maxscale` نیز جدا نمود:

     maxctrl unlink monitor cluster-monitor mariadb4
     OK
اکنون در لیست مانتورینگ، این سرور نبوده و `maxscale` من بعد کاری به آن نداشته و در قابلیت های `failover` و
`autorejoin` و `switchover` نمی باشد.

##حذف سرور
در پایان و بعد از جدایی سرور از سرویس و مانتورینگ، می توان خود سرور را از چرخه لودبالانسر `maxscael` حذف نمود:

    maxctrl destroy server mariadb4
    OK
#مدیریت مانیتورینگ maxscale
تعریف یک ماژول مانیتورینگ مناسب برای `maxscale` که به آن اجازه می دهد تا بهترین روتینگ کوئری ها 
براساس وضعیت حاری نودها را انجام دهد، ضروری می باشد. یکی از این ماژول ها `mariadbmon` و یکی هم 
`galeramon` می باشد که برای کلاستر `Galera` استفاده می شود

قبل از ایجاد مانتورینگ، لازم است تا یک حساب کاربری با دسترسی های مورد نیاز ماژول مانتورینگ، روی نودهای 
دیتابیس ایجاد شود. حداقل های این دسترسی ها به ترتیب زیر می باشند:

    MariaDB> CREATE USER maxscale_monitor@'٪' IDENTIFIED BY 'MaXSc4LeP4ss';
    MariaDB> GRANT SELECT ON mysql.* TO 'maxscale_monitor'@'٪';
    MariaDB> GRANT SHOW DATABASES ON *.* TO 'maxscale_monitor'@'٪';

البته کامل ان دسترسی ها در مطلب قبلی توضیح داده شده است.
[جلوگیری توقف سرویس دهی دیتابیس با maxscale](https://shgn.ir/2024-11-24/failover-by-maxscale.html)

برای ایجاد یک مانتور در حال اجرا سرویس `maxscale` از دستور زیر استفاده می شود:

    maxctrl create monitor cluster-monitor mariadbmon servers=mariadb1,mariadb2,mariadb3 user=maxscale_monitor password=MaXSc4LeP4ss
    OK
اکنون یک مانیتور با ۳ سرور در بکندش برای مانیتورینگ به وجود آمده است.

##فهرست و نمایش مانیتور

برای نمایس لیست مانتیتورها از دستور زیر استفاده می شود:

    maxctrl list monitors
    ┌─────────────────┬─────────┬──────────────────────────────┐
    │ Monitor         │ State   │ Servers                      │
    ├─────────────────┼─────────┼──────────────────────────────┤
    │ cluster-monitor │ Running │ mariadb1, mariadb2, mariadb3 │
    └─────────────────┴─────────┴──────────────────────────────┘

برای مشاهده جزئیات بیشتر از یک مانیتور لازم است تا دستور زیر اجرا شود:

    maxctrl show monitor cluster-monitor

##استارت و استاپ مانیتور
متوقف کردن یک مانیتور در `maxscale` موجب توقف مانیتورینگ وضعیت سرورهای بکند می گردد، این کار در ارتباط
با دستور `set server` و برای کنترل دستی وضعیت سرورها انجام می شود.

    maxctrl stop monitor cluster-monitor
و برای شروع مجددش به صورت زیر اجرا می شود:

    maxctrl start monitor cluster-monitor

## حذف یک مانیتور
به منظور حذف یک مانیتور در `maxscale` ابتدا لازم است تا تمامی سرورهایی که به آن متصل هستند را جدا نمود، 
به همین جهت مراحل زیر اجرا می شوند:

    maxcltrl list monitors
    ┌─────────────────┬─────────┬──────────────────────────────┐
    │ Monitor         │ State   │ Servers                      │
    ├─────────────────┼─────────┼──────────────────────────────┤
    │ cluster-monitor │ Running │ mariadb1, mariadb2, mariadb3 │
    └─────────────────┴─────────┴──────────────────────────────┘
پس برا جدا سازی بدین سان عمل می شود:

    maxctrl unlink monitor cluster-monitor mariadb1 mariadb2 mariadb3
سپس، با اطمینان از جدا شدن سرورها از مانیتور می توان دستور حذف آن را اجرا نمود:

    maxctrl destroy monitor cluster-nobitor
    OK

#مدیریت سرویس
به منظور مدیریت سرویس یا به عبارت دیگر تقسیم یا توزیع کننده،ابتدا باید یک حساب کاربری با دسترسی های 
موردنیاز روی نودهای دیتابیس ایجاد شود.

    MariaDB> CREATE USER maxscale_monitor@'%' IDENTIFIED BY 'MaXSc4LeP4ss';
    MariaDB> GRANT SELECT ON mysql.* TO 'maxscale_monitor'@'%';
    MariaDB> GRANT SHOW DATABASES ON *.* TO 'maxscale_monitor'@'%';

البته کامل آن دسترسی ها در مطلب قبلی توضیح داده شده است.
[جلوگیری توقف سرویس دهی دیتابیس با maxscale](https://shgn.ir/2024-11-24/failover-by-maxscale.html)

##ایجاد سرویس جدید
برای ایجاد سرویس جدید در `maxscale` دستور زیر را اجرا می کنیم:

    maxctrl create service زمعسفثق-Service readconnroute user=maxscale_monitor password=******
    OK
##لیست یا نمایش سرویس
برای نمایش لیستی از سرویس های دستور زیر را اجرا می کنیم:

    maxctrl list services
    ┌──────────────────┬────────────────┬─────────────┬───────────────────┬──────────────────────────────┐
    │ Service          │ Router         │ Connections │ Total Connections │ Servers                      │
    ├──────────────────┼────────────────┼─────────────┼───────────────────┼──────────────────────────────┤
    │ cluster-service  │ readwritesplit │ 1           │ 1                 │ mariadb1, mariadb2, mariadb3 │
    └──────────────────┴────────────────┴─────────────┴───────────────────┴──────────────────────────────┘
و برای مشاهده جزئیات یک سرویس کافی است دستور زیر اجرا شود:

    maxctrl show service cluster-service

##حذف یک سرویس
برای حذف یک سرویس ابتدا لازم است تا سرویس ها متصل به آن جدا شوند:

    maxctrl unlik servcie cluster-service mariadb1 mariadb2 mariadb3
ممکن است که سرویسی با `listener` با هم درآمیخته شده باشند پس این نیز باید حذف شود:

    maxctrl destroy listener cluste-service cluster-listener

و در پایان:

    maxctrl destroy service cluster-service

##اضافه و کم کردن سرور از سرویس
بعد ایجاد سرویس برای این که بتوان از آن سرویس استفاده نمود لازم است تا سرورهایی را به آن متل نمود:

    maxctrl link service cluster-service mariadb1 mariadb2 mariadb3
هم چنین برای جدا کردن یک سرور از سرویس:

    maxctrl unlik service cluster service mariadb4

#مدیریت listener
در نهایت برای ایجاد یک سرویس لودبالانسر مناسب لازم است تا به روشی پورتی را برای سرویس دهی باز و سرویس 
دهنده آن را مشخص نمود که این مهم در `maxscale`  با `listener` ها انجام می شود.

##لیست/نمایش listener
برای نمایش لیستی از listenerها دستور زیر را اجرا می کنیم:

    maxctrl list listeners
و برای مشاهده جزئیات بیشتر از یک listener کافی است تا دستور زیر را اجرا نمود:

     maxctrl show listener cluster-listener
## ایجاد listener
برای ایجاد یک `listener` از دستور زیر استفاده می شود:

    maxctrl create listener cluster-service cluster-listener 3307
##حذف یک listener
برای حذف یک listener کافی است تا دستور زیر را اجرا نمود:

    maxctrl destroy listener cluster-service cluster-listener

در پایان، دستورات بکار برده شده در این مقاله با نسخه ای از `maxscale` می باشد و ممکن است که به مرور 
زمان این دستورات یا پارامترهای آنها تغییراتی داشته باشند پس، قبل از اقدام و اجرا روی حالت پروداکشن،
مروری روی مستندات سایت اصلی خود `maxscale` داشته باشید.

#منابع

 - [MaxScale Basic Management Using MaxCtrl for MariaDB Cluster](https://severalnines.com/blog/maxscale-basic-management-using-maxctrl-mariadb-cluster/)
 - [MaxCtrl](https://mariadb.com/kb/en/mariadb-maxscale-24-maxctrl/)
 - [Setting a Server to Maintenance Mode in MaxScale with MaxCtrl](https://mariadb.com/kb/en/maxctrl-setting-a-server-to-maintenance-mode-in-maxscale-with-maxctrl/)
 - [MariaDB MaxScale Administration Tutorial](https://fossies.org/linux/MaxScale/Documentation/Tutorials/Administration-Tutorial.md)