import { client } from "../src/index";

export const insertPerson = async () => {
  await client
    .query(
      `
        INSERT INTO Persons (PersonID, LastName, FirstName, Address, City)
        VALUES (133, 'Lin', 'Chia-Sheng', 'your Home', 'Norway');
    `
    )
    .then((res: any) => console.log("successfully insert a Person"))
    .catch((e: any) => console.error(e.stack));
};
