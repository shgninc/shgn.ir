title: نحوه ایجاد یک Stored Procedures در MySQL5- بخش دوم
briefing: یک روشی که خیلی مورد پسند بنده واقع شده، روشی است که در آن با استفاده از استور پروسیجرها کار هایم با دیتابیس را انجام می دهم. استور پروسیجر ها امکانی است که برخی نرم افزارهای مدیریت پایگاه داده ها آن را حمایت کرده و برخی خیر. از جلمه این پایگاه داده ها می توان از `MySQL، MSSQL` و... نام برد.
date_time: 2012-11-30 13:58
slug: create_mysql_stored_procedures2
tags: database, sql, mysql, stored_procedure
type: post

<center>
<img class="img-rounded" style="width: 500px; height: 350px;" data-holder-rendered="true"  alt="نحوه ایجاد یک Stored Procedures در MySQL5- بخش اول" src="MySQL.png" title="نحوه ایجاد یک Stored Procedures در MySQL5- بخش اول">
</center>

برای کار با بانک اطلاعاتی روش های متداول و مرسوم زیادی وجود دارد. اما یک روشی که خیلی مورد پسند بنده واقع شده، روشی است که در آن با استفاده از استور پروسیجرها کار هایم با دیتابیس را انجام می دهم. استور پروسیجر ها امکانی است که برخی نرم افزارهای مدیریت پایگاه داده ها آن را حمایت کرده و برخی خیر. از جلمه این پایگاه داده ها می توان از `MySQL`، `MSSQL` و... نام برد.در این نوشته نحوه ایجاد و کار با این امکان در نرم افزار مدیریت پایگاه داده های `MySQL` را بیان می کنم.در  [بخش اول](../2012-11-28/create_mysql_stored_procedures1.html)  سعی شد تعریفی مختصر و طریقه ایجاد، فراخوانی، تعریف پارامترها و متغییرها را عنوان کرده و ادامه آن را در این قسمت خدمت دوستان ارائه می کنم.

###گام ۴ : متغییرها
در این گام نحوه تعریف متغییرها و ذخیره دادها در استور پروسیجر را با هم می آموزیم. تعریف متغییرها دقیقا در ابتدای بلاک `BEGIN` و `END` به همراه تعیین نوع آنها انجام می گیرد.تعریف متغییر به صورت زیر می باشد:

    DECLARE varname DATA-TYPE DEFAULT defaultvalue;

#####مثالهایی از تعریف انواع متغییرها:

    DECLARE a, b INT DEFAULT 5;
    DECLARE str VARCHAR(50);
    DECLARE today TIMESTAMP DEFAULT CURRENT_DATE;
    DECLARE v1, v2, v3 TINYINT;

#####کار کردن با متغییرها
به منظور تخصیص مقدار به متغییرهای تعریف شده کافی است از دستورات `SET` یا `SELECT` استفاده نمایید:

    DELIMITER //
    CREATE PROCEDURE `var_proc` (IN paramstr VARCHAR(20))
    BEGIN
      DECLARE a, b INT DEFAULT ۵;
      DECLARE str VARCHAR(50);
      DECLARE today TIMESTAMP DEFAULT CURRENT_DATE;
      DECLARE v1, v2, v3 TINYINT;
      INSERT INTO table1 VALUES (a);
      SET str = ’I am a string’;
      SELECT CONCAT(str,paramstr), today FROM table2 WHERE b &gt;=5;
    END //

#####گام ۵ : کنترل روند اجرا برنامه در استور پروسیجرها
نرم افزار `MySQL` از ساختارهای کنترل روند اجرا `IF`, `CASE`, `ITERATE`, `LEAVE LOOP`, `WHILE` و `REPEAT` پشتیبانی می کند در این نوشته سعی می شود تا درباره ساختار هایی که بیشتر مرسوم و مورد استفاده هستند از قبیل `IF`, `CASE` و `WHILE` صحبت کنیم.

#####ساختار `IF`
با این ساختار بخش هایی از برنامه که شامل شروط هستند را کنترل می کنیم.

    DELIMITER //
    CREATE PROCEDURE `proc_IF` (IN param1 INT)
    BEGIN
      DECLARE variable1 INT;
      SET variable1 = param1 + 1;
       IF variable1 = 0 THEN
         SELECT variable1;
       END IF;
       IF param1 = 0 THEN
      SELECT 'Parameter value = 0';
       ELSE
      SELECT 'Parameter value &lt;&gt; 0';
       END IF;
    END //

