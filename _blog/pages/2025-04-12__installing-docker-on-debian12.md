title: نصب Docker روی Debian 12 bookworm
briefing:  نحوه نصب Docker بر روی سیستم عامل محبوب  Debian 12 Bookworm.
date_time: 2025-04-12 15:40
slug: installing-docker-on-debian12
tags: linux, docker, debian, virtualization
type: post

#مقدمه
در پستی که قبلا در همین سایت بوده با نام 
[نصب Docker روی Debian 10](https://shgn.ir/2020-08-15/installing_docker_on_debian.html)
مبحث نصب داکر روی دبیان۱۰ مطرح و ارائه شد. با گذشت زمان و به روز رسانی های انجام شده، چه در
 سطح سیستم عامل و چه در سطح خود برنامه تغییرات زیادی به وجود آمده است.

لذا در این نوشته سعی می شود تا نحوه نصب `docker` روی `debian 12` بیان شود.

یه سری توضیحات پیشنیاز برای داکر از جمله مفاهیم `Cgroup`، `namespace` و `container` ها
در پست قبلی با نام
[آشنایی با ویژگی Cgroup در کرنل لینوکس](http://shgn.ir/2019-07-08/Cgroup-linux-kernel.html)
 آشنا شدیم.
![installing-docker-on-debian12](installing-docker-on-debian12.jpg)
#نصب داکر

برای نصب داکر روی دبیان ۱۲ پیشنیازهایی لازم است.

به عنوان پیشنیاز دستورات زیر باید اجرا شوند:

    sudo apt-get update
    sudo apt-get install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

در گام بعدی سورس لیست برای نصب داکر اضافه می شود:

    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    sudo apt-get update

در انتها برای نصب خود برنامه از دستور زیر استفاده می شود:

    sudo apt-get install docker-ce docker-ce-cli containerd.io

# نصب docker-compose

در پایان یکی از ابزارهای مفی و به شدت کاربردی برای داکر با عنوان `docker-compose` را معرفی می کنیم. از این ابزار به نوعی می توان به جای `docker run` استفاده نمود به طوری که پارامترهای آن به صورت مستند و پایدار می ماند. از طرفی به عنوان یک `orchestrator` ساده نیز شناخته می شود. روش عملکرد آن به این صورت هست که یک فایل ساده با نام `docker-compose.yml` را در پوشه ای (ترجیحا بانام سرویس مورد نظر) ایجاد کرده و تمامی پارامترهای اجرایی یک یا چند کانتینر به هم مرتبط را داخل فایل قرارداده و در نهایت با اجرای `docker-compose` تمامی سرویس های آن اجرا خواهند شد.

### نصب

    sudo curl -L "https://github.com/docker/compose/releases/download/v2.35.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

و در پایان برای اطمینان می توان دستور زیر را اجرا نمود:

    $ docker-compose --version
    docker-compose version 2.35.0, build 1110ad01

#منابع
 * [Install Docker Engine on Debian](https://docs.docker.com/engine/install/debian/)
 * [نصب Docker روی Debian 10](https://shgn.ir/2020-08-15/installing_docker_on_debian.html)
