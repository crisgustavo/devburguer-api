import * as Yup from 'yup'
import Order from '../schemas/Order'
import Product from '../models/Product';
import Category from '../models/Category'

class OrderController {
  async store(req, res) {
    const schema = Yup.object({
      products: Yup.array().required().of(
        Yup.object({
          id: Yup.number().required(),
          quantity: Yup.number().required()
        })
      )
    });

    try {
      schema.validateSync(req.body, { abortEarly: false })    //abortEarly é para continuar verificando e entregar todos os erros
    } catch (err) {
      return res.status(400).json({ error: err.errors }); //Se erro retorna mensagem
    }

    const { products } = req.body;

    const productsIds = products.map((product) => product.id)

    const findProducts = await Product.findAll({
      where: {
        id: productsIds
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ]
    });

    const formattedProducts = findProducts.map((product) => {
      const productIndex = products.findIndex((item) => item.id === product.id)   //verifica o index do products à partir da verificação do id de cada lista

      const newProduct = {        //Novo objeto com os campos certos de atribuição
        id: product.id,
        name: product.name,
        category: product.category.name,
        price: product.price,
        url: product.url,
        quantity: products[productIndex].quantity
      }

      return newProduct
    })

    const order = { 
      user: {
        id: req.userId,
        name: req.userName
      },
      products: formattedProducts,
      status: 'Pedido Realizado!'
    };

    const createOrder = await Order.create(order);

    return res.status(201).json(createOrder)
  };

  async index(req, res) {
    const orders = await Order.find();

    return res.json(orders)
  }

  async update(req, res) {
    const schema = Yup.object({
      status: Yup.string().required()
    });

    try {
      schema.validateSync(req.body, { abortEarly: false })    //abortEarly é para continuar verificando e entregar todos os erros
    } catch (err) {
      return res.status(400).json({ error: err.errors }); //Se erro retorna mensagem
    }

    const { admin: isAdmin } = await User.findByPk(req.userId.id)

    if (!isAdmin) return res.status(401).json();

    const { id } = req.params
    const { status } = req.body

    try {
      await Order.updateOne({ _id: id }, { status })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    return res.status(201).json({message: 'Order status updated sucessfully'})
  }
}

export default new OrderController();