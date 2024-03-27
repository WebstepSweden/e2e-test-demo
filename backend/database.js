var MongoClient = require("mongodb").MongoClient;

const HOST_AND_PORT = process.env.DATABASE_URL ?? "localhost:27017";
console.info("Using database URL:", HOST_AND_PORT);

const getUrl = (username, password) =>
  `mongodb://${username}:${password}@${HOST_AND_PORT}/currencyTracker`;

module.exports = {
  userHasAccess: (username, password) =>
    new Promise((resolve, reject) => {
      let url = getUrl(username, password);
      let mongoClient = new MongoClient(url);
      mongoClient
        .connect()
        .then((mongoClient) => {
          console.info("connection succeeded for user", username);
          mongoClient.close();
          resolve();
        })
        .catch((error) => {
          console.error("could not connect user", username, error);
          reject();
        });
    }),

  myTrackedCurrencies: ({ username, password }) =>
    new Promise((resolve, reject) => {
      let url = getUrl(username, password);
      let mongoClient = new MongoClient(url);
      mongoClient
        .connect()
        .then((mongoClient) => {
          let db = mongoClient.db("currencyTracker");
          db.collection("tracked")
            .countDocuments({ username: username })
            .then((count) => {
              if (count == 0) {
                mongoClient.close();
                resolve([]);
              } else {
                db.collection("tracked")
                  .find({ username: username })
                  .toArray()
                  .then((records) => {
                    mongoClient.close();
                    resolve(records);
                  });
              }
            });
        })
        .catch((error) => {
          console.error(
            "could not get my tracked currencies for user",
            username,
            error
          );
          reject();
        });
    }),

  saveTracking: ({ username, password }, record) =>
    new Promise((resolve, reject) => {
      let url = getUrl(username, password);
      let mongoClient = new MongoClient(url);
      mongoClient.connect().then((mongoClient) => {
        let db = mongoClient.db("currencyTracker");
        db.collection("tracked")
          .insertOne({ ...record, username })
          .then((inserted) => {
            console.info("inserted new tracking", inserted);
            resolve(inserted);
          })
          .catch((error) => {
            console.error(
              "could not insert tracking for user",
              username,
              error
            );
            reject();
          });
      });
    }),
};
