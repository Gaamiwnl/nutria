require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

client.connect()
    .then(() => {
        console.log("CONEXÃO OK!");
        return client.query("SELECT NOW()");
    })
    .then(result => {
        console.log(result.rows);
    })
    .catch(error => {
        console.error("ERRO:", error);
    })
    .finally(() => {
        client.end();
    });