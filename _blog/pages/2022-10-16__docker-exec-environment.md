title: دسترسی به متغییرها با دستور docker exec 
briefing: A brief description of post.
date_time: 2022-10-16 17:07
slug: docker-exec-environment
tags: docker, linux, env, environment
type: post

استفاده از متغییر های محیطی همسان بین `container` و `host` در دستور `docker exec`، به عنوان یک چالش جالب مطرح هست.

به عنوان مثال متغییر محیطی `$HOME` نمایانگر مسیر خانه کاربر جاری هست، چه در هاست و چه در کانتینر.

برای نمونه:

    docker pull goyalmunish/devenv

نمونه ای که متغییر محیطی از هاست را فراخوانی می کند:

    docker exec -it devenv /bin/bash -c "echo $HOME"    # /home/ubuntu

نمونه ای که متغییر محیطی از داخل کانتینر را فراخوانی می کند، نکته در تفاوت استفاده از " "" هست:

    docker exec -it devenv /bin/bash -c 'echo $HOME'      # /root

این بود نکته ای مهم و کلیدی ولی خیلی ساده.

### منابع
[passing host vs container environment variables to docker exec](https://medium.com/an-idea/passing-host-vs-container-environment-variables-to-docker-exec-5c1b18e6de8e)