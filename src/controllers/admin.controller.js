const connection = require('../../database');
const models = require("../models/index");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const users = async (req, res) => {
  const {page, size, text, state, startDate, endDate} = req.query
  let where = {}
  if(state) {
    where = {
      state: state,
      [Op.or]: [
        { nombres: { [Op.like]: `%${text}%` } },
        { apellidos: { [Op.like]: `%${text}%` } },
        { dni: { [Op.like]: `%${text}%` } }
      ]
    }
  }else {
    where = {
      [Op.or]: [
        { nombres: { [Op.like]: `%${text}%` } },
        { apellidos: { [Op.like]: `%${text}%` } },
        { dni: { [Op.like]: `%${text}%` } }
      ]
    }
  }

	let result = await models.user.findAndCountAll({
    limit: parseInt(size),
    offset: page * size,
    where
  })
	return res.status(200).json({success: true, message: "success", data: result, code: 200})	
}

const userDetail = async (req, res) => {
  const data = req.params.idUser
  let result = await models.user.findOne({
    where: {
      id: parseInt(data),
    },
    include: [
      {
        model: models.userBank,
        where: {
          state: 0
        },
        include: [
					{
						model: models.bank
					},
          {
            model: models.typesAccount
          }
				]
      },
      {
        model: models.userFiles
      }
    ]
  })
  return res.status(200).json({success: true, message: "success", data: result, code: 200})	
}

const userUpdate = async (req, res) => {
  const data = req.body
  let result = await models.user.update(data, {
    where: {
      id: data.id
    }
  })
  if (result.length === 1) {
    return res.status(200).json({success: true, message: "success", data: null, code: 200})	
  } else res.status(400).json({success: false, message: "Error de al encontrar usuario", data: null, code: 400})
}

const ordenes = async (req, res) => {
  const {page, size, textUser,textOrden, state, startDate, endDate, lst} = req.query
  let stateFilter = []
  
  if(lst === 'orden'){
    stateFilter = [1,4,5]
  }else if(lst === 'devol'){
    stateFilter = [3,4]
  }else {
    stateFilter = [0,1,2]
  }

	let result = await models.order.findAndCountAll({
    limit: parseInt(size),
    offset: page * size,
    where :{
      state: {
        [Op.in]: state ? [state] : stateFilter
      },
      [Op.or]: [
        { codigo: { [Op.like]: `%${textOrden}%` } },
        { monto_send: { [Op.like]: `%${textOrden}%` } }
      ]
    },
    include: [
      {
				model: models.user,
        where: {
          [Op.or]: [
            { nombres: { [Op.like]: `%${textUser}%` } },
            { apellidos: { [Op.like]: `%${textUser}%` } },
            { dni: { [Op.like]: `%${textUser}%` } }
          ]
        }
			},
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
	return res.status(200).json({success: true, message: "success", data: result, code: 200})	
}

const ordenDetail = async (req, res) => {
  const data = req.params.idOrden
  let result = await models.order.findOne({
    where: {
      id: parseInt(data),
    },
    include: [
      {
        model: models.bank,
      },
      {
        model: models.bankUser,
      },
      {
        model: models.user,
      },
      {
        model: models.typesAccount
      }
    ]
  })
  return res.status(200).json({success: true, message: "success", data: result, code: 200})	
}

module.exports = {
	users,
  userDetail,
  userUpdate,
  ordenes,
  ordenDetail
}