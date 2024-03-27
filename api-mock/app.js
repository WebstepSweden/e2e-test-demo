const express = require("express");
const crypto = require("crypto");
const PORT = 3003;

const app = express();
app.use(express.json());

// Mock Coincap API Responses
const INVALID_CURRENCY = "invalid";

const rnd = () => crypto.randomInt(0, Math.pow(2, 31)).toString();

app.get("/coincap/v2/assets/:currency", (req, res) => {
  const currency = req.params.currency?.toLowerCase();
  if (currency == INVALID_CURRENCY) {
    res.status(404).send({ error: `Not a valid currency: ${currency}` });
    return;
  }

  res.send({
    data: {
      id: currency,
      rank: "1",
      symbol: currency.toUpperCase(),
      name: currency,
      supply: rnd(),
      maxSupply: rnd(),
      marketCapUsd: rnd(),
      volumeUsd24Hr: rnd(),
      priceUsd: rnd(),
      changePercent24Hr: rnd(),
      vwap24Hr: rnd(),
      explorer: "https://blockchain.info/",
    },
    timestamp: Math.floor(new Date("2024-01-01").getTime() / 1000),
  });
});

app.listen(PORT, () => {
  console.info(`Api-Mock app listening on port ${PORT}`);
});
