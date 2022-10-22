title: کاهش فضای دیسک LVM
briefing: در این نوشته تلاش می شود تا نحوه کاهش فضای دیسک `LVM` بیان شود..
date_time: 2022-10-22 12:47
slug: reduce-LVM-Partition-size
tags: lvm, linux, partition, disk
type: post

در این نوشته تلاش می شود تا نحوه کاهش فضای دیسک `LVM` بیان شود.

بعضی وقت ها ممکن که با مشکل پر شدن فضای پارتیشن روی دیسک `LVM` مواجه شویم، و تصمیم داشته باشیم تا فضایی را به گروه آن با کاهش فضای برخی دیسک های دیگر با استفاده از دستور
[lvreduce](https://linux.die.net/man/8/lvreduce)
انجام دهیم

## هشدار
قبل از انجام کاهش فضا دیسک `LVM` موارد زیر را حتما مد نظر قرار بدید. انجام این کار امکان بروز پیامدهای برگشت ناپذیر دارد.

 ۱- این نوشته فقط برای دیسک ها و پارتیشن هایی که با `LVM` پیاده سازی شده اند قابل انجام می باشد.

  ۲- هنگام کاهش فضای دیسک، اگر دقت کافی و لازم را نداشته باشیم، احتمال از دست رفتن بخشی یا کل اطلاعات ذخیره شده روی دیسک وجود دارد.

## فرضیات مقاله  
برای انجام این نوشته فرض بر این است که قصد داریم تا فضای پارتیشن `/home` را ۲گیگ کاهش بدیم

    [root@cloud ~]# df -h /home/
    Filesystem            Size  Used Avail Use% Mounted on
    /dev/mapper/vg_cloud-LogVol00        12G   9.2G  1.9G  84%  /home

## گام ها
برای انجام این مهم به ترتیب کارهای زیر باید انجام شوند:

### گام۱: unmount پارتیشن
ابتدا باید فایل سیستم را `unmount` تا در حین انجام کوچک سازی با مشکل خواندن/نوشتن دیسک مواجه نشویم:

    [root@cloud ~]# umount /home/

### گام ۲: بررسی اشکالات پارتیشن
با اجرا دستور `e2fsck` می توان اشکالات احتمالی دیسک را بررسی و بعضا رفع نمود. با استفاده از گزینه `-f` این دستور را اجبار به بررسی و رفع اشکالات می کنیم.

    [root@cloud ~]# e2fsck -f /dev/mapper/vg_cloud-LogVol00
    e2fsck 1.41.12 (17-May-2010)
    Pass 1: Checking inodes, blocks, and sizes
    Pass 2: Checking directory structure
    Pass 3: Checking directory connectivity
    Pass 4: Checking reference counts
    Pass 5: Checking group summary information
    /dev/mapper/vg_cloud-LogVol00: 12/770640 files (0.0% non-contiguous), 2446686/3084288 blocks

### گام ۳: کاهش اندازه پارتیشن
در این نوشته گفتیم که فضا دیسک از ۱۲ گیگ باید به ۱۰گیگ کاهش پیدا کنه، به عبارت دیگری باید ۲گیگ کاسته شود:

    [root@cloud ~]# resize2fs /dev/mapper/vg_cloud-LogVol00 10G
    resize2fs 1.41.12 (17-May-2010)
    Resizing the filesystem on /dev/mapper/vg_cloud-LogVol00 to 2621440 (4k) blocks.
    The filesystem on /dev/mapper/vg_cloud-LogVol00 is now 2621440 blocks long.

### گام ۴: کاهش فضا دیسک LVM
حالا نوبت اجرای دستور `lvreduce` هست:

    [root@cloud ~]# lvreduce -r -L 10G /dev/mapper/vg_cloud-LogVol00
    WARNING: Reducing active logical volume to 10.00 GiB
    THIS MAY DESTROY YOUR DATA (filesystem etc.)
    Do you really want to reduce LogVol00? [y/n]: y
    Reducing logical volume LogVol00 to 10.00 GiB
    Logical volume LogVol00 successfully resized

در این دستور با گزینه `-r` عملا یکبار دیگه دستور 
[resize2fs](https://linux.die.net/man/8/resize2fs)
 را اجرا می کنیم، همچنین با گزینه `-L` میزان فضای جدید را تعیین می کنیم

### گام ۵: mount مجدد پارتیشن ها
در پایان پارتیشن `/home` مجدد `mount` کرده و آن را چک می کنیم.

    [root@cloud ~]# mount /home/
    [root@cloud ~]# df -h /home/
    Filesystem            Size  Used Avail Use% Mounted on
    /dev/mapper/vg_cloud-LogVol00     9.9G  9.2G  208M  98% /home

اکنون باید به فضای خالی گروه ۲گیگ اضافه شده و قابل اضافه شدن به دیگر دیسک ها می باشد.



##منابع
 * [reduce size lvm partition](https://www.linuxtechi.com/reduce-size-lvm-partition/)
 * [extend and reduce lvms in linux](https://www.tecmint.com/extend-and-reduce-lvms-in-linux/)
 * 