title: استفاده از PDO برای ارتباط با دیتابیس در PHP
briefing: بسیاری از برنامه نویسیان که کار با `PHP` را تازه شروع کرده اند، معمولا برای ارتباط با دیتابیس از اکستنشن های `MySQL` یا `MySQLi` استفاده کنند. شئ داده `PHP` معروف به `PDO` متدهایی را برای آماده سازی دستورات و کار با اشیایی که شما را به مراتب بیشتر درگیر می کنند، ارائه کرده است.
date_time: 2013-01-06 18:37
slug: using_PDO_in_PHP
tags: php, pdo, database
type: post

بسیاری از برنامه نویسیان که کار با `PHP` را تازه شروع کرده اند، معمولا برای ارتباط با دیتابیس از اکستنشن های `MySQL` یا `MySQLi` استفاده کنند. با آمدن نسخه `۵.۱ PHP` یک راه بهتر برای انجام این ارتباط، ارائه شد. شئ داده `PHP` معروف به [PDO][PDO] متدهایی را برای آماده سازی دستورات و کار با اشیایی که شما را به مراتب بیشتر درگیر می کنند، ارائه کرده است.

![php data object PDO][pdopng]

###معرفی PDO
PDO یک لایه ارتباطی با بانک اطاعاتی با یک روش یکسان برای دسترسی به پایگاه داده های متفاوت می باشد. برای هر دیتابیس مشخص یک کد خاص دارد، ولی پروسه تغییر و مهاجرت به دیتابیس یا پلتفرم دیگری، هزینه بسیار کمی دارد به طوری که این عمل را می توان فقط با تغییر [Connection_string][Connection_string]  مربوطه در هر نمونه از `PDO` انجام داد. این مقاله به معنای آموزش کامل `SQL` نیست. بلکه کمک به کاربرانی است برای مهاجرت آنها برای جایگزینی، با قدرت و قابلیت انتقال بیشتر، که اکنون از اکستنشن های [mysql][mysql] یا [mysqli][mysqli] استفاده می کنند، می باشد.

###دیتابیس هایی که PDO از آن پشتیبانی می کند
هر پایگاه داده ای که اکستنشن `PDO` درایور خاص آن را داشته باشد، از آن پشتیبانی می کند. تا سال ۲۰۱۲ `PDO` برای دیتابیس های زیر قابل استفاده بوده است:

    * PDO_DBLIB (FreeTDS / Microsoft SQL Server / Sybase)
    * PDO_FIREBIRD (Firebird/Interbase 6)
    * PDO_IBM (IBM DB2)
    * PDO_INFORMIX (IBM Informix Dynamic Server)
    * PDO_MYSQL (MySQL 3.x/4.x/5.x)
    * PDO_OCI (Oracle Call Interface)
    * PDO_ODBC (ODBC v3(IBM DB2, unixODBC and win32 ODBC))
    * PDO_PGSQL (PostgreSQL)
    * PDO_SQLITE (SQLite 3 and SQLite 2)
    * PDO_4D (4D)

لزوما تمامی درایورهای فوق الذکر روی سیستم شما نصب نیستند؛ برای اطلاع از لیست درایورهای نصب شده می توانید به صورت زیر عمل نمایید:

    print_r(PDO::getAvailableDrivers());

###برقراری ارتباط با پایگاه داده

دیتابیس های مختلف متدهای برقراری ارتباط متفاوت دارند. در زیر برخی از این متدها برای ارتباط با دیتابیس های محبوب قرار دارد. قابل ذکر است که سه تای اول یکسان هستند، و مابقی برای هر پایگاه داده، کد خاص به خود را دارند.

    try {
    # MS SQL Server and Sybase with PDO_DBLIB
    $DBH = new PDO("mssql:host=$host;dbname=$dbname, $user, $pass");
    $DBH = new PDO("sybase:host=$host;dbname=$dbname, $user, $pass");
    # MySQL with PDO_MYSQL
    $DBH = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    # SQLite Database
    $DBH = new PDO("sqlite:my/database/path/database.db");
    }
    catch(PDOException $e) {
    echo $e->getMessage();
    }

