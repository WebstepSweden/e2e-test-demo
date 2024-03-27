const express = require("express");
const fs = require("fs");
const dateFns = require("date-fns");

const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const PORT = process.env.PORT ?? 3002;
const BACKEND_URL = process.env.BACKEND_URL ?? "localhost:3001";
console.info("Using backend URL:", BACKEND_URL);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static resources
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
  ifLoggedIn(req, res, (token) => {
    backend
      .trackCurrency(token, req.body.currency)
      .then((response) =>
        response.json().then((json) => {
          return { ok: response.ok, status: response.status, json: json };
        })
      )
      .then(({ ok, status, json }) => {
        if (!ok) {
          res.status(status).send(json);
        } else {
          res.send(formatRecords([json])[0]);
        }
      })
      .catch((error) => {
        res.status(500).send(JSON.stringify(error));
      });
  });
});

app.get("/my-tracked-currencies", (req, res) => {
  ifLoggedIn(req, res, (token) => {
    backend
      .myTrackedCurrencies(token)
      .then((response) => response.json())
      .then((records) => {
        res.send(formatRecords(records));
      })
      .catch((error) => {
        res.status(500).send(JSON.stringify(error));
      });
  });
});

// User Session Logic
const ifLoggedIn = (req, res, func) =>
  req.cookies["auth"] ? func(req.cookies["auth"]) : res.redirect("/login");

app.get("/login", (req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  fs.createReadStream("html/login.html").pipe(res);
});

app.post("/login", (req, res) => {
  backend
    .auth(req.body.username, req.body.password)
    .then((response) => {
      if (response.ok) {
        const token = Buffer.from(
          `${req.body.username}:${req.body.password}`
        ).toString("base64");
        res.cookie("auth", token);
        res.redirect("/");
      } else {
        res.redirect("/login?error=1");
      }
    })
    .catch((error) => {
      console.error(error);
      res.redirect("/login?error=2");
    });
});

app.post("/logout", (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});

app.listen(PORT, () => {
  console.info(`Frontend app listening on port ${PORT}`);
});

const callBackend = (path, data) =>
  fetch(`http://${BACKEND_URL}${path}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

const backend = {
  auth: (username, password) => callBackend("/auth", { username, password }),
  myTrackedCurrencies: (token) =>
    callBackend("/my-tracked-currencies", { token }),
  trackCurrency: (token, currency) =>
    callBackend("/track-currency", { token, currency }),
};

const formatRecords = (records) =>
  records.map((record) => {
    return {
      ...record,
      trackingStarted: dateFns.formatDistance(
        new Date(record.trackingStarted),
        new Date(),
        { addSuffix: true }
      ),
    };
  });
