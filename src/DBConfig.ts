export const DBConfig = {
    name: "Flohmarkt",
    version: 1,
    objectStoresMeta: [
      {
        store: "buchungen",
        storeConfig: { keyPath: "id", autoIncrement: true },
        storeSchema: [
          { name: "name", keypath: "name", options: { unique: true } },
          { name: "gewinnBar", keypath: "gewinnBar", options: { unique: false } },
          { name: "gewinnPayPal", keypath: "gewinnPayPal", options: { unique: false } },
        ],
      },
    ],
  };