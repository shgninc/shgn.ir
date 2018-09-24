title: Post title here
briefing: A brief description of post.
date_time: 2018-09-24 17:01
slug: Flask-tutorial-02
tags: 
type: post

##مسیریابی در Flask
فریمورک های امروزی برای به یاد ماندن آدرس های URL به سادگی هر چه بیشتر برای کاربران، از تکنیک routing استفاده می کنند. به عبارت دیگر دسترسی به یک 
صفحه مشخص سایت به طور مستقیم خیلی کاربردی تر از این است که از طریق صفحه اصلی سایت به آن صفحه دسترسی پیدا کنیم.

در 
`Flask` 
از متد 
`route()`
برای تخصیص یک آدرس به یک تابع استفاده می شود:

```
@app.route(‘/hello’)
def hello_world():
	return ‘hello world’
```

همچنین برای همین منظور می توان از متد 
`add_url_rule()`
استفاده کرد. این متد نیز همانند متد
`route()`
یک آدرس را به یک تابع تخصیص می دهد:

```
def hello_world():
   return ‘hello world’
app.add_url_rule(‘/’, ‘hello’, hello_world)
```

##آدرس های پویا
از دیگز امکانات ارائه شده در 
`Flask`،
استفاده از آدرس های پویا با بهره گیری از متغییرها می باشد.
این مهم به این صورت قابل انجام است که، در آدرس یک 
`<variable-name>`
نیز ارسال شده که در متد
`route()`ی
که به یک تابع تخصیص شده، آن متغییر را هم نیز به آن تابع ارسال می کند. برای نمونه:

```
from flask import Flask
app = Flask(__name__)

@app.route('/hello/<name>')
def hello_name(name):
   return 'Hello %s!' % name

if __name__ == '__main__':
   app.run(debug = True)
```

اگر آدرس درخواست شده به صورت زیر باشد، برنامه آن نام را بر می گرداند:

```
 http://localhost:5000/hello/user.
```
از دیگر امکانات فلسک، تعیین نوع متغییر دریافت شده از آدرس می باشد. این نوع به صورت پیش فرض 
`String`
هست، با این وجود از انواع زیر نیز می توان استفاده کرد:
`int`
`float`
`path`

در مثال زیر این انواع مشهد می باشند:
```
from flask import Flask
app = Flask(__name__)

@app.route('/blog/<int:postID>')
def show_blog(postID):
   return 'Blog Number %d' % postID

@app.route('/rev/<float:revNo>')
def revision(revNo):
   return 'Revision Number %f' % revNo

if __name__ == '__main__':
   app.run()
```

##تولید آدرس
جهت تولید آدرس پویا برای یک تابع مشخص می توان از متد
`url_for()`
استفاده کرد.این متد، به عنوان اولین پارامتر، نام تابع و پارامترهای بعدی به عنوان پارامترهای قابل دریافت آن تابع را دریافت می کند. برای مثال:
```
from flask import Flask, redirect, url_for
app = Flask(__name__)

@app.route('/admin')
def hello_admin():
   return 'Hello Admin'

@app.route('/guest/<guest>')
def hello_guest(guest):
   return 'Hello %s as Guest' % guest

@app.route('/user/<name>')
def hello_user(name):
   if name =='admin':
      return redirect(url_for('hello_admin'))
   else:
      return redirect(url_for('hello_guest',guest = name))

if __name__ == '__main__':
   app.run(debug = True)
```

##در پایان
همانطور که مشاهده کردید، مسیریابی نیز در این فریمورک بسیار ساده و کاربردی بوده و برخلاف دیگر فریمورک ها پیچیدگی ندارد. انشاء الله در مطالب بعدی درباره انواع متدهای
مورد استفاده از در
`HTTP`
همانند
`GET`, `PUT`
و... صحبت خواهد شد.

   

