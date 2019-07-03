title: آموزش برنامه نویسی Flask - فصل۳
briefing: امروزه پروتکل `http`در دنیای وب به عنوان پایه گذار ارتباط اطلاعات هست.
date_time: 2018-09-30 21:52
slug: Flask-tutorial-03
tags: python, flask, programming, tutorial
type: post

امروزه پروتکل `http`در دنیای وب به عنوان پایه گذار ارتباط اطلاعات هست. در این پروتکل متدهای متفاوتی برای دسترسی به اطلاعات هستند  
برخی از این متدها به ترتیب زیر هستند:

 * GET: اطلاعات را به صورت ساده و رمزنگاری نشده برای سرور ارسال می کند.
 * HEAD: همانند متد `GET` عمل کرده اما بدون پاسخ در بدنه.
 * POST: برای ارسال اطلاعات فرم `HTML`ای برای سرور استفاده می شود. اطلاعاتی که از این طریق ارسال می شوند توسط سرور کش نمی شوند.
 * PUT: تمامی منابع هدف ارائه شده را با محتوای بارگزاری شده جابجا می کند.
 * DELETE: تمامی منابع هدف را با آدرس url داده شده حذف می کند.
 
به طور پیش فرض پاسخ هایش را در قالب درخواست از نوع `GET` هدایت می کند. هر چند که این هدایت می تواند توسط آرگومانهای متد `route()` تغییر کند.
 
 برای نمونه استفاده از متد `POST` مثال زیر را مشاهده کنید:
 ابتدا یک فرم لاگین در قالب `HTML `ایجاد کرده:
 
     <html>
       <body>
          <form action = "http://localhost:5000/login" method = "post">
             <p>Enter Name:</p>
             <p><input type = "text" name = "nm" /></p>
             <p><input type = "submit" value = "submit" /></p>
          </form>
       </body>
    </html>

اکنون اسکریپت کنترل آن در پایتون:

    from flask import Flask, redirect, url_for, request
    app = Flask(__name__)
    
    @app.route('/success/<name>')
    def success(name):
       return 'welcome %s' % name
    
    @app.route('/login',methods = ['POST', 'GET'])
    def login():
       if request.method == 'POST':
          user = request.form['nm']
          return redirect(url_for('success',name = user))
       else:
          user = request.args.get('nm')
          return redirect(url_for('success',name = user))
    
    if __name__ == '__main__':
       app.run(debug = True)
       
آدرس `http://localhost/login` به متد `login()` مپ شده. زمانی که سرور داده ها را از طریق متد پست دریافت کرد دسترسی به پارامتر `nm` به صورت زیر امکان پذیر است:

    user = request.form['nm']

در قطعه کد بالا `form` یک نوع دیکشنری هست که پارامترهای فرم ارسال شده را به صورت کلید مقدار شامل می شود. اگر اطلاعات فرم با متد `GET‍` ارسال شوند، این متغییر `args` می شوند و از توع دیکشنری می باشد.