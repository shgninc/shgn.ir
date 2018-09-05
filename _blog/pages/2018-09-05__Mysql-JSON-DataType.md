title:معرفی نوع داده JSON در دیتابیس Mysql-Mariadb
briefing: این نوع داده بر اساس استاندارد RFC 7159 بوده و به صورت یک رشته با قالب JSON قابل ذخیره سازی می باشد.
date_time: 2018-09-05 08:52
slug: Mysql-JSON-DataType
tags: mysql, mariadb, database, json, sql, noSql
type: post

زمانی که از نوع JSON برای ذخیره سازی اطلاعات صحبت می شود، مفهوم دیتابیس های غیر رابطه ای یا اصصطلاحا NoSQL را به خاطر می آوریم. جا دارد در [اینجا][sql-vs-nosql-differences] گذری به تفاوت بین دیتبایس های رابطه ای و غیر رابطه داشته باشیم.

##تعاریف نوع داده JSON در دیتابیس
این نوع داده بر اساس استاندارد [RFC 7159][rfc7159] بوده و به صورت یک رشته با قالب JSON قابل ذخیره سازی می باشد.
از ویژگی های این نوع داده اعتبار سنجی قالب متنی در حال ذخیره سازی با JSON بوده که در صورت عدم انطباق خطار تولید کرده، همچنین، بهبود قالب ذخیره سازی با ذخیره قالب JSON بوده که امکان دسترسی سریع به هر کدام از المان های آن را فراهم می کند.

میزان فضای مورد نیاز برای ذخیره سازی این نوع داده تقریبا برابر با نوع داده [LONGBLOB][LONGBLOB] یا [LONGTEXT][LONGBLOB] می باشد.

به همراه این نوع داده جدید، یک سری توابع SQL نیز ایجاد شده اند که امکان عملیات ایجاد، تغییرات و جستجو بر روی مقادیر JSON را می دهند، ارائه شده است. لیست این توابع از [اینجا][json-functions]  قابل مشاهده می باشند.

###تعریف نوع JSON در جدول
برای تعریف نوع داده `JSON` در جدول به صورت زیر عمل می شود:

    CREATE TABLE events( 
      id int auto_increment primary key, 
      event_name varchar(255), 
      visitor varchar(255), 
      properties json, 
      browser json
    );

#####  نکته حائز اهمیت این است که فیلد با نوع داده JSON نمی تواند مقدار پیش فرض داشته باشد. همچنین به طور مستقیم نمی توان بر روی آن نوع داده index زده شود. در عوض می توان از index بر روی [generated column][generated-column] که حاوی مقادیری که از نوع داده JSON حاصل شده استفاده نمود.

### درج داده در فیلد JSON
نمونه ای از نحوه درج اطلاعات در فیلدهای JSON:

    INSERT INTO events(event_name, visitor,properties, browser) 
    VALUES (
      'pageview', 
       '1',
       '{ "page": "/" }',
       '{ "name": "Safari", "os": "Mac", "resolution": { "x": 1920, "y": 1080 } }'
    ),
    ('pageview', 
      '2',
      '{ "page": "/contact" }',
      '{ "name": "Firefox", "os": "Windows", "resolution": { "x": 2560, "y": 1600 } }'
    ),
    (
      'pageview', 
      '1',
      '{ "page": "/products" }',
      '{ "name": "Safari", "os": "Mac", "resolution": { "x": 1920, "y": 1080 } }'
    ),
    (
      'purchase', 
       '3',
      '{ "amount": 200 }',
      '{ "name": "Firefox", "os": "Windows", "resolution": { "x": 1600, "y": 900 } }'
    ),
    (
      'purchase', 
       '4',
      '{ "amount": 150 }',
      '{ "name": "Firefox", "os": "Windows", "resolution": { "x": 1280, "y": 800 } }'
    ),
    (
      'purchase', 
      '4',
      '{ "amount": 500 }',
      '{ "name": "Chrome", "os": "Windows", "resolution": { "x": 1680, "y": 1050 } }'
    );
    
### جسجتو در نوع JSON
همچنین همانند کد زیر می توان در نوع داده JSON جستجو نمود:

    SELECT id, browser->'$.name' browser
    FROM events;

که نتیجه آن به این صورت خواهد بود:

    +----+-----------+
    | id | browser   |
    +----+-----------+
    |  1 | "Safari"  |
    |  2 | "Firefox" |
    |  3 | "Safari"  |
    |  4 | "Firefox" |
    |  5 | "Firefox" |
    |  6 | "Chrome"  |
    +----+-----------+
    6 rows in set (0.00 sec)

همچنین نمونه هایی بیشتر از انواع جسجتوها:

    SELECT browser->>'$.name' browser, 
          count(browser)
    FROM events
    GROUP BY browser->>'$.name';
    
    +---------+----------------+
    | browser | count(browser) |
    +---------+----------------+
    | Safari  |              2 |
    | Firefox |              3 |
    | Chrome  |              1 |
    +---------+----------------+
    3 rows in set (0.02 sec)
    
یا 

    SELECT visitor, SUM(properties->>'$.amount') revenue
    FROM events
    WHERE properties->>'$.amount' > 0
    GROUP BY visitor;
    
    ---------+---------+
    | visitor | revenue |
    +---------+---------+
    | 3       |     200 |
    | 4       |     650 |
    +---------+---------+
    2 rows in set (0.00 sec)
    
##خاتمه
در این نوشته سعی شده تا آشنای اولیه ای به نوع داده `JSNO` در دیتابیس `MySql` / `Mariadb`  حاصل شود.انشاءالله در فرصت های بعدی عمیق تر با این نوع داده آشنا می شویم.


[rfc7159]:https://tools.ietf.org/html/rfc7159
[LONGBLOB]:https://dev.mysql.com/doc/refman/8.0/en/blob.html
[json-functions]:https://mariadb.com/kb/en/json-functions/
[sql-vs-nosql-differences]:https://www.sitepoint.com/sql-vs-nosql-differences/
[generated-column]:http://www.mysqltutorial.org/mysql-generated-columns/