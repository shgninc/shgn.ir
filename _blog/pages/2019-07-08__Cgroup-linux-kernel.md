title: آشنایی با ویژگی Cgroup در کرنل لینوکس
briefing: یک قابلیت هستهٔ لینوکس است که منابع مجموعه‌ای از فرایندها را مدیریت و مجزاسازی می‌کند.
date_time: 2019-07-08 15:14
slug: Cgroup-linux-kernel
tags: kenel, linux, virtualization
type: post

قابلیت `Cgroup` (مخفف Control Group)،‌ یک ویژگی کرنل لینوکس می باشد که امکان جدا و محدود سازی منابع سیستم (CPU, memory, disk I/O, network و...) برای مجموعه ای از پردازش ها را می دهد. 
این قابلیت در  سال ۲۰۰۶ توسط دو نفر از مهندسان گوگل به نام های primarily Paul Menage و Rohit Seth این قابلیت ایجاد و آن‌ را در سال ۲۰۰۷ `control groups` نامیدند. این قابلیت از نسخه ۲.۶.۲۴ در سال ۲۰۰۸ به کرنل اضافه شده است. 

قابلیت CGroup ویژگی های زیر را فراهم می کند:

 * محدودسازی منابع: می توان استفاده از میزان رم، یا تعداد CPU-Core، یا هر سخت افزاری دیگری را محدود و مشخص نمود.
 * اولویت بندی: گروه یا چندین گروه پردازش امکان تنظیم برای استفاده از میزان کمتر یا بیشتر ورودی/خروجی یا CPU را می دهد.
 * کنترل استفاده: اجازه کنترل و اندازهگیری میزان استفاده از منابع را فراهم می کند.
 * کنترل: می توان گروهی از پردازش ها را ثابت یا متوقف و یا راه اندازی مجدد نمود.

 به مجموعه ای از پردازش ها که با شرایط همسان با هم مرتبط می شوند را یک گروه کنترل یا `cgroup` می نامند. این گروه ها می توانند به صورت سلسله مراتبی شرایط و محدودیت ها را اعمال کنند. 
 
 گروهایی کنترل به روش های زیر قابل استفاده هستند:
 
 * بوسیله دسترسی `cgroup` به سیستم مدیریت فایل به صورت مجازی.
 * بوسیله ایجاد و مدییت گروهها توسط ابزاهایی همانند `cgcreate`،‌`cgexec` و `cgclassify` (از طریق کتابخانه `libcgroup`)
 * بوسیله سرویس موتور قوانین که به طور خودکارپردازش های کاربران، گروه ها یا دستورات را به `cgroups` پیرو تنظیمات انجام شده منتقل می کند. 
 * به طور مستقیم، بوسیله دیگر برنامه هایی که از `cgroups` استفاده می کنند، همانند `Docker`، `Firejail`، `libvirt`، `systemd`، `Open Grid Scheduler/Grid Engine` و برنامه درحال توسعه گوگل `lmctfy`. 

![linux container](lxc_architecture.png)


###جداسازی فضای نام

زمانی که بخشی از cgroups به صورت تکنیکی کار نمی کرد، یک ویژگی مرتبط با کرنل لینوکس `جداساز فضای نام (namespace isolation)` هست، جایی که گروهی از پردازش ها طوری از جدا می شوند که امکان استفاده و مشاهده منابع دیگر گروه ها را ندارند. برای مثال یک فضای نام `PID` یک تعداد شناسه پردازش مجزا برای هر فضای نام تأمین می کند. همچنین فضای نام برای `mount`، کاربران، `UTS`، شبکه و `SysV IPC` قابل ایجاد می باشد.   

 * فضای نام `PID` شناسه پردازش های مجزا، لیستی از پردازش ها و جزئیات آنها را مجزا می کند. مادامی که یک فضای نام جدید از دیگر پردازش های والدش جداسازی شده است، امکان مشاهده تمامی پردازش های موجود در فضای نام فرزندانش حتی با `PID` متفاوت باشند را دارد.   
 * فضای نام شبکه، کنترلر کارت شبکه را (مجازی یا فیزیکی)، قوانینفایروال `iptables`، جدول `routing` و غیره را جداسازی می کند. امکان دستیابی به فضای نام شبکه به دیگران با استفاده از کارت شبکه مجازی `veth` می باشد.
 *   فضای نام `UTS` امکان تغییر 'hostname' را می دهد.
 * فضای نام `Mount` امکان ایجاد یک لایه سیستم فایل متفاوت یا بارگزاری نقطه بارگزادری فقط خواندنی ا می دهد. 
 * فضای نام `IPC` پردازش ورودی یا ابتدایی سیستم `System V` را برای 
 * فضای نام کاربری شناسه های کاربری بین فضاهای نام را جداسازی می کند.
 * فضای نام `Cgroup`

فضای نام با دستور `unshare` یا `syscall` یا با یک علامت جدید در یک `syscall‍` کپی گرفته شده، ایجاد می شود.

###محصولات این ویژگی

پروژه های مختلفی از جمله پروژه های زیر، از ویژگی `cgroup` به عنوان مبنای خود استفاده می کنند:

 * [CoreOS](https://en.wikipedia.org/wiki/CoreOS)
 * [Docker (in 2013)](https://en.wikipedia.org/wiki/Docker_(software))
 * [Hadoop](https://en.wikipedia.org/wiki/Apache_Hadoop)
 * [Jelastic](https://en.wikipedia.org/wiki/Jelastic)
 * [Kubernetes](https://en.wikipedia.org/wiki/Kubernetes)
 * [lmctfy (Let Me Contain That For You)](https://en.wikipedia.org/wiki/Lmctfy)
 * [LXC (LinuX Containers)](https://en.wikipedia.org/wiki/LXC)
 * systemd
 * [Mesos](https://en.wikipedia.org/wiki/Apache_Mesos) and Mesosphere
 * [HTCondor](https://en.wikipedia.org/wiki/HTCondor)
 
در پایان، سعی شد تا در این نوشته آشنایی مختصری پیرامون ویژگی کاربردیی که در کرنل لینوکس ایجاد شده و باعث رخدادن انقلابی در حوزه مجازی سازی و `DevOps` بوده است، ارائه گردد. امیدوارم که مفید بوده باشد.

#####منابع
 * [wikipedia](https://en.wikipedia.org/wiki/Cgroups)
 * [Everything You Need to Know about Linux Containers, Part I: Linux Control Groups and Process Isolation](https://www.linuxjournal.com/content/everything-you-need-know-about-linux-containers-part-i-linux-control-groups-and-process)