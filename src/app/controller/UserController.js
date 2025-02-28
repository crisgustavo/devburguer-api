import { v4 } from 'uuid'
import * as Yup from 'yup'

import User from '../models/User'

class UserController {
  async store(req, res) {
    const schema = Yup.object({       //Esquema de validação de dados digitados no frontend
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      admin: Yup.boolean(),
    })

    try {
      schema.validateSync(req.body, { abortEarly: false })    //abortEarly é para continuar verificando e entregar todos os erros
    } catch (err) {
      return res.status(400).json({ error: err.errors }); //Se erro retorna mensagem
    }

    const { name, email, password, admin } = req.body;

    const userExist = await User.findOne({      //Procura a existencia de um registro igual
      where: {
        email
      }
    })

    if (userExist) return res.status(400).json({ error: 'User already exists'});    //Valida e retorna  

    const user = await User.create({ 
      id: v4(),
      name,
      email,
      password,
      admin
  })

  return res.status(201).json({id: user.id, name, email, admin})
  }
}

export default new UserController();