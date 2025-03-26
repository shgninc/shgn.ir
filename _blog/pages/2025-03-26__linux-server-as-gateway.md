title: راه‌اندازی یک سرور لینوکس به عنوان Gateway
briefing: برای اینکه یک سرور لینوکس را به عنوان Gateway  راه‌اندازی کنید، باید آن را به یک روتر تبدیل کنید تا ترافیک شبکه را بین دو شبکه مختلف، مانند شبکه داخلی و اینترنت، هدایت کند.
date_time: 2025-03-26 13:43
slug: linux-server-as-gateway
tags: linux, tutorial, learn, debian, network
type: post

برای اینکه یک سرور لینوکس را به عنوان Gateway راه‌اندازی کنید، باید آن را به یک روتر تبدیل کنید تا 
ترافیک شبکه را بین دو شبکه مختلف، مانند شبکه داخلی و اینترنت، هدایت کند.


![linux-gateway](linux-gateway.webp "linux-gateway.webp")

##پیش‌نیازها
یک سرور لینوکس با دو کارت شبکه:

۱- کارت شبکه داخلی (مثلاً eth0 یا ens33) متصل به شبکه محلی (LAN).

۲- کارت شبکه خارجی (مثلاً eth1 یا ens34) متصل به اینترنت.

۳- دسترسی sudo یا root.

##فعال کردن قابلیت IP Forwarding

برای اینکه سرور بتواند بسته‌های شبکه را بین دو کارت شبکه انتقال دهد، باید IP Forwarding را فعال کنید:

برای فعال‌سازی دائمی، فایل تنظیمات را ویرایش کنید:

    sudo nano /etc/sysctl.conf
سپس خط زیر را پیدا کرده و فعال کنید (یا اضافه کنید):

    net.ipv4.ip_forward=1
و تغییرات را ذخیره و اعمال کنید:

    sudo sysctl -p

##راه‌اندازی NAT برای اشتراک اینترنت

برای اینکه شبکه داخلی بتواند از اینترنت استفاده کند، باید NAT را در iptables فعال کنیم.

دستور زیر را اجرا کنید تا NAT فعال شود:

    sudo iptables -t nat -A POSTROUTING -o eth1 -j MASQUERADE
اجازه دادن به فورواردینگ ترافیک بین کارت‌های شبکه:

    sudo iptables -A FORWARD -i eth0 -o eth1 -j ACCEPT
    sudo iptables -A FORWARD -i eth1 -o eth0 -m state --state RELATED,ESTABLISHED -j ACCEPT

##استفاده دیگر نودها
برای استفاده دیگر نودهای داخل شبکه از این دروازه فقط کافی است تا روت گیتوی آن سرور را برابر با آدرس ip سرور
اصلی قرار داد

    sudo ip route add default via 192.168.1.1 via eth0
و تمام.

برای تست می توان از دستور زیر استفاده کرد:

    ping shgn.ir