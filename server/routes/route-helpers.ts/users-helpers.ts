import { client } from "../../src/index";

export const createUser = async (req: any, res: any) => {
  await client
    .query(
      `
        INSERT INTO users ("userName", "firebaseAuthId", "profileImgUrl")
        VALUES ('${req.body.userName}', '${req.body.firebaseAuthId}', '${req.body.profileImgUrl}');
      `
    )
    .then(() => res.send("you have successfully created a user"))
    .catch((e: any) => res.json({ error: e }));
};

export const deleteUser = async (req: any, res: any) => {
  await client
    .query(
      `
			DELETE FROM users WHERE "userId" = '${req.body.userId}';
		`
    )
    .then(() =>
      res.send("you have successfully deleted a user uid: " + req.body.userId)
    )
    .catch((e: any) => res.json({ error: e }));
};
