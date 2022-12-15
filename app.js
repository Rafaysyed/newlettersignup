const { response } = require("express");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { url } = require("inspector");
const e = require("express");
const app = express();
const port = 3000;

//To use css or images we need to use a express static fucntion
//For this we will create a folder named public and add all our images and css files into that folder.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;
  console.log(firstName, lastName, email);
  const mailchimp = require("@mailchimp/mailchimp_marketing");

  mailchimp.setConfig({
    apiKey: "7a594c0a4afaa00da3839583962c3385-us21",
    server: "us21",
  });

  async function run() {
    const response = await mailchimp.lists.batchListMembers("00a594933e", {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
          },
        },
      ],
    });
    console.log("response.status: ", res.statusCode); // 👉️ 200

    if (res.statusCode != 200) {
      res.send("Error signing up");
    } else {
      res.sendFile(__dirname + "/success.html");
    }
  }
  run();
});

app.post("/success", function (req, res) {
  res.redirect("/");
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// API KEY
// 7a594c0a4afaa00da3839583962c3385-us21
// list ID
// 00a594933e
