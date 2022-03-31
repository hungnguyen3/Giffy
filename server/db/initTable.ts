import { client } from "../src/index";

export const initTables = async () => {
  await initCollections();
  await initGiffies();
  await initUsers();
  await initCollections_Users();
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
          "likes" int NOT NULL,

          FOREIGN KEY ("collectionId") REFERENCES "collections"("collectionId")         
        );
      `
    )
    .then((res: any) => console.log("successfully created giffy table"))
    .catch((e: any) => console.error(e.stack));
}

const initUsers = async () => {
  await client
    .query(
      `
      CREATE TABLE IF NOT EXISTS users (
        "userId" SERIAL PRIMARY KEY,
        "userName" varchar(255) NOT NULL,
        "firebaseAuthId" varchar(255) NOT NULL,
        "profileImgUrl" varchar(255)
      );
      `
    )
    .then((res: any) => console.log("successfully created users table"))
    .catch((e: any) => console.error(e.stack));
}

const initCollections_Users = async () => {
  await client
    .query(
      `
        DO $$ BEGIN
        CREATE TYPE permissions_t AS ENUM('read', 'write', 'admin');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;

        CREATE TABLE IF NOT EXISTS collections_users (
                    "collectionId" int NOT NULL,
                    "userId" int NOT NULL,
                    "permissions" permissions_t NOT NULL,
              
              FOREIGN KEY ("collectionId") REFERENCES "collections"("collectionId"),
              FOREIGN KEY ("userId") REFERENCES "users"("userId")
          )
      `
    )
    .then((res: any) => console.log("successfully created collections_users table"))
    .catch((e: any) => console.error(e.stack));
}
