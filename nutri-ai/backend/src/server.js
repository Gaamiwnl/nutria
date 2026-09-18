const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Nutri AI API funcionando!"
    });
});

app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Banco conectado!",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erro ao conectar ao banco"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});