در مورد بلاک [try catch][try catch] دقت کنید، بهتر است که اعمال `PDO` را درون این بلاک قرار داده و از مکانیزم `exception` بهره گیرید. اساسا در اینجا فقط یک ارتباط ساده ایجاد نمودید. متغییر `$DBH` مخفف `'database handle'` بوده و از آن در این نوشته استفاده خواهد شد. با `null` قرار دادن مقدار `$DBH` (یا هر متغییری که کانکشن `PDO` را نگهداری می کند) می توانید آن ارتباط را قطع نمایید.

    # close the connection
    $DBH = null;

برای اطلاع یافتن از تنظیمات بیشتر یا `connection string` برای دیتابیس های مختلف به سایت [php.net][php.net] سری بزنید.

###استثناها و PDO

`PDO` برای مدیریت خطاهایش می تواند این امکان را به برنامه نویس می دهد که از استثناهای خودش در استفاده کند، برای انجام این امر لازم است کدهای برنامه `PDO`، درون یک بلاک `try/catch` قرار داده شوند. در `PDO` سه حالت خطا در نظر گرفته شده است که می توان یکی از آنها را به هنگام ایجاد ارتباط با دیتابیس یا همان ایجاد نمونه از شئ `PDO` در قسمت خصوصیات آن شئ، همان طور که در پایین هم قابل مشاهده می باشد، تعیین نمود:

    $DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT );
    $DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
    $DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

مهم نیست که شما چه حالتی از اخطار خطاها را بر می گزینید، یک خطا همیشه یک استثنا تولید می کند، به منظور جلوگیری از این گونه خطاها و نمایش آن برای کاربران، ایجاد برقراری ارتباط با پایگاه داده لازم است تا درون یک بلاک `try/catch` صورت پذیرد.

#####PDO::ERRMODE_SILENT
این حالت پیش فرض `PDO` است. اگر این حالت را انتخاب کنید، باید خطاها را به روشی که در آن از اکستنشن های `mysql` یا `mysqli` استفاده می کردید، خطایابی نمایید. دو حالت دیگر برای برنامه نویسی خواناتر، ایده آل هستند.

#####PDO::ERRMODE_WARNING
این حالت خطایابی همان حالت استاندارد هشداری مورد استفاده خود `PHP` را به کار می گیرد، و به برنامه اجازه ادامه روند خود را می دهد. این حالت برای اشکال زدایی کارایی دارد.

#####PDO::ERRMODE_EXCEPTION
و این حالتی است که بهتر است در بیشتر موقعیت ها از آن بهره گیرید. این حالت استثنا را تولید می کند، و به شما اجازه مدیریت هر چه مناسب تر خطاها را داده و از نمایش داده هایی که امکان استفاده از آنها برای نفوذ و خرابکاری در برنامه را می دهد، جلوگیری می کند. یک مثال برای آشنایی با این روش خطایابی:

    # connect to the database
    try {
    $DBH = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
    # UH-OH! Typed DELECT instead of SELECT!
    $DBH->prepare('DELECT name FROM people');
    }
    catch(PDOException $e) {
    echo "I'm sorry, Dave. I'm afraid I can't do that.";
    file_put_contents('PDOErrors.txt', $e->getMessage(), FILE_APPEND);
    }

در اینجا شما یک خطای عمدی را در دستور select مشاهده می کنید. استثنا تولید شده جزئیات مربوط به خطا را به یک فایل لاگ می فرستد، و یک پیام دوستانه به کاربر نمایش می دهد.

###دستورات insert و update

درج داده های جدید، یا ویرایش اطلاعات موجود یکی از رایج ترین اعمال هر پایگاه داده ای می باشد. در استفاده از `PDO`، این دو دستور یک پروسه دو مرحله ای دارد. هر مطلبی که در این بخش بیان می شود برای اعمال [INSERT][INSERT] و [UPDATE][UPDATE] یکسان است. یک مثال از یک `insert` ساده در دیتابیس:

    # STH means "Statement Handle"
    $STH = $DBH->prepare("INSERT INTO folks ( first_name ) values ( 'Cathy' )");
    $STH->execute();

همچنین می توان با متد `exec()`، با یک فراخوانی کمتر، این عمل را  نیز انجام داد. در بیشتر حالات، با در نظر گرفتن مزیت استفاده از دستور `prepared` بهتر است تا از آن استفاده شود. حتی اگر بخواهید از آن یک مرتبه استفاده کنید، زیرا دستور `prepared` شما را در مقابل حملات `SQL Injection` کمک می کند.

