# phantomjs-prerender
express-based phantomjs-prerender server, for SEO
核心代码来自文章[用PhantomJS来给AJAX站点做SEO优化](https://www.mxgw.info/t/phantomjs-prerender-for-seo.html)
改进如下：
- 根据express最新版本修正；
- 增加redis缓存提升性能，网页默认有效期1天；在server.js中配置；
- 提供api强制刷新缓存，localhost:3000/api/refresh，post方式，url=[完整url]，如www.a.com/home/news/1


# install
- Node v6.x，运行环境
- PhantomJS v2.x，用于渲染网页。[下载编译好的文件](http://www.cnmiss.cn/?p=424)
 - Ubuntu用户，不建议sudo apt-get install phantomjs，默认是v1.9
 - Mac用户，export PATH="$PATH:/Users/alex/server/phantomjs-2.1.1-macosx/bin/"
 - 查看版本，phantomjs --version
- Redis v2.x, localhost, 默认端口，设置为 daemon
- npm install -g nodemon, 用于启动 express服务
- sudo npm install，初始化依赖库
- nginx v1.7，根据搜索引擎爬虫，转发请求到prerender server上

# start
- 生产环境
<pre><code>
	sudo sh start.sh
</code></pre>
日志在nohup.out文件中，启动端口3000，在server.js中定义
- debug
<pre><code>
	nodemon --debug /var/www/phantomjs-prerender/server.js
</code></pre>


# stop
查看node的进程，ps -aux|grep node
找到相关进程，sudo kill -9

# Test
- install postman
- header中，User-Agent的设置同site.conf中的 http_user_agent
- 缓存更新，使用POST方式，body，x-www-form-urlencoded，[使用指南](http://yijiebuyi.com/blog/90c1381bfe0efb94cf9df932147552be.html)

# nginx文件，site.conf
代码片段
<pre><code>
    location @prerender {
        set $prerender 0;
        if ($http_user_agent ~* "baiduspider|test") {
            set $prerender 1;
        }
        if ($args ~ "_escaped_fragment_") {
            set $prerender 1;
        }
        if ($http_user_agent ~ "Prerender") {
            set $prerender 0;
        }
        if ($uri ~ "\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|doc|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff)") {
            set $prerender 0;
        }
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
	    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        if ($prerender = 1) {
            proxy_pass  http://spider_server;
        }
        if ($prerender = 0) {
            proxy_pass http://www.a.com;
        }
    }
</code></pre>
说明：
- 根据User-Agent进行转发；
- proxy_set_header，把header转发到负载均衡服务器，便于处理ip、域名等相关信息；
- upstream www.a.com，正常的解析服务器，如php

# test目录
我是express新手，放的是编写过程中的测试代码；高手可以直接略过。