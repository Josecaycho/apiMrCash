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
  console.log(req.params.idUser,'body')
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

module.exports = {
	users,
  userDetail
}