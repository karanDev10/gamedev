const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')
// const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"));
// app.use('/scripts', express.static(__dirname + '/scripts/'));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})
app.post("/", (req, res) => {
    // console.log("ur post received");
    const Name = req.body.Name;
    const LastName = req.body.lastName;
    const mail = req.body.emailid;
    console.log(Name, LastName, mail);

    const data = {
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: Name,
                    LNAME: LastName
                }

            }
        ]
    };
    const JsonData = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/api_key";
    const options = {
        method: "POST",
        auth: "Api_key"
    }

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/index.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));

        })
    })
    request.write(JsonData);
    request.end();
    // res.write(`<p>successfully sent data</p>`);
    // res.send();
    // res.sendFile(__dirname + "/failure.html")

});
app.post("/failure", (req, res) => {
    res.redirect("/");
})
app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("your server is running on port 3000")
})
