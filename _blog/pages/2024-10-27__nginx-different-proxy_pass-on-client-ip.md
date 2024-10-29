title: ارسال درخواست nginx به upstream های متفاوت بر مبنای آدرس کلاینت
briefing: انتقال درخواست کاربر به بکند ای متفاوت براساس آدرس درخواست دهنده.
date_time: 2024-10-27 17:51
slug: nginx-different-proxy_pass-on-client-ip
tags: tips, nginx, security
type: post

همانطور که می دانید، سرویس `nginx` به عنوان پروکسی نیز عمل می کند. در شرایطی ممکن است که نیاز شود، تا
 براساس آدرس `IP` کابر سرویس گیرنده، درخواست به `upstream` با `backend` ای متفاوت منتقل شود.

تنظیمات برای انجام این نیازمندی خیلی ساده، به ترتیب زیر، می باشد:

    location / {
    
        include /etc/nginx/proxy.conf;
        proxy_set_header X-Forwarded-Proto https;
    
        if ($remote_addr ~ "(172.30.123.50)|(172.30.123.55)") {
          proxy_pass https://different-upstream.example.com;
        }
    
        proxy_pass http://default-upstream.example.com:8080;
    
    }

در قسمت `if` می توانید آدرس `IP` های مورد نیاز خود را اضافه کنید.

#  منابع
 - [different proxy_pass upstream depending client ip address nginx](https://www.claudiokuenzler.com/blog/804/different-proxy_pass-upstream-depending-client-ip-address-nginx)