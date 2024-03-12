const express = require("express");
const database = require("./database");
const port = 3001;

const app = express();
app.use(express.json());

app.post("/auth", (req, res) => {
  database
    .userHasAccess(req.body.username, req.body.password)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("/auth", err);
      res.sendStatus(403);
    });
});

app.post("/my-tracked-currencies", (req, res) =>
  withUser(req, res, (user) => {
    database
      .myTrackedCurrencies(user)
      .then((records) => {
        res.send(records);
      })
      .catch((err) => {
        console.log("/my-tracked-currencies", err);
        res.sendStatus(500);
      });
  })
);

app.post("/track-currency", (req, res) =>
  withUser(req, res, (user) => {
    var record = {
      currency: req.body.currency,
      trackingStarted: new Date(),
      priceThen: 200,
    };

    database
      .saveTracking(user, record)
      .then(() => {
        console.log(record);
        res.send({ ...record, priceNow: record.priceThen, change: 0 });
      })
      .catch((err) => {
        console.log("/my-tracked-currencies", err);
        res.sendStatus(500);
      });
  })
);

app.listen(port, () => {
  console.log(`Backend app listening on port ${port}`);
});

const withUser = (req, res, func) => {
  if (!req.body.token) {
    req.sendStatus(401);
    return;
  }

  var decoded = Buffer.from(req.body.token, "base64").toString();
  if (!decoded || decoded.indexOf(":") == -1) {
    req.sendStatus(401);
    return;
  }

  var userInfo = decoded.split(":");
  func({
    username: userInfo[0],
    password: userInfo[1],
  });
};
