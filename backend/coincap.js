const API_URL = "https://api.coincap.io";

module.exports = {
  getRate: (currency) => {
    const url = `${API_URL}/v2/assets/${currency}`;
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
        return {
          ok: false,
          error: error,
        };
      });
  },
};
