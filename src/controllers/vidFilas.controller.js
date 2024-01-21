import { getConnection } from "../database/database";

const getFilas = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("CALL all_filas()");
        console.log(result[0])

        let json = {
            type: "success",
            data: result[0],
            code: 200
        }
        res.json(json);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addFilas = async (req, res) => {
    try {
        const { name, cantidad } = req.body;

        if (name === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const campania = { name, cantidad };
        const connection = await getConnection();
        await connection.query("INSERT INTO filas SET ?", campania);
        res.json({ message: "Filas agregada" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateFilas = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, cantidad} = req.body;

        if (id === undefined || name === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const campania = { name, cantidad };
        const connection = await getConnection();
        const result = await connection.query("UPDATE filas SET ? WHERE id = ?", [campania, id]);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteFilas = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM filas WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addVariedadfilas = async (req, res) => {
    try {
        const { id, fila_id, variedad_id, cantidad} = req.body;

        if (fila_id === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const campania = { id, fila_id, variedad_id, cantidad };
        const connection = await getConnection();
        if(id == null){
            const result = await connection.query("INSERT INTO variedad_fila SET ?", campania);
            res.json(result);
        }else {
            const result = await connection.query("UPDATE variedad_fila SET ? WHERE id = ?", [campania, campania.id]);
            res.json(result);
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const deleteFilasVariedad = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM variedad_fila WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getFilas,
    addFilas,
    updateFilas,
    deleteFilas,
    addVariedadfilas,
    deleteFilasVariedad
};
