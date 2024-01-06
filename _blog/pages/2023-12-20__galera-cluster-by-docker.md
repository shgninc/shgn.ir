title: راه اندزای گلرا کلاستر با داکر
briefing: با فراگیر شدن کانتینرها برای سرویس های مختلف، یکی از ساده ترین و راحت ترین این برنامه ها برای کنترل و مدیریت کانتینرها `docker` می باشد.
date_time: 2023-12-20 13:28
slug: galera-cluster-by-docker
tags: linux, database, mariadb, docker, galera, cluster
type: post

با توجه به استفاده از تکنولوژی های مجازی سازی و رفتن به سمت فراگیر شدن کانتینرها برای سرویس های
مختلف، یکی از ساده ترین و راحت ترین این برنامه ها برای کنترل و مدیریت کانتینرها `docker` می باشد.

#مقدمه
در پروژه ها و برنامه های امروزی استفاده از دیتابیس اجتناب ناپذیر است. با توجه به نوع برنامه، نوع 
نگهداری دیتای برنامه ها دارای اهمیت می شود. که با راهکارهایی از قبیل `کلاستر` کردن سرویس و 
دیتا، ضریب پایداری آن را به شدت افزایش می دهند.

در این بین یکی از محبوب ترین و پر استفاده ترین دیتابیس ها `mariadb` است. که این دیتابیس نیز از
`galera cluster` برای کلاسترینگ دیتا بهره می برد. نحوه نصب کلاستر گلرا را در مطلب 
[نصب Galera Cluster بر روی debian 10](https://shgn.ir/2021-03-07/galera-cluster-debian-10.html)
قبلا توضیح داده ام.

همچنین در این نوشته قصد داریم تا راه اندازی `گلرا کلاستر` را به صورت کانتینری بیان کنیم، 
پس لازم است تا مطلب نصب داکر، نیز در لینک
[نصب Docker روی Debian 10](https://shgn.ir/2020-08-15/installing_docker_on_debian.html)
مطالعه شود.

#پیش فرض ها
برای شروع ما حداقل به ۳ سرور داکری نیازمندیم.

آدرس های سرور ها:

    db1 192.168.1.41
    db2 192.168.1.42
    db3 192.168.1.43

نیازمندی دیگر ما، فایل های `docker-compose.yml` می باشد که روی این ۳ سرور برای اجرای سرویس 
دیتابیس و کلاستر آن به ترتیب زیر است:

    version: "3"
    services: 
        mariadb:
            image: mariadb:11.1.2
            container_name: mariadb
            network_mode: "host"
            environment:
                - MARIADB_ROOT_PASSWORD=$ROOTPASSWORD
                - REPLICATION_PASSWORD=$ROOTPASSWORD
            volumes:
                - ./mariadb/galera.cnf:/etc/mysql/mariadb.conf.d/galera.cnf
                - /source/db/galera:/var/lib/mysql
            command:
                --wsrep-new-cluster 
                # uncomment this line in first run
            stdin_open: true
            privileged: true
            tty: true
            ulimits:
                nofile:
                    soft: 600000
                    hard: 640000

*دقت شود که به جای $ROOTPASSWORD پسورد مورد نظر خود را جایگذاری کنید*

**نکته مهم این که، برای اولین نودی که قرار است راه اندازی شود، در فایل کامپوز فوق قسمت comman در 
اولین اجرا نبایدکامنت باشد تا گزینه `wsrep-new-cluster` جهت راه اندازی کلاستر جدید اجرا شود. مابقی نودها
نباید مجدد این گزینه را هنگام راه اندازی اجرا کنند، پس کامنت کنید**

در کنار فایل کامپوز، یک فایل تنظیمات به نام galera.cnf نیز وجود دارد که محتوای آن به صورت زیر می باشد:

    [galera]
    query_cache_size                =0
    query_cache_type                =0
    innodb_flush_log_at_trx_commit  =2
    innodb_buffer_pool_size         =20G
    bind-address                    =0.0.0.0
    max_heap_table_size             =300MB
    innodb_flush_log_at_trx_commit  =0
    wsrep_provider_options	        = 'gcache.size=5G; gcache.page_size=5G;gcs.fc_limit=40;gcs.fc_factor=0.8'
    wsrep_slave_threads	            = 32
    wsrep_on                        = ON
    wsrep_provider                  = /usr/lib/galera/libgalera_smm.so
    wsrep_cluster_address           = "gcomm://192.168.1.41,192.168.1.42,192.168.1.43"
    binlog_format                   = row
    default_storage_engine          = InnoDB
    innodb_autoinc_lock_mode        = 2
    wsrep_node_address	            = "192.168.1.41"
    wsrep_sst_method	            = rsync
    wsrep_node_name		            = "db41"
    wsrep_cluster_name	            = "my_cluster"

# راه اندزای کلاستر
برای راه اندزای کلاستر گلرا لازم است تا گام های زیر را طی کنیم:

## گام اول
در سرور اول، در مسیر مشخصی فایل کامپوز و تنظیمات فوق را قرار داده و دستور زیر را جهت راه اندازی اولین نود 
اجرا می کنیم:

    docker-compose up -d

سپس کمی صبر می کنیم تا کلاستر آماده سازی های اولیه خود را انجام و مهیا شود.

**مجدد تأکید می شود که، برای اولین نودی که قرار است راه اندازی شود، در فایل کامپوز قسمت comman در اولین اجرا 
نباید کامنت باشد تا گزینه `wsrep-new-cluster` جهت راه اندازی کلاستر جدید اجرا شود. مابقی نودها نباید مجدد 
این گزینه را هنگام راه اندازی اجرا کنند، پس کامنت کنید**

## گام دوم

در سرور دوم، در مسیر مشخصی فایل کامپوز و تنظیمات فوق را قرار داده و دستور زیر را جهت راه اندازی نود دوم 
اجرا می کنیم:

    docker-compose up -d

سپس کمی صبر می کنیم تا نود دوم به کلاستر متصل شود

**و مجدد تأکید می شود که، ذز این نود که، در فایل کامپوز قسمت comman *باید* کامنت باشد تا 
گزینه `wsrep-new-cluster` مجددا اجرا نشود.**

## گام سوم

در سرور سوم، در مسیر مشخصی فایل کامپوز و تنظیمات فوق را نیز قرار داده و دستور زیر را جهت راه اندازی نود سوم 
اجرا می کنیم:

    docker-compose up -d

سپس کمی صبر می کنیم تا نود سوم هم به کلاستر متصل شود

**و مجدد تأکید می شود که، ذز این نود که، در فایل کامپوز قسمت comman *باید* کامنت باشد تا 
گزینه `wsrep-new-cluster` مجددا اجرا نشود.**

## گام چهارم

در هر کدام از ۳ سرور، داخل کانتینر `exec` کرده و دستور زیر را جهت اطمینان از صحت راه اندازی کلاستر 
اجرا می کنیم:

    docker-compose exec -it mariadb bash

    mariadb -u root -p -e "SHOW STATUS LIKE 'wsrep_cluster_size';"
    Enter password:
    +--------------------+-------+
    | Variable_name      | Value |
    +--------------------+-------+
    | wsrep_cluster_size | 3     |
    +--------------------+-------+

در صورتی که عدد نمایش داده شده غیر از ۳ باشد، به این معنی است که یکی از نودهای در اتصال به کلاستر با مشکل
مواجه شده و نیاز به بررسی بیشتر می باشد.

#منابع
 - [نصب Galera Cluster بر روی debian](https://shgn.ir/2021-03-07/galera-cluster-debian-10.html)
 - [نصب Docker روی Debian 10](https://shgn.ir/2020-08-15/installing_docker_on_debian.html)
 - [What is MariaDB Galera Cluster?](https://mariadb.com/kb/en/what-is-mariadb-galera-cluster/)
 - [How To Configure a Galera Cluster with MariaDB on CentOS 7 Servers](https://www.digitalocean.com/community/tutorials/how-to-configure-a-galera-cluster-with-mariadb-on-centos-7-servers)