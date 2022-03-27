import { client } from "../src/index";

export const initTables = async () => {
  await client
    .query(
      `
            CREATE TABLE IF NOT EXISTS Persons (
                PersonID int,
                LastName varchar(255),
                FirstName varchar(255),
                Address varchar(255),
                City varchar(255)
            );
        `
    )
    .then((res: any) => console.log("successfully create a table Persons"))
    .catch((e: any) => console.error(e.stack));
};
