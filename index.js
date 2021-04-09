const https = require('https');
const qs = require('querystring');
const express = require('express');
const app = express();
const port = 5000;

//Global variable for statusCode
let statusCode;

app.use(express.urlencoded({extended: true}));
app.use(express.json());



var dataToPost =  {"from" : "+699699699", "message": "title-Incident;1;1;1;1;", 
"secret": "fe260d35-052f-4b9d-aa6d-b28baf20fac3", 
"datetime" : "1617888807000"}



app.post('/postToEview', (req, res) => {
    let postData = req.body;
      console.log(">>>> request received")
      sendToEview(postData)
      res.sendStatus(200)
    })

    const sendToEview = () => {
        return new Promise((resolve, reject) => {
            var options = {
                "rejectUnauthorized": false,
                "method": "POST",
                "hostname": "api.eview.watch",
                "path": "/sms/frontlinesms",
                "headers": {
                    "Content-Type": "application/json",
                },
            };
            
            const req = https.request(options, (res) => {
                statusCode = res.statusCode;
                console.log(statusCode)
                let responseBody = "";
                res.on("data", (chunk) => {
                    console.log("data", chunk)
                    responseBody += chunk;
                });
                
                res.on("error", (err)=> {
                    console.log("Error", err)
                })
    
                res.on("end", () => {
                    if (statusCode != 200){
                      responseBody = {
                         message: "An error occured"
                       };
                       console.log("ResponseBody", responseBody)
                       resolve(responseBody);
                    }else{
                      const finalBodyResponse = JSON.stringify(responseBody);
                      console.log("finalBodyResponse ", finalBodyResponse.toString());
                      resolve(finalBodyResponse);     
                    }
                });
            });
    
            req.on('error', (e) => {
                console.error("Error", e);
                reject(e.message);
            });
            
            req.write(JSON.stringify(dataToPost));
            req.end();
        });
    };   


    app.listen(port, ()=>{
        console.log(`server running on port ${port}`)
    })

