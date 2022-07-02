title: آپدیت گیت لب از 13.11.3 به آخرین نسخه
briefing: نسخه فعلی که استفاده می شود، gitlab-ce 13.11.3 می باشد. آخرین نسخه ارائه شده گیت gitlab-ce 15.0.2 هست، که ما قصد داریم به این نسخه مهاجرت کنیم.
date_time: 2022-07-02 11:54
slug: upgrade-gitlab-to-latest
tags: linux, git, gitlab, upgrade, docker 
type: post

#مقدمه
ما برای نگهداری کد برنامه های از برنامه گیت به صورت `docker` ای استفاده می کنیم. حدود ۵۰۰ پروژه، ۱۰۰ کاربر روی آن هست.

نسخه فعلی که استفاده می شود، `gitlab-ce 13.11.3` می باشد. آخرین نسخه ارائه شده گیت `gitlab-ce 15.0.2` هست، که ما قصد داریم به این نسخه مهاجرت کنیم.

برای انجام این مهاجرت چندین مرحله است که باید نسخه به نسخه گیت لب را ارتقاع داد تا در نهایت بتوان به آخرین نسخه رسید.

قبل از شروع یک نکته خیلی مهم وجود دارد که نمی تونیم از آن چشم پوشی کنیم، مدل ذخیره سازی کد ها و ضمیمه ها در گیت لب به دو صورت انجام می گیرد: 
۱- `hashed`، 
- ۲- `lagecy`
- که مدل lagecy از نسخه ۱۴ به بعد گیت لب پشتیبانی نمی شود، پس باید حتما قبل شروع تمامی ذخیره سازی ها را به مدل hashed تبدیل کرد.

#پیش فرض ها
همانطورکه پیش تر بیان شد، گیت لب را با داکر راه اندزی کرده ایم، پس `docker-compose.yml` آن به این صورت می باشد:

    version: "3"
    services:
        gitlab:
            container_name: gitlab
            image: gitlab/gitlab-ce:13.11.3-ce.0
            hostname: 'code1.domain.com'
            ports:
               - 80:80
               - 22:22
            environment:
               GITLAB_ROOT_PASSWORD: "password"
               GITLAB_OMNIBUS_CONFIG: |
                 external_url "http://code1.domain.com" 
            volumes:
                - ./config:/etc/gitlab
                - ./logs:/var/log/gitlab
                - ./data:/var/opt/gitlab

#تبدیل ذخیره سازی
گقتیم قبل شروع ابتدا باید مدل ذخیره سازی را تبدیل کنیم تا بتوانیم نسخه را ارتقاع دهیم. برای این مهم باید دستورات زیر را اجرا کنیم.

قبل از شروع به تبدیل حتما از اطلاعات تون بکاپ بگیرید.

پروژه هایی که روی مدل ذخیره سازی قدیم هستند را نشان می دهد:

    docker exec -it gitlab gitlab-rake gitlab:storage:list_legacy_projects

ضمایمی که روی مدل ذخیره سازی قدیم هستند را نشان می دهد:

    docker exec -it gitlab gitlab-rake gitlab:storage:list_legacy_attachments

در نهایت با اجرای دستور زیر می توان تبدیل را انجام داد:

    docker exec -it gitlab gitlab-rake gitlab:storage:migrate_to_hashed

نکته مهمی که باید به آن دقت شود این است که با توج به تعداد پروژه ها و ضمایمی که روی مدل ذخیره سازی قدیم هستند، این دستور طول می کشد. برای مشاهده اجرا دستور از داخل پنل گیت لب از مسیر `Admin Area>Monitoring` و قسمت `Backgroud Jobs` از بخش صف کارها `hashed_storage:hashed_storage_project_migrate` را مشاهده کنید.

در انتها بعد از اتمام تبدیل می توانید ارتقاع را شروع کنید.

#مراحل ارتقاع
ارتقاع گیت لب از نسخه های قدیم به جدیدتر مرحله به مرحله باید انجام شود و در هر مرحله باید حتما یک بکاپ از اطلاعات گرفته شده، و از صحت ارتقاع به نسخه جدید اطمینان حاصل نمود.

در مستندات خود گینت لب مراحل ارتقاع را نسخه به نسخه به ترتیب زیر بیان کرده است:

    8.11.Z -> 8.12.0 -> 8.17.7 -> 9.5.10 -> 10.8.7 -> 11.11.8 -> 12.0.12 -> 12.1.17 -> 12.10.14 -> 13.0.14 -> 13.1.11 -> 13.8.8 -> 13.12.15 -> 14.0.12 -> 14.3.6 -> 14.9.5 -> 14.10.Z -> 15.0.Z -> latest 15.Y.Z

مجددا تأکید می کنم که قبل از انجام هر مرحله آپدیت، از اطلاعات باید بکاپ گرفته شود.

#بکاپ گیری

برای بکاپ گیری از گیت دستور زیر را اجرا کنید:

    docker exec gitlab gitlab-backup create GZIP_RSYNCABLE=yes STRATEGY=copy

###ارتقاع از ۱۳.۱۱.۳ به ۱۳.۱۲.۱۵
برای ارتقاع، داخل فایل `docker-compose.yml` بخش ایمیج را به `gitlab/gitlab-ce:13.12.15-ce.0` تغییر داده و دستور زیر را اجرا می کنیم:

    docker-compose -f /path/to/docker-compose/file up -d

بعد از اجرای دستور فوق حدود ۵ دقیقه باید صبر کنیم، بعد دستور زیر را برای اطمینان از صحت ارتقاع اجرا می کنیم:

    docker-compose -f /path/to/docker-compose/file ps

