const COINCAP_URL = process.env.COINCAP_URL ?? "https://api.coincap.io";
console.info("Using Coincap API Url:", COINCAP_URL);

module.exports = {
  getRate: (currency) => {
    const url = `${COINCAP_URL}/v2/assets/${currency}`;
    console.info("calling Coincap API", url);

    return fetch(url)
      .then((respose) => respose.json())
      .then((json) => {
        console.debug("got response from Coincap API", json);
        if (json.error || !json.data?.priceUsd) {
          return {
            ok: false,
            ...json,
          };
        }

        return {
          ok: true,
          price: json.data.priceUsd,
        };
      })
      .catch((error) => {
        console.error("Error from Coincap API", error);
        return {
          ok: false,
          error: error,
        };
      });
  },
};
