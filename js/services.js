const { WHATSAPP_TOKEN, WHATSAPP_BUSINESS_NUMBER } = require('./settings');


function BookToWhatsapp(body) {
    var qs = require("querystring");
    var http = require("https");
    
    var options = {
        "method": "POST",
        "hostname": "api.ultramsg.com",
        "port": null,
        "path": "/instance112870/messages/chat",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        }
    };
    
    var req = http.request(options, function (res) {
        var chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        
        res.on("end", function () {
            var body = Buffer.concat(chunks);
        });
    });
    var postData = qs.stringify({
        "token": WHATSAPP_TOKEN,
        "to": WHATSAPP_BUSINESS_NUMBER,
        "body": body
    });
    req.write(postData);
    req.end();
}


module.exports = { BookToWhatsapp };