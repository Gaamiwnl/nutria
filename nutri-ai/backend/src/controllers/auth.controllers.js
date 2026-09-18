const bcrypt = require("bcrypt");
const pool = require("../config/database");
const { z } = require("zod");

const registerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6)
});

async function register(req, res) {
    try {
        const data = registerSchema.parse(req.body);

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [data.email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email já cadastrado"
            });
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
            [data.name, data.email, passwordHash]
        );

        return res.status(201).json({
            message: "Usuário criado com sucesso",
            user: result.rows[0]
        });

    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Dados inválidos",
                errors: error.issues
            });
        }

        console.error("Erro no cadastro:", error);

        return res.status(500).json({
            message: "Erro interno do servidor"
        });
    }
}

module.exports = {
    register
};