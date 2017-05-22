var redis = require("redis"),
client = redis.createClient();
client.on("error", function (err) {  
    console.log("Error " + err);  
});  


var key = "pr-url";
var defaultVal = "html";
var defaultEx = 86400;
// var val = client.get(key, function(err, reply) {
//     // reply is null, prerender
//     console.log('key is miss, reset!');
//     client.set(key, defaultVal, 'EX', defaultEx);
//     client.end(true);
// });

client.get(key, function(err, reply) {
    if(err) {
        console.log("error" + err);
    } else {
    	if(reply == null){
    		console.log("do set");
    		client.set(key, defaultVal, 'EX', defaultEx);
	    } else {
	    	console.log(key + "#" + reply);
	    }
    }
});
