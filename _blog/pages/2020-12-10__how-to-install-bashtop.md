title: آشنایی با برنامه کابردی Bashtop
briefing: برنامه ای برای مانیتورینگ منابع در لینوکس.
date_time: 2020-12-10 18:01
slug: how-to-install-bashtop
tags: linux, monitoring, utility
type: post

برنامه [`Bashtop`][bashtop] یکی از جدیدترین و جالب ترین برنامه های مانیتورینگ و مشاهده وضعیت منابع در محیط ترمینال لینوکس می باشد.

این برنامه می توان روی [لینوکس][linux]، مک و حتی `free BSD` نیز نصب نمود.
 
از قابلیت های این برنامه، امکان متوقف کردن پردازش ها هست

## پیشنیازهای نصب

 * برنامه `Bash 4.4` یا بالاتر
 * برنامه [`Git`][git]
 * برنامه های `sed`, `awk`, `grep` و ابزار `ps command-line`
 * برنامه `Lm-sensor` (به صورت دلخواه)
 
 ## نحوه نصب
 
 نصب این برنامه بسیار ساده و راحت هست. برای نصب کافی هست تا دستورات زیر را اجرا کنید:
 
    $ git clone https://github.com/aristocratos/bashtop.git
    $ cd bashtop
    $ sudo make install

بعد از نصب با اجرای دستور زیر این برنامه اجرا می شود:

    $ bashtop

## تصاویر برنامه




[bashtop]: https://github.com/aristocratos/bashtop
[linux]: https://shgn.ir/tag/linux.html
[git]: https://fa.wikipedia.org/wiki/%DA%AF%DB%8C%D8%AA_(%D9%86%D8%B1%D9%85%E2%80%8C%D8%A7%D9%81%D8%B2%D8%A7%D8%B1)