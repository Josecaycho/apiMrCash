import { getConnection } from "../database/database";

const getVariedad = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT *FROM variedad");

        let json = {
            type: "success",
            data: result,
            code: 200
        }
        res.json(json);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addVariedad = async (req, res) => {
    try {
        const { name } = req.body;

        if (name === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const campania = { name };
        const connection = await getConnection();
        await connection.query("INSERT INTO variedad SET ?", campania);
        res.json({ message: "variedad agregada" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateVariedad = async (req, res) => {
    try {
        const { id } = req.params;
        const { name} = req.body;

        if (id === undefined || name === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const campania = { name};
        const connection = await getConnection();
        const result = await connection.query("UPDATE variedad SET ? WHERE id = ?", [campania, id]);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteVariedad = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM variedad WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getVariedad,
    addVariedad,
    updateVariedad,
    deleteVariedad
};
