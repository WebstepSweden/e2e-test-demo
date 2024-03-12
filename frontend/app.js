const express = require("express");
const fs = require("fs");
const dateFns = require("date-fns");
const port = 3000;

const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  ifLoggedIn(req, res, () => {
    res.writeHead(200, { "content-type": "text/html" });
    fs.createReadStream("html/app.html").pipe(res);
  });
});

app.get("/css/pico.min.css", (req, res) => {
  res.writeHead(200, { "content-type": "text/css" });
  fs.createReadStream("css/pico.min.css").pipe(res);
});

// Currency Tracking
app.post("/track-currency", (req, res) => {
  ifLoggedIn(req, res, () => {
    res.send({
      currency: req.body.currency,
      trackingStarted: dateFns.formatDistance(
        dateFns.subMilliseconds(new Date(), 500),
        new Date(),
        {
          addSuffix: true,
        }
      ),
      priceThen: 200,
      priceNow: 300,
      change: 100,
    });
  });
});
app.get("/my-tracked-currencies", (req, res) => {
  ifLoggedIn(req, res, () => {
    res.send([
      {
        currency: "bitcoin",
        trackingStarted: dateFns.formatDistance(
          dateFns.subDays(new Date(), 3),
          new Date(),
          {
            addSuffix: true,
          }
        ),
        priceThen: 200,
        priceNow: 300,
        change: 100,
      },
    ]);
  });
});

// User Session Logic
const ifLoggedIn = (req, res, func) =>
  req.cookies["auth"] ? func() : res.redirect("/login");

app.get("/login", (req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  fs.createReadStream("html/login.html").pipe(res);
});

app.post("/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.redirect("/login?error=1");
  } else {
    res.cookie("auth", Buffer.from(req.body.username).toString("base64"));
    res.redirect("/");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
