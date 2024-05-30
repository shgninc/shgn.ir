title: استفاده از htpasswd
briefing: برخی از سرویس ها برای اهراز هویت کابران و ایجاد یک دسترسی ساده از برنامه htpasswd قدیمی استفاده می کنند.
date_time: 2024-05-27 10:50
slug: using-htpasswd
tags: linux, utility, nginx, apache, security
type: post

برخی از سرویس ها برای اهراز هویت کابران و ایجاد یک دسترسی ساده از برنامه `htpasswd` قدیمی استفاده می کنند.
 بیشتر این بهره گیری توسط سرویس دهنده های وب (`apache/nginx`) انجام می شده است.

#نصب htpass
نصب این برنامه خیلی ساده است و فقط کافی است تا دستورات زیر را اجرا کنید:

    sudo apt update
    sudo apt install apache2-utils

#ایجاد htpasswd
برای ایجاد و ذخیره یک کاربری با پسورد مناسب به صورت زیر عمل می شود:

    htpasswd -c filename.passwd user_name

برای مثال فایل زیر را مشاهده کنید:

    htpasswd -c users.passwd shgn
بعد از اجرا:

![htpasswd](htpasswd.png "Basic access authentication")

و در نهایت محتوای فایل بدین صورت ایجاد می شود:

    shgn:$apr1$xVttFVxB$sEW1f0lN3LBpza5XFl6CB.

#منابع
- [How to install htpasswd utility in Linux](https://it-explain.com/how-to-install-htpasswd-utility-in-linux/)
- [Basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)