اگر قسمت status برابر به healthy بود که ارتقاع به درستی انجام شوده و برای مشاهده شماره نسخه جدید از داخل پنل گیت لب قسمت admin area اقدام کنید.

در نهایت برای اطمینان بیشتر، یکبار دستور زیر را اجرا میکنیم:

    docker-compose -f /path/to/docker-compose/file down
    docker-compose -f /path/to/docker-compose/file up -d

###ارتقاع از ۱۳.۱۲.۱۵ به ۱۴.۰.۱۲

برای ارتقاع، داخل فایل `docker-compose.yml` بخش ایمیج را به gitlab/gitlab-ce:14.0.12-ce.0 تغییر داده و دستور زیر را اجرا می کنیم:

    docker-compose -f /path/to/docker-compose/file up -d

بعد از اجرای دستور فوق حدود ۵ دقیقه باید صبر کنیم، بعد دستور زیر را برای اطمینان از صحت ارتقاع اجرا می کنیم:

    docker-compose -f /path/to/docker-compose/file ps

اگر قسمت status برابر به healthy بود که ارتقاع به درستی انجام شوده و برای مشاهده شماره نسخه جدید از داخل پنل گیت لب قسمت admin area اقدام کنید.

    docker-compose -f /path/to/docker-compose/file down
    docker-compose -f /path/to/docker-compose/file up -d

###ارتقاع از ۱۴.۰.۱۲ به ۱۴.۳.۶

برای ارتقاع، داخل فایل `docker-compose.yml` بخش ایمیج را به gitlab/gitlab-ce:14.3.6-ce.0 تغییر داده و دستور زیر را اجرا می کنیم:

    docker-compose -f /path/to/docker-compose/file up -d

بعد از اجرای دستور فوق حدود ۵ دقیقه باید صبر کنیم، بعد دستور زیر را برای اطمینان از صحت ارتقاع اجرا می کنیم:

    docker-compose -f /path/to/docker-compose/file ps

اگر قسمت status برابر به healthy بود که ارتقاع به درستی انجام شوده و برای مشاهده شماره نسخه جدید از داخل پنل گیت لب قسمت admin area اقدام کنید.

    docker-compose -f /path/to/docker-compose/file down
    docker-compose -f /path/to/docker-compose/file up -d

###ارتقاع از ۱۴.۳.۶ به ۱۴.۹.۵

برای ارتقاع، داخل فایل `docker-compose.yml` بخش ایمیج را به gitlab/gitlab-ce:14.9.5-ce.0 تغییر داده و دستور زیر را اجرا می کنیم:

    docker-compose -f /path/to/docker-compose/file up -d

بعد از اجرای دستور فوق حدود ۵ دقیقه باید صبر کنیم، بعد دستور زیر را برای اطمینان از صحت ارتقاع اجرا می کنیم:

    docker-compose -f /path/to/docker-compose/file ps

اگر قسمت status برابر به healthy بود که ارتقاع به درستی انجام شوده و برای مشاهده شماره نسخه جدید از داخل پنل گیت لب قسمت admin area اقدام کنید.

    docker-compose -f /path/to/docker-compose/file down
    docker-compose -f /path/to/docker-compose/file up -d

###ارتقاع از ۱۴.۹.۵ به ۱۴.۱۰.۴

برای ارتقاع، داخل فایل `docker-compose.yml` بخش ایمیج را به gitlab/gitlab-ce:14.10.4-ce.0 تغییر داده و دستور زیر را اجرا می کنیم:

    docker-compose -f /path/to/docker-compose/file up -d

بعد از اجرای دستور فوق حدود ۵ دقیقه باید صبر کنیم، بعد دستور زیر را برای اطمینان از صحت ارتقاع اجرا می کنیم:

    docker-compose -f /path/to/docker-compose/file ps

اگر قسمت status برابر به healthy بود که ارتقاع به درستی انجام شوده و برای مشاهده شماره نسخه جدید از داخل پنل گیت لب قسمت admin area اقدام کنید.

    docker-compose -f /path/to/docker-compose/file down
    docker-compose -f /path/to/docker-compose/file up -d

###ارتقاع از ۱۴.۱۰.۴ به ۱۵.۰.۲

برای ارتقاع، داخل فایل `docker-compose.yml` بخش ایمیج را به gitlab/gitlab-ce:15.0.2-ce.0 تغییر داده و دستور زیر را اجرا می کنیم:

    docker-compose -f /path/to/docker-compose/file up -d

بعد از اجرای دستور فوق حدود ۵ دقیقه باید صبر کنیم، بعد دستور زیر را برای اطمینان از صحت ارتقاع اجرا می کنیم:

    docker-compose -f /path/to/docker-compose/file ps

اگر قسمت status برابر به healthy بود که ارتقاع به درستی انجام شوده و برای مشاهده شماره نسخه جدید از داخل پنل گیت لب قسمت admin area اقدام کنید.

    docker-compose -f /path/to/docker-compose/file down
    docker-compose -f /path/to/docker-compose/file up -d

در تاریخی که این مطلب را ارائه کردیم آخرین نسخه ارائه شده روی
[hub.docker.com](https://hub.docker.com)
برای گیت لب نسخه ۱۵.۰.۲ هست

#منابع

 * [Restore for Docker image and GitLab Helm chart installations](https://docs.gitlab.com/ee/raketasks/backup_restore.html#restore-for-docker-image-and-gitlab-helm-chart-installations)
 * [Migrate to hashed storage](https://docs.gitlab.com/ee/administration/raketasks/storage.html#migrate-to-hashed-storage)
 * [Repository storage types](https://docs.gitlab.com/ee/administration/repository_storage_types.html)
 * [Upgrading to a new major version](https://docs.gitlab.com/ee/update/index.html#upgrading-to-a-new-major-version)