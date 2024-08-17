import "dotenv/config.js";
import express from "express";

import { PostgresHelper } from "./src/db/postgres/helper.js";

const app = express();

app.use(express.json());

app.get("/api/users", async (req, res) => {
    const result = await PostgresHelper.query("SELECT * FROM users;");

    res.send(JSON.stringify(result));
});

app.post("/api/users", async (req, res) => {
    console.log(req.body);
    console.log(req.headers);
    res.status(200).send("User Created");
});

app.listen(process.env.PORT, () => console.log("Started DB"));
