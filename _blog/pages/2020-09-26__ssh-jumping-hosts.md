title: پرش با SSH
briefing: یک راهکار جایگزین برای ssh tunneling.
date_time: 2020-09-26 17:21
slug: ssh-jumping-hosts
tags: ssh, linux
type: post

برای مدیریت و دسترسی از راه دور به سرورهای لینوکسی، یک راهکار قدرتمند و بسیار ساده به نام `ssh` وجود دارد. این مطلب با فرض آشنایی شما با `ssh` و `ssh tunneling` نوشته شده است.

ابتدا باید این توضیح داده شود که، به دلیل ایجاد امنیت هر چه بیشتر برای سرورها در یک شبکه، معمولا آن ها را در شبکه پشت یک `gateway` قرار می دهند تا دسترسی از بیرون(اینترنت) و مستقیم برای هر کسی ممکن نباشد. اما برای مدیریت و کنترل آن سرورها، معمولا راهی را از طریق گیتوی یاد شده ایجاد می کنند. کاربران برای ارتباط با آن سرورها می توانند با `ssh` زدن به گیتوی و سپس از آنجا `ssh` به سرور هدف، به آن وصل شوند. به نوعی این کار، جایگزین `ssh tunneling` هم می تواند باشد.  

ایده اصلی این راه، استفاده از `ProxyCommand` برای اجرا خودکار دستور `ssh` روی سرور هدف با استفاده از هاست واسط و انتقال کل ترافیک آن از این طریق می باشد.

![Image  SSH jump host](/2020-09-26/SSH-Jump-Host.png) 

# پیشنیاز ها

 * دسترسی `ssh` به هاست گیتوی و شبکه داخلی آن
 * نصب بودن بسته `Netcat` روی هاست گیتوی

# پرش داینامیک ssh 

برای پرش از طریق هاست گیتوی باید از گزینه `-J` به ترتیب زیر استفاده نمود:

    user $ssh -J host1 host2

اگر نام کاربری یا شماره پورت روی ماشین هدف تفاوت دارد می توانید به این ترتیب آن ها را تعیین کنید:

    user $ssh -J user1@host1:port1 user2@host2:port2

### چندین پرش

با دستوری شبیه به دستورات قبلی، نیز می توان برای پرش از چندین هاست تا سرور هدف استفاده نمود:

    user $ssh -J user1@host1:port1,user2@host2:port2 user3@host3


 # پرش استاتیک ssh
 
  در این روش شما تنظیمات را درون فایل تنظیمات `ssh` انجام می دهید. برای این مهم لازم هست تا اطلاعات مربوط به هاست یا هاست های واسط تا سرور هدف را داشته باشید. سپس می توانید مسیریابی استاتیک برای پرش را در فایل تنظیمات `ssh` انجام دهید. تفاوت این روش با روش داینامیک در این است که، نیازی به ایجاد فایل تنظیمات `.ssh` روی هاست های واسط و سرور هدف نیست.  
 
 ### نحوه تنظیم 
 
 در فایل به مسیر `~/.ssh/config` تنظیمات زیر را اعمال می کنید:

    ### First jumphost. Directly reachable
    Host betajump
        HostName jumphost1.example.org
 
    ### Host to jump to via jumphost1.example.org
    Host behindbeta
        HostName behindbeta.example.org
        ProxyJump  betajump
        
 ### نحوه استفاده 
 
 نحوه استفاده به سادگی زیر می باشد:
 
    user $ssh behindalpha
 
 اگر نام کاربری روی هاست ها متفاوت بود، کافی هست تا آن را در خط مربوط به `ProxyJump` در فایل `~/.ssh/config` تعیین نمایید:
 
     ProxyJump  otheruser@behindalpha
     
 ### چندین پرش 
 
 برای استفاده از چندین هاست واسط و پرش ازآنها شبیه به تنظیمات قبل، می توان در مسیر فایل `~/.ssh/config` تنظیم نمود:
 
    ### First jumphost. Directly reachable
    Host alphajump
        HostName jumphost1.example.org
    
    ### Second jumphost. Only reachable via jumphost1.example.org
    Host betajump
      HostName jumphost2.example.org
      ProxyJump alphajump
 
    ### Host only reachable via alphajump and betajump
    Host behindalphabeta
      HostName behindalphabeta.example.org
      ProxyJump betajump

همچنین برای استفاده نیز همانند قبل دستور زیر کافی می باشد:

    user $ssh behindalphabeta
    
#منابع:

 * [ SSH jump host ](https://wiki.gentoo.org/wiki/SSH_jump_host)
 * [Following up on SSH through jump hosts](https://glandium.org/blog/?p=308)
 * [How to Access a Remote Server Using a Jump Host](https://www.tecmint.com/access-linux-server-using-a-jump-host/)