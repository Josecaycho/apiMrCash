const CryptoJS = require('crypto-js');
const moment = require('moment');
const connection = require('../../database');
const {uploadFileValidate,getFiles, getFile, uploadFileOrder } = require('./../../s3.js')

const models = require("../models/index");
const order = require('../models/order.js');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const key = 'SECRET_PASSWORD';

const encyptPasswordAES = (password, secret) => {
	return CryptoJS.AES.encrypt(password, secret).toString()
}

const login = async (req, res) => {
	try {
		console.log(req)
		const data = req.body;
		console.log(data)
		const [result] = await connection.query("call login_user(?)", [data.dni])
		if(result[0].length > 0) {
			const user = result[0]
			for (let i = 0; i < user.length; i++) {
				user[i].dataBank = await models.userBank.findAll({
					where: {
						mrc_user_id: user[i].id
					},
					include: [
						{ model: models.bank },
						{ model: models.typesAccount }
					]
				})
			}
			const decryptedPasswordConection = CryptoJS.AES.decrypt(user[0].password, key)
			const decryptedPasswordRequest = CryptoJS.AES.decrypt(data.password, key)
			if(decryptedPasswordConection.toString(CryptoJS.enc.Utf8) === decryptedPasswordRequest.toString(CryptoJS.enc.Utf8)) {
				res.status(200).json({success: true, data: user[0],code: 200, message: 'Usuario logeado correctamente'})
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
			res.status(200).json({success: true, message: "success", data: result[0], code: 200})	
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
					await connection.query("UPDATE mrc_user SET passwordToken = ? ,passwordTimeToken = ?  WHERE email = ?", [token,timeToken,data.email]).then(async (dt) => {
						res.status(200).json({success: true, message: "Solicitud enviada correctamente", data: {token: token}, code: 200})
					})
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
	const token = data.token.replace(/ /g, "+")
	const [result] = await connection.query("call mrcash.restore_password(?,?)", [token, data.password])
	console.log(result[0][0], 'resu')
	if(result[0].length > 0) {
		if(!result[0][0].respuesta)
			res.status(200).json({success: true, message: "success", data: result[0][0], code: 200})
		else res.status(400).json({success: false, message: "Token Inactivo", data: null, code: 400})
	}else {
		res.status(400).json({success: false, message: "Token Inactivo error", data: null, code: 400})
	}
}

const validateDataUser = async (req, res) => {
	const data = req.body
	const token = req.token
	const [result] = await connection.query("call save_image_state_history(?,?,?,?)", [token, data.img1, data.img2, data.type])
	if (result.length > 0) {
		res.status(200).json({success: true, message: "success", data: null, code: 200})	
	}else {
		res.status(400).json({success: false, message: "Token Inactivo", data: null, code: 400})
	}
}

const sendImageValidate = async (req, res) => {
	const tokenSearch = req.token
	const dniUser = await models.user.findOne({
		where: {
			token: tokenSearch
		}
	})
	const file = req.files[0]
	const result = await uploadFileValidate(file, dniUser.dni)
	if(result.result.$metadata.httpStatusCode === 200) 
		res.status(200).json({success: true, message: "success", data: {Key: result.key}, code: 200})
}

const validateDataBank = async (req, res) => {
	const data = req.body
	const token = req.token

	await connection.query("call new_bank(?,?,?,?,?,?,?,?)", [
		token,
		data.mrc_bank_id,
		data.mrc_type_account_id,
		data.number_account,
		data.alias_account,
		data.typeMoney,	
		data.accountHolder,
		data.id
	]).then(async (dt) => {
		let data = dt[0][0]
		for (let i = 0; i < data.length; i++) {
			data[i].dataBank = await models.bank.findOne({
				where: {
						id: data[i].mrc_bank_id
				}
			})
		}
		res.status(200).json({success: true, message: "success", data: data, code: 200})
	})
}

const listBanksUser = async (req, res) => {
	const token = req.token
	await connection.query("call get_banks_user(?)", [token]).then(async (dt) => {
		let data = dt[0][0]
		for (let i = 0; i < data.length; i++) {
			data[i].dataBank = await models.bank.findOne({
				where: {
						id: data[i].mrc_bank_id
				}
			})
		}
		res.status(200).json({success: true, message: "success", data: data, code: 200})
	})
}

const deleteBankUser = async (req, res) => {
	const token = req.token
	const [result] = await connection.query("update mrc_user_banks set state = 1 where id = ?", [ req.params[0]])
	
	if (result) {
		res.status(200).json({success: true, message: "success", data: result[0], code: 200})	
	}else {
		res.status(400).json({success: false, message: "error", data: null, code: 400})
	}
}

const updateDataUser = async (req, res) => {
	const token = req.token
	const data = req.body
	const [result] = await connection.query("call update_data_user(?,?,?,?)", [token, data.emailv, data.nombresv, data.apellidosv])
	if (result.length > 0) {
		res.status(200).json({success: true, message: "success", data: result[0], code: 200})	
	}else {
		res.status(400).json({success: false, message: "error", data: null, code: 400})
	}
}
const generateUrl = async (req, res) => {
	const token = req.token
	const fileView = req.body
	const result = getFile(`${fileView.img}`)
}

const listOrders = async (req, res) => {
	const token = req.token
	const {page, size, monto} = req.query
	const userId = await models.user.findOne({
		where: {
			token: token
		}
	})
	const dataOrder = await models.order.findAndCountAll({
		limit: parseInt(size),
		offset: page * size,
		where: {
			mrc_user_id: userId.id,
			state: 1,
			monto_send: {
				[Op.like]: `%${monto}%`
			}
		},
		include: [
			{
				model: models.bank
			},
			{
				model: models.userBank,
				include: [
					{
						model: models.bank
					}
				]
			}
		]
	})
	res.status(200).json({success: true, message: "success", data: dataOrder, code: 200})
}

const newOrder = async (req, res) => {
	const token = req.token
	const data = req.body
	const [result] = await connection.query("call generate_new_order(?,?,?,?,?,?)", [token, data.bank, data.bankUser, data.send, data.receive, data.comision])
	if (result.length > 0) {
		res.status(200).json({success: true, message: "success", data: result[0], code: 200})	
	}else {
		res.status(400).json({success: false, message: "error", data: null, code: 400})
	}
}

const finalyOrder = async (req, res) => {
	const token = req.token
	const order = req.params
	console.log(order)
	try {
		await models.order.update(
			{ state: 1},
			{
				where: {
					codigo: order.orden
				}
			}
		)	
		res.status(200).json({success: true, message: "success", data: [], code: 200})
	} catch (error) {
		
	}
}

const sendImageOrder = async (req, res) => {
	const tokenSearch = req.token
	const order = req.params
	const dniUser = await models.user.findOne({
		where: {
			token: tokenSearch
		}
	})
	const file = req.files[0]
	const result = await uploadFileOrder(file, dniUser.dni)
	if(result.result.$metadata.httpStatusCode === 200) {
		try {
			await models.order.update(
				{ img: `vaucher/${dniUser.dni}/${result.key}`},
				{
					where: {
						codigo: order.orden
					}
				}
			)	
			res.status(200).json({success: true, message: "success", data: {Key: result.key}, code: 200})
		} catch (error) {
			
		}
	}
}

const banks = async (req, res) => {
	let banks = await models.bank.findAll({
		include: [
			{
				model: models.typesAccount
			}
		]
	})
	return res.status(200).json({success: true, message: "success", data: banks, code: 200})	
}

const typeAccounts = async (req, res) => {
	const idBank = req.params
	let types = await models.typesAccount.findOne({
		where: {
			mrc_bank_id: idBank.bank
		},
		include: [
			{
				model: models.bank
			}
		]
	})
	return res.status(200).json({success: true, message: "success", data: types, code: 200})	
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
	deleteBankUser,
	updateDataUser,
	sendImageValidate,
	generateUrl,
	listOrders,
	banks,
	newOrder,
	sendImageOrder,
	finalyOrder,
	typeAccounts
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