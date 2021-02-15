title: نصب Docker روی Debian 10
briefing: نحوه نصب Docker بر روی سیستم عامل محبوب  Debian 10
date_time: 2020-08-15 18:03
slug: installing_docker_on_debian
tags: docker, container, virtualization, linux
type: post

بعد از مدتها بالاخره با یک مطلب معمولی اما بسیار کاربردی برای تازه کارها برگشتیم. در پست قبلی با نام
 [آشنایی با ویژگی Cgroup در کرنل لینوکس](http://shgn.ir/2019-07-08/Cgroup-linux-kernel.html)
  با مفاهیم `Cgroup` و `namespace` و در نهایت با `container` ها آشنا شدیم.  
اکنون قصد داریم تا با یکی از بهترین برنامه ها مدیریت و کنترل `container`ها آشنا و آن را نصب کنیم.

# داکر - Docker 

داکر مجموعه ای محصولات ارائه زیرساخت به عنوان سرویس [PaaS][pass] بوده که از مجازی سازی سطح سیستم عامل برای اجرای برنامه ها در قالب کانتینرها استفاده می کند. کانتینرها برای برنامه، کتابخانه ها و تنظیمات مخصوص آن، تهیه و دسته بندی و از یکدیگر جداسازی می شوند. آن ها از طریق کانال های تعریف شده و استاندارد می توانند با یکدیگر ارتباط داشته باشند. تمامی کانتینرها فقط با استفاده از یک کرنل مشترک سیستم عامل هاست، و منابع به مراتب کمتر از یک ماشین مجازی اجرا می شوند. 

داکر دو حالت رایگان و شامل هزینه داشته. برنامه ای که کانتینرها را میزبانی کرده را `Docker Engine` می نامند.  

## نصب داکر 

برای نصب داکر روی `debian 10` حداقل پیشنیازها فقط داشتن سیستم دبیان۱۰ هست. سپس کافی است تا برنامه های زیر را نصب نمود:

    $ sudo apt-get update
    
    $ sudo apt-get install \
            apt-transport-https \
            ca-certificates \
            curl \
            gnupg-agent \
            software-properties-common


بعد لازم هست تا کلید `gpg` سورس لیست داکر را به سیستم اضافه کرد:

    $ curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
 
 و بعد باید آدرس سورس لیست نصب آن را به سورس لیست های سیستم عامل اضافه نمود:
 
    $ sudo add-apt-repository \
       "deb [arch=amd64] https://download.docker.com/linux/debian \
       $(lsb_release -cs) \
       stable"

و درنهایت کافی هست تا برای نصب خود `docker` نیز از دستور زیر استفاده نمود:

    $ sudo apt-get update
    $ sudo apt-get install docker-ce docker-ce-cli containerd.io

#### اطمینان از نصب

برای اطمنان از نصب صحیح داکر، می توان یک ایمیج مرسوم و معروف آن را اجرا کرد:

    $ sudo docker run hello-world
 
 اگر این ایمیج به درستی دانلود و اجرا شود یک سری اطلاعات را چاپ و خارج می شود. در این حالت یعنی `Docker Engine` به درستی نصب شده است.
 
 امیدوارم که این مطلب مفید و کاربردی بوده باشد.
 
 
 
 
# نصب docker-compose

در پایان یکی از ابزارهای مفی و به شدت کاربردی برای داکر با عنوان `docker-compose` را معرفی می کنیم. از این ابزار به نوعی می توان به جای `docker run` استفاده نمود به طوری که پارامترهای آن به صورت مستند و پایدار می ماند. از طرفی به عنوان یک `orchestrator` ساده نیز شناخته می شود. روش عملکرد آن به این صورت هست که یک فایل ساده با نام `docker-compose.yml` را در پوشه ای (ترجیحا بانام سرویس مورد نظر) ایجاد کرده و تمامی پارامترهای اجرایی یک یا چند کانتینر به هم مرتبط را داخل فایل قرارداده و در نهایت با اجرای `docker-compose` تمامی سرویس های آن اجرا خواهند شد.

### نصب  

    sudo curl -L "https://github.com/docker/compose/releases/download/1.28.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
 و در پایان برای اطمینان می توان دستور زیر را اجرا نمود:
 
    $ docker-compose --version
    docker-compose version 1.28.2, build 1110ad01
    
### ایجاد فایل docker-compose

برای ایجاد یک سرویس با `docker-compose` مراحل زیر را اجرا می کنیم:

    mkdir composetest
    cd composetest
 
سپس یک فایل با نام `docker-compose.yml` ایجاد کرده و محتویات زیر را داخل قرار می دهیم:

    version: "3.9"
    services:
      web:
        build: .
        ports:
          - "5000:5000"
      redis:
        image: "redis:alpine"

همانطور که مشاهده می کنید دو سرویس `web` و `redis` در این فایل ایجاد می شوند. در نهایت برای ایجاد و اجرا کافی هست تا فقط دستور زیر را اجرا کنید:

    $ docker-compose up
    
    Creating network "composetest_default" with the default driver
    Creating composetest_web_1 ...
    Creating composetest_redis_1 ...
    Creating composetest_web_1
    Creating composetest_redis_1 ... done
    Attaching to composetest_web_1, composetest_redis_1
    web_1    |  * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
    redis_1  | 1:C 17 Aug 22:11:10.480 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
    redis_1  | 1:C 17 Aug 22:11:10.480 # Redis version=4.0.1, bits=64, commit=00000000, modified=0, pid=1, just started
    redis_1  | 1:C 17 Aug 22:11:10.480 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
    web_1    |  * Restarting with stat
    redis_1  | 1:M 17 Aug 22:11:10.483 * Running mode=standalone, port=6379.
    redis_1  | 1:M 17 Aug 22:11:10.483 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
    web_1    |  * Debugger is active!
    redis_1  | 1:M 17 Aug 22:11:10.483 # Server initialized
    redis_1  | 1:M 17 Aug 22:11:10.483 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
    web_1    |  * Debugger PIN: 330-787-903
    redis_1  | 1:M 17 Aug 22:11:10.483 * Ready to accept connections

در پایان سرویس همانطور که در فایل تنظیم شده است از طریق آدرس `http://MACHINE_VM_IP:5000` در دسترس می باشد.
####منابع:

 * [Install Docker Engine on Debian][install docker]
 * [Docker (software)][docker]
 * [Install docker-compose][docker-compose]

[pass]: https://en.wikipedia.org/wiki/Platform_as_a_service
[install docker]: https://docs.docker.com/engine/install/debian/#install-using-the-repository
[docker]:https://en.wikipedia.org/wiki/Docker_(software)
[docker-compose]: https://docs.docker.com/compose/install/  
