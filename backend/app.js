const express = require("express");
const database = require("./database");
const coincap = require("./coincap");
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
      console.warn("/auth", err);
      res.sendStatus(403);
    });
});

app.post("/my-tracked-currencies", (req, res) =>
  withUser(req, res, (user) => {
    database
      .myTrackedCurrencies(user)
      .then((records) => {
        const promises = records.map((record) => {
          return coincap.getRate(record.currency).then((currencyResponse) => {
            if (!currencyResponse.ok) {
              return Promise.resolve(false);
            }

            return {
              priceNow: currencyResponse.price,
              change: (
                parseFloat(currencyResponse.price) -
                parseFloat(record.priceThen)
              ).toString(),
              ...record,
            };
          });
        });

        Promise.all(promises).then((withCurrentCurrencyData) => {
          res.send(withCurrentCurrencyData);
        });
      })
      .catch((err) => {
        console.warn("/my-tracked-currencies", err);
        res.sendStatus(500);
      });
  })
);

app.post("/track-currency", (req, res) =>
  withUser(req, res, (user) => {
    coincap.getRate(req.body.currency).then((response) => {
      if (!response.ok) {
        res.status(400).send(response);
        return Promise.resolve(false);
      }

      var record = {
        currency: req.body.currency,
        trackingStarted: new Date(),
        priceThen: response.price,
      };

      database
        .saveTracking(user, record)
        .then(() => {
          res.send({ ...record, priceNow: record.priceThen, change: 0 });
        })
        .catch((err) => {
          console.warn("/my-tracked-currencies", err);
          res.sendStatus(500);
        });
    });
  })
);

app.listen(port, () => {
  console.info(`Backend app listening on port ${port}`);
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
