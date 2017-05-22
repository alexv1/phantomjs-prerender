var http = require('http');

http.createServer(function(req,res){
	var url = 'http://www.hbyjw.org.cn'  + req.url;
        console.log(req.headers);
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end('Hello world sam! '+ url);
}).listen(3000);

console.log('Server started on localhost:3000; press Ctrl-C to terminate....');
