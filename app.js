const express = require("express");
const body_parser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();

app.use(body_parser.urlencoded({extended: true}))

// As our page is static, we must use a public folder using static() function
app.use(express.static("public"))

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;

    // The data we need to add a new member
    const data = {
        // making reference to a member 
        members: [
            {
                // to referer to the email address as mailchimp need to recognize it
                email_address: email,
                // same thing with status and merge fields
                status: "subscribed",
                merge_fields: {
                    // makes reference to some data needed as mailchimp needs
                    FNAME: first_name,
                    LNAME: last_name
                }
            }
        ]
    };

    // transforms the data into json string
    const json_data = JSON.stringify(data);

    // refering to the mailchimp url
    const url = "https://us14.api.mailchimp.com/3.0/lists/c060892aaf";
    
    // refering to the options mailchimp needs
    const options = {
        // method is the most important option I need to specify
        method: "POST",
        auth: "genaro0210:1e202fbad4450537381762b19723ade7-us14"
    };

    // create a constant called request to request data from the url and options given
    const request = https.request(url, options, function(response) {
        if (response.statusCode == 200) res.sendFile(__dirname + "/success.html");
        else res.sendFile(__dirname + "/failure.html");
        
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    });

    // Writes that json data
    request.write(json_data);

    // Ends the request
    request.end();

    console.log(first_name + " " + last_name);
    console.log(email);
});

app.post("/failure", function(req, res) {
    // res.redirect() redirects you according to the path
    res.redirect("/");
})

// process.env.PORT => to allow the server paid to give us a port
// || allows the app to choose either one of thr ports given
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});

/*
app.listen(3000, function() {
    console.log("Server started on port: 3000");
});
*/

// Api key: 1e202fbad4450537381762b19723ade7-us14
// List id: c060892aaf