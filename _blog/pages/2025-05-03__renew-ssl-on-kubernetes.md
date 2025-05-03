title: تمدید گواهی ssl در kubernetes
briefing: در این نوشته مراحل تمدید دستی که برای گواهی های خریداری شده و بلند مدت هستند راتوضیح می دهیم.
date_time: 2025-05-03 15:21
slug: renew-ssl-on-kubernetes
tags: tips, kubernetes, ssl, k8s, tls
type: post

برای تمدید گواهی `SSL` دامنه در کوبرنتیز، ابتدا باید بدانیم که کوبرنتیز چگونه از گواهی‌های
`SSL` استفاده می‌کند. معمولاً این گواهی‌ها در قالب یک `Secret` از نوع `kubernetes.io/tls` ذخیره 
می‌شوند و در پادها `Pods`، اینگِرس‌ها `Ingresses` یا سرویس‌ها مورد استفاده قرار می‌گیرند تا 
ارتباطات امن `HTTPS` را برقرار کنند.

#گواهی SSL چیست؟
`SSL` یا `TLS` یک پروتکل رمزنگاری برای امن‌سازی ارتباط بین کلاینت (مثلاً مرورگر) و سرور است. 
گواهی‌نامه‌ی `SSL` نشان‌دهنده‌ی مالکیت دامنه و کلید عمومی برای رمزنگاری است.

#نقش کوبرنتیز در مدیریت SSL
کوبرنتیز خودش به‌صورت مستقیم گواهی صادر نمی‌کند. اما می‌تواند از ابزارهایی مانند 
`Cert-Manager` یا اسکریپت‌های خودکار برای مدیریت و تمدید گواهی‌ها استفاده کند.

زمانی که گواهی جدید صادر می‌شود (برای مثال توسط `Let's Encrypt`)، فایل‌های `.crt` و`.key` 
آن باید به‌عنوان یک `Secret` در کوبرنتیز آپدیت یا جایگزین شوند.

#تمدید دستی یا خودکار
*خودکار:* استفاده از ابزار `Cert-Manager` که با `Let's Encrypt` ادغام شده و به‌طور 
خودکار گواهی‌ها را تمدید می‌کند و `Secrets` را به‌روزرسانی می‌کند.

*دستی:* دریافت گواهی جدید، ساخت `Secret` جدید با دستور `kubectl create secret tls` و سپس 
بروزرسانی منابعی مثل `Ingress` انجام پذیر است.

ما در این نوشته مراحل تمدید دستی که برای `ssl` های خریداری شده و بلند مدت هستند را 
توضیح می دهیم.

برای تمدید گواهی، دو فایل `private.key` و `fullchain.cer` باید تأمین شده باشند. پیش فرض 
این است گواهی خریداری شده و فایل های `private`، `chain و `rootCA` در اختیار می باشد. پس
فایل `fullchain.cer` تولید و مراحل بعدی انجام می شود.

در ادامه می توان با استفاده از دستورات زیر، از صحت گواهی خریداری شده، اطمینان حاصل نمود:

    openssl rsa -noout -modulus -in example.com.key | openssl md5
برای کلید خصوصی و 

    openssl x509 -noout -modulus -in fullchain.cer | openssl md5
برای کلید عمومی استفاده می شود. اگر هش خروجی هر دو دستور یکسان باشد، گواهی `ssl` درست می باشد.

#تمدید گواهی ssl در کوبرنتیز

ابتدا لازم است تا کلید قبلی که تاریخ آن در حال اتمام است از سکرت های کوبرنتیز پاک شود:

    kubectl delete secret tls_secret -n your-namespace
سپس گواهی جدید به کوبرنتیز اعمال شود:

    k create secret tls domain.com-tls -n your-namespace --cert=fullchain.cer --key=domain.com.key --dry-run=client -o yaml | k apply -n your-namespace -f -

#منابع
 - [Updating the TLS certificates on Kubernetes](https://help.hcl-software.com/sametime/12.0/admin/tls_change_certificate_kubernetes.html)
 - [Verify a certificate chain using openssl verify](https://stackoverflow.com/questions/25482199/verify-a-certificate-chain-using-openssl-verify)