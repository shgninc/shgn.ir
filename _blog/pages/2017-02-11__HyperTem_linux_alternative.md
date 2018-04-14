title: نرم افزاری معادل Microsoft HyperTerminal در linux
briefing: از جمله نرم افزارهایی که در اوبونتو می تواند به جای برنامه `Microsoft HyperTerminal` برای کا با پورتهای سریال به کار رود نرم افزار `GTKTerm` می باشد.
date_time: 2013-01-20 10:53
slug: HyperTem_linux_alternative
tags: microsoft, linux, windows, terminal
type: post

با سلام.

####Microsoft HyperTerminal
در گذشته یک برنامه مفید و کاربردی ای بود به نام [Microsoft HyperTerminal][HyperTerminal] که خیلی مورد استفاده برای متخصصین شبکه و سخت افزار به منظور برقراری ارتباط مستقیم با قطعات سخت افزاری و شبکه ای قرار می گرفت. از این برنامه برای برقراری ارتباط با دیگر رایانه ها، بوردهای تبلیغاتی، سرویس های آنلاین و telnet زدن به سایتها با استفاده از یک مودم تلفنی و یا ارتباط شبکه ای و یا حتی با کابل سریال یا com استفاده می گردیده است. شرکت مایکروسافت این برنامه همراه با نسخه xp ویندوز ارائه کرده بود و از نسخه 7 به بعد این برنامه ارائه نشده است.

![hypertem](hypertem01.JPG)<br />
![hypertem](hypertem02.gif)<br />
![hypertem](hypertem03.png)<br />

####GTKTerm
از جمله نرم افزارهایی که در اوبونتو می تواند به جای برنامه `Microsoft HyperTerminal` برای کا با پورتهای سریال به کار رود نرم افزار `GTKTerm` می باشد. این نرم افزار، یک برنامه بسیار قوی، ساده و آزاد در این زمینه است.

<center>
![GTKTerm Configuration](https://fedorahosted.org/gtkterm/raw-attachment/wiki/WikiStart/Configuration.png)
</center>

#####ویژگی های این برنامه:
 *  پنجره ترمینال برای پورت سریال
 *  راحتی تنظیم پارامترهای پورت(`speed`, `parity`, `bits`, `stopbits`, `flow control`)
 *  استفاده از termios API
 *  امکان ارسال فایل (به صورت داده های ساده و نه با استفاده از هیچ پروتوکلی)
 *  تأخیر در پایان خط در زمان ارسال فایل
 *  حروف خاص قبل از ارسال یک فایل منتظر هستند
 *  امکان کنترل خطوط به صورت دستی(DTR, CTS)
 *  دریافت وضعیت کنترل خطوط(RTS, CD, DSR, RI)
 *  نمایش `Hexadecimal`

 <center>
 ![GtkTerm](https://fedorahosted.org/gtkterm/raw-attachment/wiki/WikiStart/GtkTerm.png)
 </center>

[HyperTerminal]: https://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/term_whatis_intro.mspx?mfr=true  "HyperTerminal"
