title: ساختار اجرا در انسیبل
briefing: برنامه مدیریت ساختار و تنظیمات روی زیرساخت های مختلف می باشد.
date_time: 2022-10-24 16:20
slug: anatomy-of-ansible-play
tags: linux, ansible, tutorial, devops, automation
type: post

این نوشته، اولین پست برای شروع کار با `ansible` است. نوع نوشتار به صورت خلاصه و تکنیکی می باشد که برای متخصصان `DevOps` مناسب می باشد.

برنامه `ansible`، به طور خیلی خلاصه، یک برنامه مدیریت ساختار و تنظیمات روی زیرساخت های مختلف می باشد. برای آشنایی با یک سری کلمات کلیدی شروع می کنیم.

یک سند، برای اجرا یک یا چند دستور، بر روی یک یا چند نود تولید می شود.

یک سند می تواند به عنوان یک رول، برای گروهی از هاست ها اجرا شود.

اسناد به ترتیب بالا تا پایین آن ها روی نودهای اجرا می شوند.


برای مثال: 

    ---
    - name: Start the Play          # describes WHAT we are doing
    - hosts: all # one or more group or host patterns
        order: sorted # Host order: value can be 'inventory' ie as is in the inventory file, reverse_inventory, sorted (alpha), reverse_sorted, shuffle (random)
        remote_user: yourname # or root This property was called user before Ansible 1.4
        become: yes # optional
        become_user: postgres # optional
        gather_facts: False
        connection: local or network_cli
        serial: 1 OR 30%
        max_fail_percentage
        strategy: free
        any_errors_fatal: True

    where:

    --- separates play

#### host
مشخص کننده دیوایس هدف است. تعریف بیشتر از یک هاست یا گروه یا قالب نام را که با نام های تعریف شده در inventory تعریف شده، مطابقت داشته باشند، را می توان با کاما از هم جدا نمود.

####  متغییرهای ارتباطی remote_user, become and become_user
**`remote_user`:** مشخص کننده نام کاربری پیش فرض ریموت برای لاگین است.

**`gather_facts`:** مشخص کننده این است اطلاعات دیوایس ریموت را جمع آوری کند یا خیر.

**`become` و `become_user`:** تعیین کننده نحوه دسترسی کاربر در دیوایس ریموت است 

#### order
این متغییر تعیین کننده ترتیب اجرا دستورات روی هاست ها است. پیش فرض آن به ترتیب چیده شدن در `inventory` هست. مقادیر زیر، مقادیر معتبر هستند:

 - inventory: مقدار پیش فرض هست که طبق چیدمان در فایل های `inventory` اجرا می کند
 - reverse_inventory: همانند گزینه قبلی یا این تفاوت که ترتیب فایل های `inventory` را بر عکس اجرا می کند 
 - sorted: ترتیب اجرا براساس نام هاست ها به صورت الفبایی می شود.
 - reverse_sorted: ترتیب اجرا براساس نام هاست ها به صورت از آخر به اول الفبایی می شود.
 - shuffle: ترتیب اجرا تصادفی می شود.

**`max_fail_percentage`:** ترتیب اجرا براساس درصدی از هاست هایی که با خطا مواجه شده اند می باشد.

**`strategy`:** ترتیب اجرا براساس هاست هایی هست که سریعتر اجرا می شوند.

**`serial`:** بدین وسیله می توان تعداد هاست هایی که به صورت همزمان اجرا روی آن ها صورت پذیرد را مشخص نمود. مقدار `batch` 
زیرمجموعه ای از هاست ها که اجرا روی آنها قبل از مجموعه بعدی شروع شوند را شروع می کند. همچنین می توان به این متغییر مقدار 
به صورت درصدی داد که مشخص می کند نسبت تعداد هاستی که در اجرا می باشند به نسبت تعداد هاستی که اجرا شده اند را.

**`any_errors_fatal`:** با این مقدار، هر خطایی روی هر هاستی رخ بده انسیبل آن را وخیم تلقی کرده 
و بدون در نظر گرفتن مابقی هاست ها، از روند اجرا خارج می شود.

به عنوان نمونه

    ---
    - name: Start the Play          # describes WHAT we are doing
      hosts: application            # describes WHERE we are doing it (e.g. against all application hosts)
      become: false                 # describes HOW we are doing it (with priviledge escalation, by gather facts, serial batches, etc)
      gather_facts: true
      serial: 10

      vars:
        app_path: /opt/app
  
      environment:
        PATH: /my/folder:

      pre_tasks:

      roles:

      tasks:

      post_tasks:


## Playbook 
یک فایل که شامل یک یا بیشتر اجرا می باشد.

    ---
    - name: Start the first Play    # describes WHAT we are doing
      hosts: application            # describes WHERE we are doing it; what target hosts
      become: false                 # describes HOW we are doing it (with priviledge escalation, by gather facts, serial batches, etc)
      gather_facts: true
      serial: 10

      # vars, environment, pre_tasks, roles, tasks, post_tasks, etc.

    - name: Start the second Play
      hosts: webservers
      become: true
      gather_facts: false
      serial: 5

      # vars, environment, pre_tasks, roles, tasks, post_tasks, etc.

##Role

    role-foobar/
    ├── defaults
    │   └── main.yml
    ├── vars
    │   └── main.yml
    ├── files
    |   └── foobar.txt
    ├── handlers
    │   └── main.yml
    ├── meta
    │   └── main.yml
    ├── tasks
    │   └── main.yml
    └── templates
        └── foobar.conf.j2