const dev = process.argv[2] == "dev";

const express = require("express");
const app = express();
var compression = require("compression");
const https = require('https');
const http = require('http');
const fs = require("fs");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
app.set("view engine", "ejs");
app.set("view engine", "ejs");
app.disable("x-powered-by");
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));


app.use((req, res, next) => {
  if (req.protocol === 'http' && !dev) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});


app.on("uncaughtException", function (err) {
  console.log(err);
});
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


var httpServer = http.createServer({}, app).listen(80, function () {
});

if (!dev) {
  var sslOptions = {
    key: fs.readFileSync('ssl/privkey.key', 'utf8'),
    cert: fs.readFileSync('ssl/cer.cer', 'utf8'),
  };
  var httpsServer = https.createServer(sslOptions, app).listen(443, function () {
  });
}

app.get("/", (request, response) => {
  return response.render("index.ejs", {});
});

app.get("*", (request, response) => {
  return response.redirect("/");
});

const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

app.post("/", jsonParser, (request, response) => {
  console.log(request.body);
  const { fullname, email, title, message } = request.body;
  const mailData = {
    from: process.env.user,
    to: process.env.user,
    subject: `${fullname} ${email} sent you an email.`,
    text: `${title} : ${message}`,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      console.log(error);
      return response
        .status(500)
        .send(
          "Encountered an error.... Try again later or send me an email directly at sam.borremans@duke.edu!"
        );
    }
    return response
      .status(200)
      .send(
        "Email sent successfully! Thank you for contacting me. I will get back to you shortly."
      );
  });
});
