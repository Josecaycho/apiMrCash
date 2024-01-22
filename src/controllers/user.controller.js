import CryptoJS from 'crypto-js'
import { getConnection } from "../database/database.js";
import moment from 'moment';

const key = 'SECRET_PASSWORD';

const encyptPasswordAES = (password, secret) => {
	return CryptoJS.AES.encrypt(password, secret).toString()
}

const login = async (req, res) => {
	try {
		const data = req.body;
		const connection = await getConnection();
		await connection.query("SELECT * FROM mrc_user where dni = ?", data.dni, (err, result) => {
			if(result.length > 0) {
				const decryptedPasswordConection = CryptoJS.AES.decrypt(result[0].password, key)
				const decryptedPasswordRequest = CryptoJS.AES.decrypt(data.password, key)
				if(decryptedPasswordConection.toString(CryptoJS.enc.Utf8) === decryptedPasswordRequest.toString(CryptoJS.enc.Utf8)) {
					res.status(200).json({success: true, data: result[0],code: 200, message: 'Usuario logeado correctamente'})
				}else {
					res.status(400).json({success: false, data: null,code: 400, message: 'Contraseña incorrecta'})
				}
			} else {
				res.status(400).json({success: false, data: null,code: 400, message: 'Usuario No existe'})
			}
		})
		
	} catch (error) {
			res.status(500);
			res.send(error.message);
	}
}

const stateUser = async (req, res) => {
	try {
		const token = req.token
		const connection = await getConnection();
		await connection.query("call validate_state_user(?)", [token], (err, result) => {
			if (result.length > 0) {
				res.status(200).json({success: true, message: "Correcto", data: result[0], code: 200})	
			}else {
				res.status(400).json({success: false, message: "Token Inactivo", data: null, code: 400})
			}
		})
	} catch (error) {
		
	}
}

const validateDni = async (req, res) => {
	res.json('este es mi api de validacion')
}

const register = async (req, res) => {
	try {
		const data = req.body;
		let hashed = ''
		if (data.dni !== '' && data.password !== '') {
			hashed = encyptPasswordAES(data.password, 'SECRET_PASSWORD')
		}
		const token = encyptPasswordAES(`${data.password}${data.nombres}`, 'SECRET_TOKEN')
		const user = {  ...data, password: hashed, token };
		const connection = await getConnection();
		await connection.query("SELECT * FROM mrc_user where dni = ?", data.dni, async (err, result) => {
			if(result.length > 0) {
				res.status(400).json({success: false, message: "Usuario ya existente", data: null, code: 400})	
			}else {
				try {
						await connection.query("call new_user(?,?,?,?,?,?,?,?,?,?)", [user.dni, user.nombres, user.apellidos, user.email, user.phone, user.password, user.politic_person, user.t_c, user.politic_data, user.token], (err, result) => {
						res.status(200).json({success: true, message: "Usuario Creado Correctamente", data: null, code: 200})
					});
				} catch (error) {
					res.status(400).json({success: false, message: "Error", data: null, code: 400})
				}
				
			}
		})
		
	} catch (error) {
			res.status(500);
			res.send(error.message);
	}
}

const recoveryPassword = async (req, res) => {
	try {
		const data = req.body
		const connection = await getConnection();
		await connection.query("SELECT * FROM mrc_user where email = ?", data.email, async (err, result) => {
			if(result.length > 0) {
				const token = encyptPasswordAES(`${result[0].token}`, 'TOKEN_RESET_PASSWORD')
				const timeToken = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
				try {
					await connection.query("UPDATE mrc_user SET ? WHERE email = ?", [{passwordToken: token ,passwordTimeToken: timeToken }, data.email], (err, result) => {
						res.status(200).json({success: true, message: "Solicitud enviada correctamente", data: null, code: 200})		
					})
				} catch (error) {
					
				}
			} else {
				res.status(400).json({success: false, message: "Correo no existente", data: null, code: 400})
			}
		})
	} catch (error) {
		
	}
}

const restorePassword = async (req, res) => {
	const data = req.body
	const connection = await getConnection()
	await connection.query("call restore_password(?,?)", [data.token, data.password], (err, result) => {
		console.log(result)
		if (result.length > 0) {
			res.status(200).json({success: true, message: "Correcto", data: null, code: 200})	
		}else {
			res.status(400).json({success: false, message: "Token Inactivo", data: null, code: 400})
		}
	})
}

const validateDataUser = async (req, res) => {
	const data = req.body
	const token = req.token
	const connection = await getConnection()
	await connection.query("call save_image_state_history(?,?,?,?)", [token, data.img1, data.img2, data.type], (err, result) => {
		console.log(result.length, 'result')
		if (result.length > 0) {
			res.status(200).json({success: true, message: "Correcto", data: null, code: 200})	
		}else {
			res.status(400).json({success: false, message: "Token Inactivo", data: null, code: 400})
		}
	})
}

const validateDataBank = async (req, res) => {
	const data = req.body
	const token = req.token
	const connection = await getConnection()
	await connection.query("call new_bank(?,?,?,?,?,?,?)", [
		token,
		data.bank,
		data.typeAccount,
		data.numberAccount,
		data.aliasAccount,
		data.typeMoney,	
		data.accountHolder
	], (err, result) => {
		console.log(result.length, 'result')
		if (result.length > 0) {
			res.status(200).json({success: true, message: "Correcto", data: null, code: 200})	
		}else {
			res.status(400).json({success: false, message: "Ocurrio un error", data: null, code: 400})
		}
	})
}

export const methods = {
	login,
	register,
	stateUser,
	recoveryPassword,
	restorePassword,
	validateDni,
	validateDataUser,
	validateDataBank
};