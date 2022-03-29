import { client } from "../src/index";

export const initTables = async () => {
  await initCollections();
  await initGiffies();
};

const initCollections = async () => {
  await client
    .query(
      `
          CREATE TABLE IF NOT EXISTS collections (
            "collectionId" SERIAL PRIMARY KEY,
            "collectionName" varchar(255) NOT NULL,
            private boolean NOT NULL
        );
      `
    )
    .then((res: any) => console.log("successfully created collection table"))
    .catch((e: any) => console.error(e.stack));
}

const initGiffies = async () => {
  await client
    .query(
      `
        CREATE TABLE IF NOT EXISTS giffies (
          "giffyId" SERIAL PRIMARY KEY,
          "collectionId" int NOT NULL,
          "firebaseUrl" varchar(255) NOT NULL,
          "giffyName" varchar(255),
          likes int NOT NULL,

          FOREIGN KEY ("collectionId") REFERENCES "collections"("collectionId")         
        );
      `
    )
    .then((res: any) => console.log("successfully created giffy table"))
    .catch((e: any) => console.error(e.stack));
}