#####ساختار `CASE`
این ساختار نیز برای کنترل شروط در برنامه می باشد. اما نمی توان از آن دقیقا به جا ساختار`IF` استفاده کرد. دو راه برای استفاده از این ساختار وجود دارد. راه اول:

    DELIMITER //
    CREATE PROCEDURE `proc_CASE` (IN param1 INT)
    BEGIN
      DECLARE variable1 INT;
      SET variable1 = param1 + 1;
      CASE variable1
           WHEN 0 THEN
              INSERT INTO table1 VALUES (param1);
           WHEN 1 THEN
              INSERT INTO table1 VALUES (variable1);
            ELSE
              INSERT INTO table1 VALUES (99);
      END CASE;
    END //

######راه دوم:

    DELIMITER //
    CREATE PROCEDURE `proc_CASE` (IN param1 INT)
    BEGIN
      DECLARE variable1 INT;
      SET variable1 = param1 + 1;
      CASE
        WHEN variable1 = 0 THEN
           INSERT INTO table1 VALUES (param1);
        WHEN variable1 = 1 THEN
           INSERT INTO table1 VALUES (variable1);
         ELSE
           INSERT INTO table1 VALUES (99);
      END CASE;
    END //

#####ساختار `WHILE`
در اصل سه نوع ساختار حلقه وجود دارد. حلقه `WHILE`، حلقه `LOOP` و حلقه `REPEAT`. و اختیار با شما است که از کدام نوع ساختار در برنامه استفاده کنید. در اینجا فقط حلقه `WHILE `گفته می شود:

    DELIMITER //
    CREATE PROCEDURE `proc_WHILE` (IN param1 INT)
    BEGIN
      DECLARE variable1, variable2 INT;
      SET variable1 = 0;
      WHILE variable1 &lt; param1 DO
          INSERT INTO table1 VALUES (param1);
          SELECT COUNT(*) INTO variable2 FROM table1;
          SET variable1 = variable1 + 1;
      END WHILE;
    END //

####گام ۶ : اشاره گرها یا Cursors
از این امکان جهت واکاوی و پردازش هر سطر، در میان چند سطر از یک کوئری برگردانده شده را فراهم می کند.این امکان نیز در `MySQL` هم برای استفاده در استور پروسیجرها ایجاد شده است. یک مثال ساده برای ایجاد و استفاده از یک اشاره گر:

    DECLARE cursor-name CURSOR FOR SELECT ...;  /*Declare and populate the cursor with a SELECT statement */
    DECLARE  CONTINUE HANDLER FOR NOT FOUND          /*Specify what to do when no more records found*/
    OPEN cursor-name;                                /*Open cursor for use*/
    FETCH cursor-name INTO variable [, variable];    /*Assign variables with the current column values*/
    CLOSE cursor-name;                               /*Close cursor after use*/

و حالا مثالی اشاره گر استفاده شده در پروسیجر:

    DELIMITER //
    CREATE PROCEDURE `proc_CURSOR` (OUT param1 INT)
    BEGIN
      DECLARE a, b, c INT;
      DECLARE cur1 CURSOR FOR SELECT col1 FROM table1;
      DECLARE CONTINUE HANDLER FOR NOT FOUND SET b = 1;
      OPEN cur1;
      SET b = 0;
      SET c = 0;
      WHILE b = 0 DO
          FETCH cur1 INTO a;
          IF b = 0 THEN
             SET c = c + a;
          END IF;
      END WHILE;
      CLOSE cur1;
      SET param1 = c;
    END //

اشاره گرها دارای سه ویژگی هستند که برای استفاده از آنها باید با این ویژگی ها آشنا باشید:

  * `Asensitive`: هنگامی که باز است، اشاره گر تغییرات را درون جدول مربوطه انعکاس نمی دهد. در واقع، `MySQL` از اشاره گری که بهروز رسانی می کند، ضمانت نمی کند.
  * `Read Only`: اشاره گر قابل به روز رسانی نمی باشد.
  * `Not Scrollable`: اشاره گر فقط می تواند در یک مسیر، به سمت جلو، حرکت کرده و نمی توانید از واکاوی رکودها گذر کنید.

و در پایان باید گفت که در این دو نوشته سعی شده بود تا به طور مختصر ولی جامع توضیحاتی را پیرامون `Stored Procedure` ها در `MySQL` بیان کنیم. البته برای کار با این امکان هنوز نیاز با اطلاعات بیشتری می باشد که بهتر است درباره آن جستجو کنید.بنده را از نظرات سازنده و اشکالات موجود محروم نفرمایید.
