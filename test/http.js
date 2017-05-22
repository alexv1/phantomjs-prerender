// ExpressJS调用方式
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    // 完整URL
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('welcome to prerender!');
});

app.get('/home/*', function (req, res) {
    // 完整URL
//    var url = 'http://www.hbyjw.org.cn' + req.url;
    var url = req.protocol + '://' + req.hostname + req.url;  
    console.log(url);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(url);
});

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
