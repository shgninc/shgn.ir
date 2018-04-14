title: نصب Galer Cluster بر روی debian8
briefing: Galer Cluster یک برنامه کلاستر همزمان چند سرور master برمبنای replication همزمان می باشد.
date_time: 2017-08-16 18:36
slug: galera_cluster
tags: linux, debian, galera, mariadb, cluster
type: post

برنامه Galera Cluster یک برنامه متن باز و رایگان clustering چند سرور به صورت Master با replication همزمان بر روی آنها در بستر MariDB می باشد. این نوع از کلاسترینگ فقط بر روی لینوکس قابل پیاده سازی بوده و فقط از موتور ذخیره سازی دیتابیس XtraDB یا InnoDB حمایت می کند. کار کردن با MariaDB ۱۰.۱، به طور پیش فرض wsrep API این کلاسترینگ در MariaDB درون سازی شده است.


برای نصب Galera Cluster، نیاز به دریافت و نصب آن به صورت جداگانه نمی باشد. در نسخه های جدید، این برنامه به همراه برنامه `mariadb-server` نصب می شود. باید دقت شود که فلسفه کاری Galera Cluster بر مبنای تعداد نود های فرد می باشد، بنابراین، برای ۳ نود توضیحات ارائه شده و در هرجا که کدها تکی بود، باید بر روی هر سه نود به طور همسان اجرا شوند.

### مراحل نصب
مراحل نصب بر روی دبیان8:

    $ sudo apt-get install software-properties-common
    $ sudo apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
    $ sudo add-apt-repository 'deb [arch=amd64,i386] http://mirror.mephi.ru/mariadb/repo/10.1/debian jessie main'
    $ apt-get update

    $ sudo apt-get install mariadb-server rsync

پس از نصب بسته ها لازم است تا فایل تنظیمات مربوط به راه اندازی کلاسترینگ ایجاد شود:

    $ sudo vi /etc/mysql/conf.d/galera.cnf

در فایل ایجاد شده باید پارامترهای زیر برای سرور **اول** اضافه و ذخیره شوند:

    [mysqld]
    #mysql settings
    binlog_format=ROW
    default-storage-engine=innodb
    innodb_autoinc_lock_mode=2
    query_cache_size=0
    query_cache_type=0
    innodb_flush_log_at_trx_commit=2
    innodb_buffer_pool_size=7G
    bind-address=192.168.205.32

    #Galera settings
    wsrep_provider="/usr/lib/galera/libgalera_smm.so"
    wsrep_cluster_name="ahenart_cluster-BAD"
    wsrep_cluster_address="gcomm://192.168.205.32,192.168.205.31,192.168.205.33"
    wsrep_sst_method=rsync
    wsrep_on=ON
    wsrep_node_address="192.168.205.32"
    wsrep_node_name="db12-rt"
    </code>

در فایل ایجاد شده باید پارامترهای زیر برای سرور **دوم** اضافه و ذخیره شوند:

    [mysqld]
    #mysql settings
    binlog_format=ROW
    default-storage-engine=innodb
    innodb_autoinc_lock_mode=2
    query_cache_size=0
    query_cache_type=0
    innodb_flush_log_at_trx_commit=2
    innodb_buffer_pool_size=7G
    bind-address=192.168.205.33

    #Galera settings
    wsrep_provider="/usr/lib/galera/libgalera_smm.so"
    wsrep_cluster_name="ahenart_cluster-BAD"
    wsrep_cluster_address="gcomm://192.168.205.32,192.168.205.31,192.168.205.33"
    wsrep_sst_method=rsync
    wsrep_on=ON
    wsrep_node_address="192.168.205.33"
    wsrep_node_name="db22-rt"

    در فایل ایجاد شده باید پارامترهای زیر برای سرور **سوم** اضافه و ذخیره شوند:

    [mysqld]
    #mysql settings
    binlog_format=ROW
    default-storage-engine=innodb
    innodb_autoinc_lock_mode=2
    query_cache_size=0
    query_cache_type=0
    innodb_flush_log_at_trx_commit=2
    innodb_buffer_pool_size=7G
    bind-address=192.168.205.31

    #Galera settings
    wsrep_provider="/usr/lib/galera/libgalera_smm.so"
    wsrep_cluster_name="ahenart_cluster-BAD"
    wsrep_cluster_address="gcomm://192.168.205.32,192.168.205.31,192.168.205.33"
    wsrep_sst_method=rsync
    wsrep_on=ON
    wsrep_node_address="192.168.205.31"
    wsrep_node_name="db32-rt"

###راه اندازی گلرا کلاستر
**برای راه اندزای گلرا کلاستر برای اول مرتبه باید به ترتیب زیر عمل نمود.**

*1* قبل از هر کاری بر روی هر سه سرور باید سرویس `mysql` متوقف شود:

    $ sudo service mysql stop

*2* سپس سروری که قرار است اولین نود تعیین شود به این صورت راه اندازی می شود:

    $ sudo galera_new_cluster

  یا

    $ sudo /usr/bin/galera_new_cluster

*3* جهت اطمینان از اجرای کلاسترینگ بر روی اولین نود:

    $ sudo ps aux | grep mysql

  که باید نتیجه زیر مشاهده شود:

    mysql 10587 14.0 15.5 1266120 155268 ? Ssl 01:50 0:00 /usr/sbin/mysqld --wsrep-new-cluster --wsrep_start_position=00000000-0000-0000-0000-000000000000:-1
    root 20822 0.0 0.0 12948 980 pts/0 S+ 01:22 0:00 grep --color=auto mysql</code>

*4* جهت الحاق نود های دوم و سوم به کلاسترینگ و فقط کافی است تا سرویس آن راه اندازی شود:

    $ sudo service mysql start


در این زمان هر سه نود گلرا کلاسترینگ راه اندازی و در حال اجرا می باشند. برای اطمینان از این موضوع می توان دستور زیر را بر روی هر سه نود گلرا اجرا و نتیجه را مشاهده نمود:

    $ mysql -u root -p -e "SHOW STATUS LIKE 'wsrep_cluster_size';"
    Enter password:
    +--------------------+-------+
    | Variable_name      | Value |
    +--------------------+-------+
    | wsrep_cluster_size | 3     |
    +--------------------+-------+

### منابع
  * [howto-install-configure-mariadb-galera-master-cluster-ubuntulinux](https://www.cyberciti.biz/faq/howto-install-configure-mariadb-galera-master-cluster-ubuntulinux/)
  * [MySQL wsrep Options](http://galeracluster.com/documentation-webpages/mysqlwsrepoptions.html)
  * [Galera Cluster System Variables](https://mariadb.com/kb/en/mariadb/galera-cluster-system-variables/)
