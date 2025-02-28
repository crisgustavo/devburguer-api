import * as Yup from 'yup'
import Category from '../models/Category';
import User from '../models/User';

class CategoryController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false })    //abortEarly é para continuar verificando e entregar todos os erros
    } catch (err) {
      return res.status(400).json({ error: err.errors }); //Se erro retorna mensagem
    }

    const { admin: isAdmin } = await User.findByPk(req.userId)

    if (!isAdmin) return res.status(401).json();

    const { filename: path } = req.file;
    const { name } = req.body;

    const categoryExist = await Category.findOne({      //Procura a existencia de um registro igual
      where: {
        name
      }
    })

    if (categoryExist) return res.status(400).json({ error: 'Category already exists'});

    const category = await Category.create({ 
      name,
      path
    });

    return res.status(201).json({id: category.id, name, path})
  };

  async index(req, res) {
    const category = await Category.findAll();

    return res.json(category)
  }

  async update(req, res) {
    const schema = Yup.object({
      name: Yup.string(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false })    //abortEarly é para continuar verificando e entregar todos os erros
    } catch (err) {
      return res.status(400).json({ error: err.errors }); //Se erro retorna mensagem
    }

    const { admin: isAdmin } = await User.findByPk(req.userId)

    if (!isAdmin) return res.status(401).json();

    const { id } = req.params

    const findCategory = await Category.findByPk(id)

    if (!findCategory) return res.status(400).json({ error: 'Make sure your Category ID is correct'})

    let path;
    if (req.file) path = req.file.filename

    const { name } = req.body;

    if (name) {
      const categoryExist = await Category.findOne({      //Procura a existencia de um registro igual
        where: {
          name
        }
      })
  
      if (categoryExist && categoryExist.id != id) return res.status(400).json({ error: 'Category already exists'});
    }

    await Category.update({ 
      name,
      path
    }, {
      where: {
        id
      }
    });

    return res.status(201).json({message: 'Product updated sucessfully!'})
  };
}

export default new CategoryController();