var fs = require('fs');
var qs = require('querystring');
var vehiclePlates = JSON.parse(fs.readFileSync(__dirname + "/vehicle_plates.json"));

var idx = 1;
vehiclePlates.forEach(vp => { 
   vp.id = idx++;

})
module.exports = {
    port: 3000,
    createServer: function (req, res) {
        switch (req.url) {
            case '/':
                res.writeHead(200, {
                    "Context-type": "text/html"
                })
                fs.createReadStream('./views/login.html').pipe(res);
                break;
            case '/dasboard.html':
                req.on('data', function (chunk) {
                    let data = '' + chunk
                    const check1 = JSON.parse('{"' + decodeURI(data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
                    var user = fs.readFileSync('./config/user.json')
                    const check = JSON.parse(user.toString())
                    if (check[0].userName != check1.userName) {
                        res.writeHead(200, {
                            "Context-type": "text/html"
                        })
                        fs.createReadStream('./views/login wrongusername.html').pipe(res)
                    } else if (check[0].password != check1.password) {
                        res.writeHead(200, {
                            "Context-type": "text/html"
                        })
                        fs.createReadStream('./views/login wrongpassword.html').pipe(res)
                    } else {
                        res.writeHead(200, {
                            "Context-type": "text/html"
                        })
                        res.write()
                        fs.createReadStream('./views/dasboard.html').pipe(res)
                    }
                })
                break
            case '/api/vehicle_plates/cities':
                console.log("request to cities");

                console.log('code 2');
                var cities = [];
                var idx = 1;
                vehiclePlates.forEach(vp => {
                    cities.push({ id: vp.id, text: vp.city });
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(cities));
                res.end();
                break

            case '/api/vehicle_plates/findCityPlate':
                console.log("request to city plate");
                var result = "";
                var body = '';
                var params = "";

                req.on('data', function (data) {//phần này dùng để lấy params truyền từ method POST.
                    body += data;
                }).on('end', function (data) {
                    params = qs.parse(body);
                    vehiclePlates.forEach(vp => {
                        if (vp.id == params.id) {
                            console.log("found");
                            result = vp.plate_no;
                            return false;
                        }
                    });
                    res.end(result);
                })
                break
            default:
                res.writeHead(200, {
                    "Context-type": "text/html"
                })
                fs.createReadStream('./views/404.html').pipe(res)
                break;
        }
    }
}