###دستورات Prepared
یک دستور `prepared` شده یک دستور پیش اجرا شده `SQL` است که می تواند برای چندین مرتبه فقط با ارسال داده ها متفاوت به سرور، مکررا اجرا شود. مزیتی که این روش در بر دارد این است که داده های استفاده شده را در جایی امن در مقابل حملات `SQL Injection` نگهداری می کند. یک دستور `Prepared` شده `SQL` را با استفاده از پارامترها می توانید استفاده کنید. در اینجا سه مثال قرار داده شده است: یکی بدون استفاده از پارامترها، یکی با استفاده از پارامترهای بی نام، و یکی با استفاده از پارامترهای نامدار.

    # no placeholders - ripe for SQL Injection!
    $STH = $DBH->("INSERT INTO folks (name, addr, city) values ($name, $addr, $city)");
    # unnamed placeholders
    $STH = $DBH->("INSERT INTO folks (name, addr, city) values (?, ?, ?);
    # named placeholders
    $STH = $DBH->("INSERT INTO folks (name, addr, city) value (:name, :addr, :city)");

این کدها فقط برای مقایسه با هم آورده شده اند. انتخاب استفاده از پارامترهای با نام و بی نام بستگی به نحوه مقدار دهی شما برای دستورات مربوطه دارد.

###پارامترهای بی نام

    # assign variables to each place holder, indexed 1-3
    $STH->bindParam(1, $name);
    $STH->bindParam(2, $addr);
    $STH->bindParam(3, $city);
    # insert one row
    $name = "Daniel"
    $addr = "1 Wicked Way";
    $city = "Arlington Heights";
    $STH->execute();
    # insert another row with different values
    $name = "Steve"
    $addr = "5 Circle Drive";
    $city = "Schaumburg";
    $STH->execute();

در اینجا دو مرحله داریم. اول، وصل نمودن پارامترها به متغییر ها. بعد مقادیر را به آن متغییرها تخصیص داده و سپس دستورات را اجرا می نماییم. برای یک مجموعه اعمال جدید روی داده ها، فقط کافی است مقادیر آن متغییرها را تغییر داده و مجدد دستور را اجرا کنیم. `($STH->execute();)` البته یک راه ساده تر هم وجود دارد و آن هم قرار دادن مقادیر درون یک آرایه است:

    # the data we want to insert
    $data = array('Cathy', '9 Dark and Twisty Road', 'Cardiff');
    $STH = $DBH->("INSERT INTO folks (name, addr, city) values (?, ?, ?);
    $STH->execute($data);

به همین سادگی!<br /> داده های درون آرایه به ترتیب به پارامترها اختصاص داده می شوند. `$data[0]` برای اولین پارامتر، `$data[1]` برای دومین پارامتر و الی آخر. اما اگر آرایه مورد نظر ایندکس های مرتبی نداشته باشد، این روش به درستی عمل نمی کند.

###متغییرهای نامدار
یک مثال برای این روش:

    # the first argument is the named placeholder name - notice named
    # placeholders always start with a colon.
    $STH->bindParam(':name', $name);

برای راحتی بیشتر می توان ازآرایه ها با ایندکس های مشخص استفاده کرد. برای مثال:

    # the data we want to insert
    $data = array( 'name' => 'Cathy', 'addr' => '9 Dark and Twisty', 'city' => 'Cardiff' );
    # the shortcut!
    $STH = $DBH->("INSERT INTO folks (name, addr, city) value (:name, :addr, :city)");
    $STH->execute($data);

کلیدهای آرایه برای شروع نیاز به یکسان سازی نداشته، اما لازم است که با نام پارامترها یکسان باشد. اگر هم آرایه ای از آرایه ها داشته باشید می توانید به راحتی هر کدام را به طور جداگانه تکرار و به ازای هر کدام آنها دستور را اجرا نمایید.<br /> دیگر ویژگی عالی این روش، با فرض اینکه متغییرها با نام فیلدهای همخوانی دارند، امکان درج اشیاء مستقیما درون پایگاه داده شما نیز وجود دارد. یک مثال برای این موضوع:

    # a simple object
    class person {
    public $name;
    public $addr;
    public $city;
    function __construct($n,$a,$c) {
    $this->name = $n;
    $this->addr = $a;
    $this->city = $c;
    }
    # etc ...
    }
    $cathy = new person('Cathy','9 Dark and Twisty','Cardiff');
    # here's the fun part:
    $STH = $DBH->("INSERT INTO folks (name, addr, city) value (:name, :addr, :city)");
    $STH->execute((array)$cathy);

بوسیله تبدیل یک شئ به آرایه در زمان اجرا، پراپرتیهای شئ به عنوان کلیدهای آرایه در نظر گرفته می شوند.

###انتخاب و واکاوی اطلاعات
اطلاعات بوسیله `()fetch&lt;-`، که یک متد از شئ `PDO` ایجاد شده است، واکاوی می شوند. قبل از فراخوانی این متد، بهتره که نحوه واکاوی اطلاعات توسط این متد را مشخص نمایید. برای این امر گزینه های زیر وجود دارند:
####fetch PDO::FETCH_ASSOC:
یک آرایه که شاخص هایش نامگذاری شده اند با نام فیلدهای واکاوی شده.
####PDO::FETCH_BOTH:
 یک آرایه که شاخص هایش نامگذاری شده اند با نام فیلدهای واکاوی شده و هم با عدد شاخص گذاری شده است. (پیش فرض)
####PDO::FETCH_BOUND:
مقادیر واکاوی شده فیلدها را به متغییرهایی که با متد `()bindColumn&lt;-` مشخص شده اند، تخصیص می دهد.

    ()bindColumnsetFetchMode(PDO::FETCH_ASSOC);

همچنین می توان حالت مورد نظر را مستقیما از طریق خود متد `fetch` تعیین نمود.

####FETCH_ASSOC
این حالت از واکاوی یک آرایه با شخاص های هم نام با فیلدها تولید می کند. مثالی از نحوه استفاده از این حالت:

    # using the shortcut ->query() method here since there are no variable
    # values in the select statement.
    $STH = $DBH->query('SELECT name, addr, city from folks');
    # setting the fetch mode
    $STH->setFetchMode(PDO::FETCH_ASSOC);
    while($row = $STH->fetch()) {
    echo $row['name'] . "\n";
    echo $row['addr'] . "\n";
    echo $row['city'] . "\n";
    }

این حلقه تا زمانی که یکی یکی رکوردها خوانده شوند اجرا می شود.

####FETCH_OBJ
این حالت واکاوی، به ازای هر رکورد یک شئ از نوع std از داده ها تولید می کند. مثال:

    # creating the statement
    $STH = $DBH->query('SELECT name, addr, city from folks');
    # setting the fetch mode
    $STH->setFetchMode(PDO::FETCH_OBJ);
    # showing the results
    while($row = $STH->fetch()) {
    echo $row->name . "\n";
    echo $row->addr . "\n";
    echo $row->city . "\n";
    }

####FETCH_CLASS

این حالت واکاوی، داده های بدست آمده را مستقیما درون یک کلاس انتخاب شده می ریزد. زمانی که از این حالت بهره می گیرید، پراپرتی های کلاس قبل از این که متد [constructor][constructor] فراخوانی شود، مقدار می گیرند. اگر پراپرتی ای برای مقادیر در کلاس نباشد، آن پراپرتی خاص برای آن مقدار به طور خودکار ایجاد می شود. این به این معنی است که اگر اطلاعات واکاوی شده نیاز به هرگونه تغییری داشته باشند، می توان به طور خودکار آن تغییرات را بر روی آن شئ تولید شده انجام داد. برای مثال، فرض کنید می خواهید فیلد آدرس را برای هر رکورد مخفی نمایید. پس این کار را بر روی پراپرتی مربوطه در شئ تولید شده انجام می دهید:

    class secret_person {
    public $name;
    public $addr;
    public $city;
    public $other_data;
    function __construct($other = '') {
    $this->address = preg_replace('/[a-z]/', 'x', $this->address);
    $this->other_data = $other;
    }
    }</pre>

به محض اینکه اطلاعات درون کلاس واکاوی می شوند، حروف کوچک درون فیلد آدرس با حرف x جابجا می شوند. حالا در یک مثال استفاده از این کلاس را مشاهده نمایید:

    $STH = $DBH->query('SELECT name, addr, city from folks');
    $STH->setFetchMode(PDO::FETCH_CLASS, 'secret_person');
    while($obj = $STH->fetch()) {
    echo $obj->addr;
    }

اگر مقدار فیلد آدرس برابر با '5 Rosebud' باشد، شما مقدار ’5 Rxxxxxx’ را در خروجی مشاهده می نمایید. اگر بخواهید قبل از تخصیص اطلاعات به پراپرتی ها، اول متد constructor کلاس اجرا شود، باید به ترتیب زیر عمل نمایید:

    $STH->setFetchMode(PDO::FETCH_CLASS | PDO::FETCH_PROPS_LATE, 'secret_person');

اکنون اگر دستور قبلی را با این حالت `(PDO::FETCH_PROPS_LATE)` اجرا نمایید، فیلد آدرس دیگر تا زمانی که متد `constructor` فراخوانی و مقدار دهی نشود، مخفی نمی ماند.

#### برخی متدهای مفید PDO
از آنجایی که همه چیز در `PDO` تابه اینجا بیان نشده، نیاز به متدهایی برای انجام یک سری از کارهای ابتدایی است، اما کاربردی برای واکاوی و کار با پایگاه داده می باشد.

    $DBH->lastInsertId();

این متد همیشه با شئ دیتابیس `PDO` قابل فراخوانی است نه با شئ دستورات `PDO` و آخرین id ای که به صورت افزایشی خودکار بوده، که در جدول `insert` شده را بر می گرداند.

    $DBH->exec('DELETE FROM folks WHERE 1');
    $DBH->exec("SET time_zone = '-8:00'");

متد `()exec` برای دستورات `SQL` ای که مقداری را باز نمی گردانند قابل استفاده است. در بالا ۲ مثال از نحوه استفاده از این متد را مشاهده می نمایید.

    $safe = $DBH->quote($unsafe);

متد `()quote` رشته هایی را که در کوئری ها واکاوی می شوند را برای افزایش امنیت درون علامت کوتیشن قرار می دهد. در صورتی که از دستورات `prepared` شده استفاده نمی کنید، این متد در افزایش امنیت مؤثر است.

    $rows_affected = $STH->rowCount();

متد `()rowCount` تعداد رکوردهایی که توسط یک عملیات متأثر شده را باز می گرداند. این متد با دستور `select` کار نمی کند. در پایان باید گفت که با توجه به مزیت های قابل حمل بود و از همه مهمتر امکان جابجایی راحت بین پایگاه داده های مختلف و البته آن هم به صورت شئ گرایی، دلایل خوبی برای مهاجرت از روش های قدیمی کار با بانک های اطلاعاتی به این روش می باشند. امیدوارم که این مطلب مفید واقع شده باشد. اشکالات و نقایص را لطفا کامنت کنید.

منبع: [net.tutsplus][net.tutsplus]

باتشکر ، یا علی.

[net.tutsplus]: http://net.tutsplus.com/tutorials/php/why-you-should-be-using-phps-pdo-for-database-access/  "سایت آموزشی طراحی وب"
[PDO]: http://php.net/manual/en/book.pdo.php  "مرجع سایت php برای PDO"
[pdopng]: pdo.png  "مرجع سایت php برای PDO"
[Connection_string]: http://en.wikipedia.org/wiki/Connection_string  "Connection_string"
[mysql]: http://en.wikipedia.org/wiki/Mysql  "Mysql"
[mysqli]: http://php.net/manual/en/class.mysqli.php  "mysqli"
[try catch]: http://www.w3schools.com/php/php_exception.asp  "php_exception"
[php.net]: http://php.net/manual/en/refs.database.php  "انواع پایگاه داده هایی که PHP پشتیبانی می کند"
[INSERT]: http://en.wikipedia.org/wiki/INSERT  "INSERT"
[UPDATE]: http://en.wikipedia.org/wiki/UPDATE  "UPDATE"
[constructor]: http://en.wikipedia.org/wiki/Constructor_%28object-oriented_programming%29#PHP  "سازنده ها در شئ گرایی"
