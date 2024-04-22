title: ایجاد دیسک LVM در لینوکس
briefing: کلمه LVM بر مبنی مدیریت دیسک ها منطقی -Logical Volume Management - معروف شده
date_time: 2024-04-22 16:16
slug: create-lvm-partiotion-in-linux
tags: linux, learn, tutorial, lvm, disk
type: post

کلمه `LVM` بر مبنی مدیریت دیسک ها منطقی -Logical Volume Management - معروف شده. یکی از مزیت های اصلی
 پارتیشن `LVM`، امکان افزایش و توسعه سایز آن به صورت آنلاین و بدون قطعی می باشد. همچنین با این روش امکان
 کاهش هم سایز هم است اما توصیه نمی شود.

#ایجاد PV ولوم منطقی
برای شروع ابتدا باید بسته `lvm2` نصب شود.

    sudo apt install lvm2
سپس با دستور زیر روی `/dev/sdb` یک `pv` ایجاد می شود

    sudo pvcreate /dev/sdb
برای اطمینان می توانید دستورات زیر را اجرا کنید

    sudo pvs /dev/sdb
    OR
    sudo pvdisplay /dev/sdb

#ایجاد VG ولوم گروه
در گام بعد باید یک گروه ولوم ایجاد شود. برای ایجاد گروه ولوم از دستور زیر استفاده می شود:

    sudo vgcreate vg_group /dev/sdb

برا بررسی صحت ایجاد ولوم گروه دستور زیر باید اجرا شود.

    sudo vgs
    OR
    sudo vgdisplay vg_group

#ایجاد دیکس منطقی LV
برای ایجاد دیسک منطقی از گروه ولوم ساخته شده با استفاده از دستور زیر انجام می شود:

    #sudo lvcreate -L Size -n Name VG-NAME
    sudo lvcreate -L 20G -n lv-disk1 vg_group

برای بررسی صحت دیسک ایجاد شده:

    sudo lvs
    OR
    sudo lvdisplay /dev/vg_group/lv-disk1

## فرمت کردن دیسک LV
در نهایت برای ایجاد دیسک `lvm` باید آن را فرمت کنیم تا قابل استفاده باشد. پس دستور زیر را اجرا می کنیم

    sudo mkfs.ext4 /dev/vg_group/lv-disk1

اکنون دیسک ایجاد شده فرمت شده و قابل `mount` و استفاده می باشد.

#منابع
 - [How to Create LVM Partition Step-by-Step in Linux](https://www.linuxtechi.com/how-to-create-lvm-partition-in-linux/)
 - [lvremove Command Examples in Linux](https://www.thegeekdiary.com/lvremove-command-examples-in-linux/)