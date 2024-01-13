title: بستن تماس باز در asterisk
briefing: گاهی ممکن است که روی برخی کانال تماس های asterisk به هر دلیلی بسته نشوند، و لازم باشد تا به صورت دستی آن ها را ببندید
date_time: 2024-01-13 09:25
slug: hangup-a-call-on-asterisk
tags: linux, tips, asterisk
type: post

در برنامه `asterisk` که یک `pbx` بوده و برای مدیریت تلفن ها و تماس های تلفنی استفاده می شود، ممکن است گاهی
پیش آید که روی برخی کانال ها تماس ها به هر دلیلی بسته نشوند، و لازم باشد تا به صورت دستی آن ها را ببندید.

برای بستم کانال های باز در `asterisk`، با جستجو در اینترنت ممکن است به نتابیج زیر برسید:

    soft hangup

یا

    hangup requst

اما راه مطمئن و صحیح به صورت زیر می باشد.

ابتدا باید نام کامل کانال باز پیدا شود. با این دستور:

    core show channels

زمانی که نام کامالها نمایش داده شدند، لازم است تا نام کامل آن را برداشته (کپی کرده) تا در دستور اصلی از آن استفاده
شود، برای مثال

    PJSIP/anonymous-00026032

را کپی کردن و با دستور زیر می توان آن کانال بست:

    channel request hangup PJSIP/anonymous-00026032

و همین!

و به این صورت یک کانال باز در `asterisk` بسته می شود.

امید وارم که این مطلب مفید بوده باشد.

#منابع
 - [Using the Asterisk CLI to hang up on a call](https://thecomputerperson.wordpress.com/2019/07/03/using-the-asterisk-cli-to-hang-up-on-a-call/)