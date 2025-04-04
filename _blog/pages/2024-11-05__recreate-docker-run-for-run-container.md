title: بازنویسی docker run از روی یک کانتینر در حال اجرا
briefing: باز سازی docker run از کانتینر در حال اجرا به راحتی.
date_time: 2024-11-05 12:21
slug: recreate-docker-run-for-run-container
tags: linux, tips, docker, container
type: post

گاها ممکن پیش آمده باشد که روی سروری، `container` ای را بیابید که در حال اجرا است، اما هیچ
 مستندی از نحوه اجرای آن نداشته باشید.

داشتن مستندات اجرایی یک کانتینر جایی مهم می شود که نیاز به جابجایی، راه اندازی مجدد و
 و عملیاتی از این دست باشد. به این وضعیت، نا مشخص و ما معلوم بودن شرایط و گزینه هایی از 
قبیل`volume` ها،  `port` های شبکه، نام کانتینر، و دیگر پارامترهای احتمالی که آن کانتینر با 
آنها اجرا شده را نیز اضافه کنید.

راه های مختلفی برای مستند سازی و اجرا یک دستور 'docker run' برای یک کانتینر وجود دارد. ساده 
ترین آنها ایجاد یک فایل `bash script` که حاوی آن دستور باشد، است اما یکی از بهترین آن ها
 استفاده از فایل `docker-compose.yml` می باشد.  

اما حالتی را تصور کنید که کانتنر در حال اجرا می باشد و هیچ کدام از مستندات فوق هم وجود ندارند.
 در این  صورت داشتن این مستندات دشوار بوده و باید آن ها را کشف یا ایجاد نمود. تنها راه ممکن
 استفاده از `docker inspect` است؛ البته انی نیز حاوی اطلاعات بسیار زیادی می باشد.

راهی ساده است که می توان با استفاده از `docekr inspect` به ذستور `docker run` نزدیک به دستور
 اصلی اجرا شده دست یافت.

فقط کافی است تا دستور زیر اجرا شود.

    docker inspect \
       --format "$(curl -s https://shgn.ir/2024-11-05/run.tpl)" \
       name_or_id_of_your_running_container

#منابع
 - [How to show the run command of a docker container](https://stackoverflow.com/a/38077377/926639)
 - [docker run](https://docs.docker.com/reference/cli/docker/container/run/)