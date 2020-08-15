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

## داکر - Docker 

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
       buster"

و درنهایت کافی هست تا برای نصب خود `docker` نیز از دستور زیر استفاده نمود:

    $ sudo apt-get update
    $ sudo apt-get install docker-ce docker-ce-cli containerd.io

#### اطمینان از نصب

در پایان برای اطمنان از نصب صحیح داکر، می توان یک ایمیج مرسوم و معروف آن را اجرا کرد:

    $ sudo docker run hello-world
 
 اگر این ایمیج به درستی دانلود و اجرا شود یک سری اطلاعات را چاپ و خارج می شود. در این حالت یعنی `Docker Engine` به درستی نصب شده است.
 
 امیدوارم که این مطلب مفید و کاربردی بوده باشد.
  
####منابع:

 * [Install Docker Engine on Debian][install docker]
 * [Docker (software)][docker]

[pass]: https://en.wikipedia.org/wiki/Platform_as_a_service
[install docker]: https://docs.docker.com/engine/install/debian/#install-using-the-repository
[docker]:https://en.wikipedia.org/wiki/Docker_(software)  
