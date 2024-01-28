const CryptoJS = require('crypto-js');
const moment = require('moment');
const connection = require('../../database');

const key = 'SECRET_PASSWORD';

const encyptPasswordAES = (password, secret) => {
	return CryptoJS.AES.encrypt(password, secret).toString()
}

const login = async (req, res) => {
	try {
		const data = req.body;
		console.log(data)
		const [result] = await connection.query("SELECT * FROM mrcash.mrc_user where dni = ? ", data.dni)
		console.log(result)
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
		
	} catch (error) {
			res.status(500);
			res.send(error.message);
	}
}

const stateUser = async (req, res) => {
	try {
		const token = req.token
		const [result] = await connection.query("call validate_state_user(?) ", [token])
		if (result.length > 0) {
			res.status(200).json({success: true, message: "Correcto", data: result[0], code: 200})	
		}else {
			res.status(400).json({success: false, message: "Token Inactivo", data: null, code: 400})
		}
	} catch (error) {
		
	}
}

const validateDni = async (req, res) => {
	// res.json('este es mi api sdsd')
	try {
		const data = req.params[0]
		const [result] = await connection.query("call validate_dni(?) ", [data])
		console.log(result)
		if(result[0].length > 0) {
			res.status(400).json({success: false, message: "DNI ya existente", data: null, code: 400})
		}else{
			res.status(200).json({success: true, message: "Validado", data: null, code: 200})
		}
	} catch (error) {
		
	}
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
		const [result] = await connection.query('CALL mrcash.new_user(?,?,?,?,?,?,?,?,?,?) ', [user.dni, user.nombres, user.apellidos, user.email, user.phone, user.password, user.politic_person, user.t_c, user.politic_data, user.token])
		if(result[0].length > 0) {
			res.status(200).json({success: true, message: "Usuario Creado Correctamente", data: null, code: 200})
		}
	} catch (error) {
		console.log('error')
		res.status(400).json({success: false, message: "Error", data: null, code: 400})
	}
}

const recoveryPassword = async (req, res) => {
	try {
		const data = req.body
		const [result] = await connection.query("SELECT * FROM mrc_user where email = ?", data.email)
			if(result.length > 0) {
				const token = encyptPasswordAES(`${result[0].token}`, 'TOKEN_RESET_PASSWORD')
				const timeToken = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
				try {
					const [result] = await connection.query("UPDATE mrc_user SET ? WHERE email = ?", [{passwordToken: token ,passwordTimeToken: timeToken }, data.email])
					if(result.length > 0) {
						res.status(200).json({success: true, message: "Solicitud enviada correctamente", data: null, code: 200})		
					}
				} catch (error) {
					
				}
			} else {
				res.status(400).json({success: false, message: "Correo no existente", data: null, code: 400})
			}
	} catch (error) {
		
	}
}

const restorePassword = async (req, res) => {
	const data = req.body
	const [result] = await connection.query("call restore_password(?,?)", [data.token, data.password])
	if (result.length > 0) {
		res.status(200).json({success: true, message: "Correcto", data: null, code: 200})	
	}else {
		res.status(400).json({success: false, message: "Token Inactivo", data: null, code: 400})
	}
}

const validateDataUser = async (req, res) => {
	const data = req.body
	const token = req.token
	console.log(data)
	const [result] = await connection.query("call save_image_state_history(?,?,?,?)", [token, data.img1, data.img2, data.type])
	if (result.length > 0) {
		res.status(200).json({success: true, message: "Correcto", data: null, code: 200})	
	}else {
		res.status(400).json({success: false, message: "Token Inactivo", data: null, code: 400})
	}
}

const validateDataBank = async (req, res) => {
	const data = req.body
	const token = req.token
	const [result] = await connection.query("call new_bank(?,?,?,?,?,?,?,?)", [
		token,
		data.mrc_bank_id,
		data.mrc_type_account_id,
		data.number_account,
		data.alias_account,
		data.typeMoney,	
		data.accountHolder,
		data.id
	]) 

	if (result.length > 0) {
		res.status(200).json({success: true, message: "Correcto", data: null, code: 200})	
	}else {
		res.status(400).json({success: false, message: "Ocurrio un error", data: null, code: 400})
	}
}

const listBanksUser = async (req, res) => {
	const token = req.token
	const [result] = await connection.query("call get_banks_user(?)", [token])

	if (result.length > 0) {
		res.status(200).json({success: true, message: "Correcto", data: result[0], code: 200})	
	}else {
		res.status(400).json({success: false, message: "Ocurrio un error", data: null, code: 400})
	}
}

const deleteBankUser = async (req, res) => {
	const token = req.token
	const [result] = await connection.query("update mrc_user_banks set state = 0 where id = ?", [ req.params[0]])
	
	if (result) {
		res.status(200).json({success: true, message: "Correcto", data: result[0], code: 200})	
	}else {
		res.status(400).json({success: false, message: "Ocurrio un error", data: null, code: 400})
	}
}

module.exports = {
	login,
	register,
	stateUser,
	recoveryPassword,
	restorePassword,
	validateDni,
	validateDataUser,
	validateDataBank,
	listBanksUser,
	deleteBankUser
}

// export const methods = {
// 	login,
// 	register,
// 	stateUser,
// 	recoveryPassword,
// 	restorePassword,
// 	validateDni,
// 	validateDataUser,
// 	validateDataBank
// };