title: استفاده از commpact در mongodb
briefing: زمانی که از کلکشنی در مونگو دیتایی حذف شود، فضایی آزاد می شود که به مرور زمان این فضا روی دیسک به صورت پراکنده می ماند، برای آزادسازی این فضا و بهبود عملکرد نوشتن، از دستور کامپکت استفاده می شود
date_time: 2024-05-14 10:40
slug: How-to-compact-collection-in-mongodb
tags: database, tips, optimization, noSql, mongodb
type: post

دستور `compact`، همانطور که از نامش هم بر می آید، فضای شکسته و پراکنده را جمع و جور می کند، که خیلی هم در
`mongoDB` پر کاربرد می باشد. البته با دستور `remove` این پراکندگی در دیسک جمع آوری نمی شود.

![compact](compact.png)

# دستورات Drop و Remove و تعامل آن هابا compact
اکنون دو دستور `drop` و `remove` را از حیث حذف فایل بررسی می کنیم؛

 - db.collection.remove({}, {multi: true}): با این دستور فایل ها از B-tree یکی یکی حذف شده و در نهایت تمامی
 فایل ها حذف می شوند، اما، همانطور هم که در تصویر فوق قابل مشاهده است، فضای فیزیک فایل ها روی دیسک آزاد 
 نمی شوند.
 - db.collection.drop(): با این دستور، فایل های فیزیکی این کلکشن حذف و فضای مربوط به آن ها از روی دیسک بلافاصله
حذف می شوند.

در حالت اول که از دستور `remove` استفاده شده است، باعث می شود تا به مرور زمان و با فرایند حذف و درج های مختلف
پراکندگی در فضای دیسک مربوط به کلکشن ایجاد شود. برای آزادسازی فضای های گرفته شده روی دیسک باید از `compact`
استفاده کرد.

#compact چطور روی کارآیی رایت تأثیر می گذارد
زمانی که این دستور را روی کلکشنی می زنید، کلکشن را برای نوشتن قفل می کند و موجب بلوکه شدن دستورات 
خواندن/نوشتن روی کلکشن می شود. اجرای دستور کامپکت بسته به میزان دیتای روی کلکشن، زمان زیادی را می برد.


بنابراین پیشنهاد می شود این دستور در ساعات غیر پیک اجرا شود

#نحوه عملکرد دستور compact
زمانی که این دستور اجرا می شود موتور `wiredTiger` در پس زمینه شروع به نوشتن داده ها در جلو مکان های 
خالی فایل کلکشن کرده و در پایان فضای های خالی در آخر را حذف و رها می کند.

در پروسه اجرا دستور `compact` موتور `WireTiger` شروط زیر را نیز بررسی می کند:

- ۸۰٪ فضا در ابتدای فایل، وجود ۲۰٪ فضای خالی برای نوشتن و ۲۰٪ از دیتا، در آخر فایل وجود داشته باشد.
- ۹۰٪ از فضا در ابتدای فایل و ۱۰٪ فضای خالی برای نوشتن و ۱۰٪ از، دیتا در انتهای فایل وجود داشته باشد.

اگر شروط فوق برای یک کلکشن جاری باشد، می توان روی اجرا دستور `compat` حساب کرد، در غیر این صورت، ممکن خیلی 
سریع در جواب `OK` بگیرید، و به این معنی است که کلکشن نیازی به compact ندارد. 

#محاسبه میزان فضایی که با compact آزاد می شود
برای اطلاع از میزان فضایی که فایل آزادسازی با دستور `compact` می توان در خروجی دستور `db.collection.stats()`
در زیر قسمت `wiredTiger.block-manager.file bytes available for reuse` دید.

برای مثال:

    mymongo:PRIMARY> db.coll.stats().wiredTiger["block-manager"]["file bytes available for reuse"]
    5033984

#نحوه اجرا دستور compact
اجرا دستور یک کلکشن:

    > db.runCommand( { compact : 'mycollectionname' } ) 

اجرا دستور روی تمامی کلکشن ها:

    db.getCollectionNames().forEach(function (collectionName) {
        print('Compacting: ' + collectionName);
        db.runCommand({ compact: collectionName });
    });

#منابع
 - [Let's Talk about MongoDB's Compact Command](https://www.alibabacloud.com/blog/lets-talk-about-mongodbs-compact-command_595540)
 - [reducing mongodb database file size](https://stackoverflow.com/a/24723068/926639)
 - [compact in mongo](https://www.mongodb.com/docs/v6.0/reference/command/compact/)