export const DBConfig = {
    name: "Flohmarkt",
    version: 1,
    objectStoresMeta: [
      {
        store: "gewinn",
        storeConfig: { keyPath: "id", autoIncrement: true },
        storeSchema: [
          { name: "name", keypath: "name", options: { unique: true } },
          { name: "gewinnBar", keypath: "gewinnBar", options: { unique: false } },
          { name: "gewinnPayPal", keypath: "gewinnPayPal", options: { unique: false } },
        ],
      },
      {
        store: "buchungen",
        storeConfig: { keyPath: "id", autoIncrement: true },
        storeSchema: [
          { name: "name", keypath: "name", options: { unique: false } },
          { name: "gewinn", keypath: "gewinn", options: { unique: false } },
          { name: "gewinnTyp", keypath: "gewinnTyp", options: { unique: false } },
          { name: "zeit", keypath: "zeit", options: {unique: true }}
        ],
      },
    ],
  };