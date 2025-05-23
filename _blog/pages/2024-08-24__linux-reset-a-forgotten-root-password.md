title: تغییر کلمه عبور کاربر root در لینوکس
briefing: نحوه ریست کلمه عبور کاربر root در سیستم عامل linux آمده است
date_time: 2024-08-24 15:03
slug: linux-reset-a-forgotten-root-password
tags: linux, learn, tutorial, recovery 
type: post

در این نوشته، نحوه ریست کلمه عبور کاربر `root` در سیستم عامل `linux` آمده است.

برای ریست کلمه عبور نیاز به ریست سیستم و دسترسی به `grub` می باشد. مراحل کار به این ترتیب می باشد:

 1- دستگاه را خاموش کنید
 
 2- مجدد دستگاه را روشن کنید. زمانی که منوی `grub` را مشاهده کردید، دکمه `e` را فشار بدید
 تا به حالت ویراش وارد شود

![grub boot menu](grub.png "Grub Boot Menu") 

 3- در محیط ویرایش گزینه های گراب دنبال خطی بگردید که با `linux` شروع شده باشد. در این خط، تا کلمه 
  `ro quite/silenc` به انتها برید. بعد `ro` هر چه هست را حذف کنید. سپس `ro` را با `rw init=/bin/bash` 
  جابجا کنید.
 
![grub editor](editGrub.png "Grub in edit mode")

 4- دکمه Ctrl+x یا F10 را برای ریست بزنید.
 
 5- بعد بالا آمدن باید خط فرما را مشاهده کنید:
 
    :#

پس فایل سیستم را به صورت خواندن/نوشتن مجدد مونت کنید:

    :# mount -no remount,rw /

 6- اکنون کلمه عبور کاربر مورد نظرتان (root) را تغییر بدید:
 
    :# passwd

 7- برای اعمال تغییرات لازم است تا سیستم را ریست کنید:
 
    :# reboot -f

اکنون کلمه عبور جدید اعمال شده و شما باید بتوانید با آن لاگین کنید.

#منابع
 - [Linux Guide/Reset a forgotten root password](https://en.wikibooks.org/wiki/Linux_Guide/Reset_a_forgotten_root_password)