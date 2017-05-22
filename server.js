// ExpressJS调用方式
var express = require('express');
var bodyParser = require('body-parser');
var redis = require("redis");


// 1 day
var defaultRedisEx = 86400;
var client = redis.createClient();
client.on("error", function (err) {  
    console.log("redis Error " + err);  
}); 


var app = express();
app.use(bodyParser.urlencoded({    
  extended: true
}));
// 引入NodeJS的子进程模块
var child_process = require('child_process');

app.get('/', function (req, res) {
    // 完整URL
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('welcome to prerender!');
});

app.get('/home/*', function (req, res) {
    // 完整URL
    var url = req.protocol + '://' + req.hostname + req.url;
    client.get(url, function(err, reply) {
        if(err) {
            console.log("error" + err);
        } else {
            if(reply == null){
                console.log("rendering page#" + url);
                render(url, res);
            } else {
                console.log("get cached page#" + url);
                res.send(reply);
            }
        }
    });
    
});

app.post('/api/refresh', function (req, res) {
    // 更新cache
    var url = req.body.url;
    render(url, res); 
    // 完整URL
    // res.writeHead(200, { 'Content-Type': 'text/plain' });
    // res.end('/api/refresh');
});

function render(url,res){

    console.log(url);  

    // 预渲染后的页面字符串容器
    var content = '';
    // 开启一个phantomjs子进程
    var phantom = child_process.spawn('phantomjs', ['spider.js', url]);

    // 设置stdout字符编码
    phantom.stdout.setEncoding('utf8');

    // 监听phantomjs的stdout，并拼接起来
    phantom.stdout.on('data', function(data){
        content += data.toString();
    });

    // 监听子进程退出事件
    phantom.on('exit', function(code){
        switch (code){
            case 1:
                console.log('loading failed#' + url);
                res.send('loading failed');
                break;
            case 2:
                console.log('loading timeout: '+ url);
                res.send('loading timeout');
                break;
            default:
                // 处理成功后，才渲染并设置缓存
                client.set(url, content, 'EX', defaultRedisEx);
                res.send(content);
                break;
        }
    });
}

// 定制404页面 
app.use(function(req, res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});
// 定制 500 页面
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server started on http://%s:%s', host, port);
});
