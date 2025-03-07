import * as Yup from 'yup'
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

class ProductController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean()
    });

    try {
      schema.validateSync(req.body, { abortEarly: false })    //abortEarly é para continuar verificando e entregar todos os erros
    } catch (err) {
      return res.status(400).json({ error: err.errors }); //Se erro retorna mensagem
    }

    const { admin: isAdmin } = await User.findByPk(req.userId)

    if (!isAdmin) return res.status(401).json();

    const { filename: path } = req.file;
    const { name, price, category_id, offer } = req.body;

    const product = await Product.create({ 
      name,
      price,
      category_id,
      path,
      offer
    });

    return res.status(201).json({id: product.id, name, price, category_id, path, offer})
  };

  async index(req, res) {
    const products = await Product.findAll({
      include:{                     //Incluindo a Model para trazer as informações da categoria no produto
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }
    });

    return res.json(products)
  }


  async update(req, res) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean()
    });

    try {
      schema.validateSync(req.body, { abortEarly: false })    //abortEarly é para continuar verificando e entregar todos os erros
    } catch (err) {
      return res.status(400).json({ error: err.errors }); //Se erro retorna mensagem
    }

    const { admin: isAdmin } = await User.findByPk(req.userId)

    if (!isAdmin) return res.status(401).json();

    const { id } = req.params

    const findProducts = await Product.findByPk(id)

    if (!findProducts) return res.status(400).json({ error: 'Make sure your Product ID is correct'})

    let path;
    if (req.file) path = req.file.filename

    const { name, price, category_id, offer } = req.body;

    await Product.update({ 
      name,
      price,
      category_id,
      path,
      offer
    }, {
      where: {
        id,
      }
    });

    return res.status(200).json({message: 'Product updated sucessfully'})
  };
}

export default new ProductController();