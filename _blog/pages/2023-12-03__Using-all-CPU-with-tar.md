title: فشرده سازی با استفاده از تمام ظرفیت CPU
briefing: با برنامه pigz می توان از تمام ظرفیت cpu برای فشرده سازی با دستور tar استفاده کرد.
date_time: 2023-12-03 12:34
slug: Using-all-CPU-with-tar
tags: linux, tar, gzip, shell, debian, tips
type: post

ممکن شما یک پوشه حجیم داشته باشید و قصد فشرده سازی آن را داشته باشید. برای این مهم از دستور زیر خیلی راحت 
می توانید این کار را انجام دهید:

    $> tar -czvf filename.tar.gz /path/to/compress

خب با این دستور شما یک پوشه را با متد `gzip` فشرده می کنید. با این تفاوت که روند فشرده سازی خیلی ساده و 
با یک کور `CPU` انجام می شود.

فرمان `tar` گزینه ای برای مشخص کردن نحوه فشرده سازی دارد که می توان با استفاده از آن و نصب پکیج های 
مورد نیاز، از تمام ظرفیت  `CPU` استفاده کرد که به طبع آن سرعت فشرده سازی نیز بالا می رود.

## PIGZ یا PBZIP2
با نصب این دو بسته متد فشرده سازی بر پایه `gzip` و `bzip2` به صورت همزمان (parallel) را می توان برای 
`tar` تأمین نمود.

### نحوه نصب
برای نصب به صورت زیر عمل می کنیم:

    sudo apt install pigz pbzip2 # Debian/Ubuntu
    sudo dnf install pigz pbzip2 # Fedora
    sudo pacman -Sy pigz pbzip2  # Arch Linux

به همین سادگی

### نحوه فشرده سازی

برای استفاده از این متد فشرده سازی کافی است تا دستور `tar` را به صورت زیر اجرا کنیم:

    tar -I pigz -cf linux-5.10-rc3.tar.gz linux/
    tar -I pbzip2 -cf linux-5.10-rc3.tar.bz2 linux/

با استفاده از گزینه `-I` یا `--use-compression-program`  می توان نحوه فشرده سازی را با 
برنامه ای بیرونی تعیین نمود

##منابع:

- [How to Compress Archives Using All CPU Cores with Tar](https://www.maketecheasier.com/compress-archives-using-all-cpu-cores-tar/)
- [Utilizing multi core for tar+gzip/bzip compression/decompression](https://stackoverflow.com/a/17110941/926639)