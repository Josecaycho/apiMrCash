import { getConnection } from "../database/database";

const getCampanias = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT DATE_FORMAT(fecha_inicio, '%d/%m/%Y') as fecha_inicio, anio , DATE_FORMAT(fecha_fin, '%d/%m/%Y') as fecha_fin, name, id FROM campanias");

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

const addCampanias = async (req, res) => {
    try {
        const { name, anio, fecha_inicio, fecha_fin } = req.body;

        if (name === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const campania = { name, anio, fecha_inicio, fecha_fin };
        const connection = await getConnection();
        await connection.query("INSERT INTO campanias SET ?", campania);
        res.json({ message: "campania agregada" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateCampanias = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, anio, fecha_inicio, fecha_fin } = req.body;

        if (id === undefined || name === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const campania = { name, anio, fecha_inicio, fecha_fin };
        const connection = await getConnection();
        const result = await connection.query("UPDATE campanias SET ? WHERE id = ?", [campania, id]);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteCampanias = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM campanias WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const detalleCampania = async (req, res) => {
    try {
        const { id } = req.params
        const connection = await getConnection();
        const result = await connection.query(`CALL all_detalle_campania(${id})`);

        res.status(200).json({type: "success",data: result[0],code: 200})
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const detalleCampaniaPoda = async (req, res) => {
    try {
        const { id } = req.params
        const connection = await getConnection();
        const result = await connection.query(`CALL all_detalle_campania_poda(${id})`);

        res.status(200).json({type: "success",data: result[0] , code: 200})
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const detalleCampaniaFumigacion = async (req, res) => {
    try {
        const { id } = req.params
        const connection = await getConnection();
        const result = await connection.query(`CALL all_detalle_campania_fumigacion(${id})`);

        res.status(200).json({type: "success",data: result[0] , code: 200})
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const detalleCampaniaAbonado = async (req, res) => {
    try {
        const { id } = req.params
        const connection = await getConnection();
        const result = await connection.query(`CALL all_detalle_campania_abonado(${id})`);

        res.status(200).json({type: "success",data: result[0] , code: 200})
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const detalleCampaniaCosecha = async (req, res) => {
    try {
        const { id } = req.params
        const connection = await getConnection();
        const result = await connection.query(`CALL all_detalle_campania_campania(${id})`);

        res.status(200).json({type: "success",data: result[0] , code: 200})
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const todoslostiposPoda = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM campania_tipo_podas`);

        res.status(200).json(
            {
                type: "success",
                data: {
                    poda: result
                }, 
                code: 200
            }
        )
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const formasFumigacion = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM fumigacion_formas`);

        res.status(200).json(
            {
                type: "success",
                data: result,
                code: 200
            }
        )
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const tiposFumigacion = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM fumigacion_tipos`);

        res.status(200).json(
            {
                type: "success",
                data: result,
                code: 200
            }
        )
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const tiposCosecha = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM campania_cosecha_tipo`);

        res.status(200).json(
            {
                type: "success",
                data: result,
                code: 200
            }
        )
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const materialesFumigacion = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM fumigacion_materiales`);

        res.status(200).json(
            {
                type: "success",
                data: result,
                code: 200
            }
        )
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const materialesAbonado = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM abonado_materiales`);

        res.status(200).json(
            {
                type: "success",
                data: result,
                code: 200
            }
        )
    }catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addCampaniaRiego = async (req, res) => {
    try {
        const { campania_id, fecha_regado, trabajadores, jornales, costo } = req.body;

        if (fecha_regado === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const poda = { campania_id, fecha_regado, trabajadores, jornales, costo };
        const connection = await getConnection();
        await connection.query("INSERT INTO campania_regado SET ?", poda);
        res.json({ message: "poda agregada" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateCampaniaRiego = async (req, res) => {
    try {
        const { id } = req.params;
        const { campania_id, fecha_regado, trabajadores, jornales, costo } = req.body;

        if (id === undefined || fecha_regado === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const poda = { campania_id, fecha_regado, trabajadores, jornales, costo };
        const connection = await getConnection();
        const result = await connection.query("UPDATE campania_regado SET ? WHERE id = ?", [poda, id]);
        res.json({ message: "poda Editada" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addCampaniaPoda = async (req, res) => {
    try {
        const { campania_id, fecha_poda, fecha_fin_poda, fecha_limpieza, fecha_fin_limpieza, trabajadores, trabajadores_limpieza, jornales, jornales_limpieza, costo, costo_limpieza, campania_tipo_poda_id } = req.body;

        if (fecha_poda === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const poda = { campania_id, fecha_poda, fecha_fin_poda, fecha_limpieza, fecha_fin_limpieza, trabajadores, trabajadores_limpieza, jornales, jornales_limpieza, costo, costo_limpieza, campania_tipo_poda_id };
        const connection = await getConnection();
        await connection.query("INSERT INTO campania_poda SET ?", poda);
        res.json({ message: "poda agregada" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateCampaniaPoda = async (req, res) => {
    try {
        const { id } = req.params;
        const { campania_id, fecha_poda, fecha_fin_poda, fecha_limpieza, fecha_fin_limpieza, trabajadores, trabajadores_limpieza, jornales, jornales_limpieza, costo, costo_limpieza, campania_tipo_poda_id } = req.body;

        if (id === undefined || fecha_poda === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const poda = { campania_id, fecha_poda, fecha_fin_poda, fecha_limpieza, fecha_fin_limpieza, trabajadores, trabajadores_limpieza, jornales, jornales_limpieza, costo, costo_limpieza, campania_tipo_poda_id };
        const connection = await getConnection();
        const result = await connection.query("UPDATE campania_poda SET ? WHERE id = ?", [poda, id]);
        res.json({ message: "poda Editada" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};


const addCampaniaFumigacion = async (req, res) => {
    try {
        const { campania_id, fecha_fumigacion, trabajadores, jornales, costo, fumigacion_tipo_id,fumigacion_forma_id,all_materiales } = req.body;

        if (fecha_fumigacion === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const fumigacion = { campania_id, fecha_fumigacion, trabajadores, jornales, costo, fumigacion_tipo_id,fumigacion_forma_id};
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO campania_fumigacion SET ?", fumigacion);

        const campania_fumigacion_id = result.insertId
        const materiales = all_materiales
        for (let i = 0; i < materiales.length; i++) {
            const { cantidad_material,fumigacion_materiales_id } = materiales[i]
            const conte_materiales =  { cantidad_material,fumigacion_materiales_id,campania_fumigacion_id ,dosis}
            await connection.query("INSERT INTO fumigacion_materiales_campania SET ?",conte_materiales);
        }

        res.json({ message: "poda agregada" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateCampaniaFumigacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { campania_id, fecha_fumigacion, trabajadores, jornales, costo, fumigacion_tipo_id,fumigacion_forma_id,all_materiales, material_borrado } = req.body;

        if (id === undefined || fecha_fumigacion === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const fumigacion = { campania_id, fecha_fumigacion, trabajadores, jornales, costo, fumigacion_tipo_id,fumigacion_forma_id};
        const connection = await getConnection();
        const result = await connection.query("UPDATE campania_fumigacion SET ? WHERE id = ?", [fumigacion, id]);

        const materiales = all_materiales
        for (let i = 0; i < materiales.length; i++) {
            const { cantidad_material,fumigacion_materiales_id,campania_fumigacion_id,dosis } = materiales[i]
            const conte_materiales =  { cantidad_material,fumigacion_materiales_id,campania_fumigacion_id,dosis }
            if(materiales[i].id !== null){
                await connection.query("UPDATE fumigacion_materiales_campania SET ? WHERE id = ?", [conte_materiales, materiales[i].id ]);
            }else{
                await connection.query("INSERT INTO fumigacion_materiales_campania SET ?",conte_materiales);
            }
        }

        const eliminado = material_borrado
        for (let i = 0; i < eliminado.length; i++) {
            await connection.query("DELETE FROM fumigacion_materiales_campania WHERE id = ?", eliminado[i].id);   
        }        

        res.json({ message: "fumigacion Editada" });


    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addCampaniaAbonado = async (req, res) => {
    try {
        const { campania_id, fecha_abonado,fecha_abonado_fin, trabajadores, jornales, costo, all_materiales } = req.body;

        if (fecha_abonado === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const abonado = { campania_id, fecha_abonado,fecha_abonado_fin, trabajadores, jornales, costo};
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO campania_abonado SET ?", abonado);

        const campania_abonado_id = result.insertId
        const materiales = all_materiales
        for (let i = 0; i < materiales.length; i++) {
            const { cantidad_material,abonado_materiales_id } = materiales[i]
            const conte_materiales =  { cantidad_material,abonado_materiales_id,campania_abonado_id }
            await connection.query("INSERT INTO abonado_materiales_campania SET ?",conte_materiales);
        }

        res.json({ message: "poda agregada" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateCampaniaAbonado = async (req, res) => {
    try {
        const { id } = req.params;
        const { campania_id, fecha_abonado,fecha_abonado_fin, trabajadores, jornales, costo,all_materiales, material_borrado } = req.body;

        if (id === undefined || fecha_abonado === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const abonado = { campania_id, fecha_abonado,fecha_abonado_fin, trabajadores, jornales, costo};
        const connection = await getConnection();
        const result = await connection.query("UPDATE campania_abonado SET ? WHERE id = ?", [abonado, id]);

        const materiales = all_materiales
        for (let i = 0; i < materiales.length; i++) {
            const { cantidad_material,abonado_materiales_id,campania_abonado_id } = materiales[i]
            const conte_materiales =  { cantidad_material,abonado_materiales_id,campania_abonado_id }
            if(materiales[i].id !== null){
                await connection.query("UPDATE abonado_materiales_campania SET ? WHERE id = ?", [conte_materiales, materiales[i].id ]);
            }else{
                await connection.query("INSERT INTO abonado_materiales_campania SET ?",conte_materiales);
            }
        }

        const eliminado = material_borrado
        for (let i = 0; i < eliminado.length; i++) {
            await connection.query("DELETE FROM abonado_materiales_campania WHERE id = ?", eliminado[i].id);   
        }        

        res.json({ message: "abonado Editada" });


    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};


const addCampaniaCosecha = async (req, res) => {
    try {
        const { campania_id, fecha_cosecha, all_materiales, precio, trabajadores } = req.body;

        if (fecha_cosecha === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const cosecha = { campania_id, fecha_cosecha, precio, trabajadores};
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO campania_cosecha SET ?", cosecha);

        const campania_cosecha_id = result.insertId
        const materiales = all_materiales
        for (let i = 0; i < materiales.length; i++) {
            const { cantidad_cosecha, campania_cosecha_tipo_id, variedad_id, costo } = materiales[i]
            const conte_materiales =  { cantidad_cosecha,campania_cosecha_id, campania_cosecha_tipo_id, variedad_id, costo }
            await connection.query("INSERT INTO campania_cosecha_variedad SET ?",conte_materiales);
        }

        res.json({ message: "poda agregada" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateCampaniaCosecha = async (req, res) => {
    try {
        const { id } = req.params;
        const { campania_id, fecha_cosecha,all_materiales, material_borrado, precio, trabajadores } = req.body;

        if (id === undefined || fecha_cosecha === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const cosecha = { campania_id, fecha_cosecha, precio, trabajadores};
        const connection = await getConnection();
        const result = await connection.query("UPDATE campania_cosecha SET ? WHERE id = ?", [cosecha, id]);

        const materiales = all_materiales
        for (let i = 0; i < materiales.length; i++) {
            const { cantidad_cosecha,campania_cosecha_id, campania_cosecha_tipo_id, variedad_id, costo } = materiales[i]
            const conte_materiales =  { cantidad_cosecha,campania_cosecha_id, campania_cosecha_tipo_id, variedad_id, costo }
            if(materiales[i].id !== null){
                await connection.query("UPDATE campania_cosecha_variedad SET ? WHERE id = ?", [conte_materiales, materiales[i].id ]);
            }else{
                await connection.query("INSERT INTO campania_cosecha_variedad SET ?",conte_materiales);
            }
        }

        const eliminado = material_borrado
        for (let i = 0; i < eliminado.length; i++) {
            await connection.query("DELETE FROM campania_cosecha_variedad WHERE id = ?", eliminado[i].id);   
        }        

        res.json({ message: "abonado Editada" });


    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getCampanias,
    addCampanias,
    updateCampanias,
    deleteCampanias,
    detalleCampania,
    detalleCampaniaPoda,
    detalleCampaniaFumigacion,
    todoslostiposPoda,
    addCampaniaRiego,
    updateCampaniaRiego,
    addCampaniaPoda,
    updateCampaniaPoda,
    formasFumigacion,
    tiposFumigacion,
    materialesFumigacion,
    addCampaniaFumigacion,
    updateCampaniaFumigacion,
    materialesAbonado,
    detalleCampaniaAbonado,
    addCampaniaAbonado,
    updateCampaniaAbonado,
    detalleCampaniaCosecha,
    tiposCosecha,
    addCampaniaCosecha,
    updateCampaniaCosecha,
};
