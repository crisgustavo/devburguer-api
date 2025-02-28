import * as Yup from 'yup'
import { password } from '../../config/database';
import User from '../models/User';
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required()
    });

    const invalidResponse = () => {
      res.status(401).json({ error: 'email or password is not valid'})
    }

    try {
      schema.validateSync(req.body)
    } catch (err) {
      return invalidResponse();
    }

    const { email, password } = req.body

    const user = await User.findOne({
      where: {
        email
      }
    })

    if (!user) return invalidResponse();    //Valida email

    const isPasswordCorrect = await user.checkPassword(password)

    if (!isPasswordCorrect) return invalidResponse();   //Valida senha
    
    res.status(201).json({ 
      id: user.id, 
      name: user.name, 
      email, 
      admin: user.admin, 
      token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, { expiresIn: authConfig.expiresIn }),
    });
  }
}

export default new SessionController();