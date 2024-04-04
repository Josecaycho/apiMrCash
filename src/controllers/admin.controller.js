const connection = require('../../database');
const models = require("../models/index");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const users = async (req, res) => {
  const {page, size, text, state, startDate, endDate,comission} = req.query
  let whereState = {}
  let whereComission = {}
  let whereDates = {}
  if(state) {
    where = {
      state: state,
    }
  }

  if(comission) {
    whereComission = {
      comision: { [Op.in]: [comission]},
    }
  }

  if(startDate || endDate) {
    whereDates = {
        creation_date: {
        [Op.between] : [startDate , endDate ]
      }
    }
  }

	let result = await models.user.findAndCountAll({
    limit: parseInt(size),
    offset: page * size,
    where: {
      ...whereState,
      [Op.or]: [
        { nombres: { [Op.like]: `%${text}%` } },
        { apellidos: { [Op.like]: `%${text}%` } },
        { dni: { [Op.like]: `%${text}%` } }
      ],
      ...whereComission,
      ...whereDates
    }
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
    const [result] = await connection.query("call validate_dni(?) ", [data.dni])
    if(result[0].length > 0) {
      res.status(400).json({success: false, message: "DNI ya existente", data: null, code: 400})
    }else{
      let result = await models.user.update(data, {
        where: {
          id: data.id
        }
      })
      return res.status(200).json({success: true, message: "success", data: null, code: 200})	
    }
}

const ordenes = async (req, res) => {
  const {page, size, textUser,textOrden, state, startDate, endDate, lst} = req.query
  let stateFilter = []
  let whereDates = {}
  
  if(lst === 'orden'){
    stateFilter = [1,4,5]
  }else if(lst === 'devol'){
    stateFilter = [3,4]
  }else {
    stateFilter = [0,1,2]
  }

  console.log()

  if(startDate || endDate) {
    whereDates = {
      create_date: {
        [Op.between] : [new Date(startDate).toISOString() , new Date(endDate).toISOString() ]
      }
    }
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
      ],
      ...whereDates
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
        attributes: ['nombres', 'apellidos','dni','email','comision','phone'], 
      },
      {
        model: models.typesAccount
      },
      {
        model: models.historyOrder,
        include: [
					{
						model: models.user,
            attributes: ['nombres', 'apellidos'], 
					}
				]
      }
    ]
  })
  return res.status(200).json({success: true, message: "success", data: result, code: 200})	
}

const updateStatusOrder = async (req, res) => {
  let dt = new Date()
  let day = dt.getDate()
  let month = dt.getMonth()
  let year = dt.getFullYear()
  let dateNow = `${year}-${month + 1}-${day}`
  const tokenSearch = req.token
  const data = req.body
  const {idOrden} = req.params
  try {
    const userId = await models.user.findOne({
      where: {
        token: tokenSearch
      }
    })
    await models.order.update(data, {
      where: {
        id: idOrden
      }
    })
    await models.historyOrder.create({mrc_user_id: userId.id,mrc_order_id: idOrden, create_date: dateNow, state_order: data.state, obs: data.obs })
    return res.status(200).json({success: true, message: "success", data: null, code: 200})	
  } catch (error) {
    
  }
}

const dataEstadistic = async (req, res) => {
  try {
    const data = req.body
    if(data.bank === 0){
      const banks = await models.bank.findAll()
      for (let i = 0; i < banks.length; i++) {
        const [result] = await connection.query("call data_grafic(?,?,?,?)", [data.year, data.monthInicial, data.monthFinal,banks[i].id])
        banks[i].dataValues.contentInfo = result[0][0]
      }
      return res.status(200).json({success: true, message: "success", data: banks, code: 200})	 
    }else{
      const banks = await models.bank.findOne({
        where: {
          id: data.bank
        }
      })
      const [result] = await connection.query("call data_grafic(?,?,?,?)", [data.year, data.monthInicial, data.monthFinal,data.bank])
      return res.status(200).json({success: true, message: "success", data: [{...banks.dataValues, contentInfo: result[0][0]}], code: 200})	 
    }
  } catch (error) {
    
  }
}

module.exports = {
	users,
  userDetail,
  userUpdate,
  ordenes,
  ordenDetail,
  updateStatusOrder,
  dataEstadistic
}