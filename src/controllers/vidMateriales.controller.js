import { getConnection } from "../database/database";

const getMateriales = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT *FROM fumigacion_materiales");

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

const addMateriales = async (req, res) => {
    try {
        const { name, observaciones } = req.body;

        if (name === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const campania = { name, observaciones };
        const connection = await getConnection();
        await connection.query("INSERT INTO fumigacion_materiales SET ?", campania);
        res.json({ message: "Materiales agregada" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateMateriales = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, observaciones} = req.body;

        if (id === undefined || name === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const campania = { name, observaciones};
        const connection = await getConnection();
        const result = await connection.query("UPDATE fumigacion_materiales SET ? WHERE id = ?", [campania, id]);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteMateriales = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM fumigacion_materiales WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getMateriales,
    addMateriales,
    updateMateriales,
    deleteMateriales
};
