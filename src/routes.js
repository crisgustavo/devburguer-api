import { Router } from 'express'
import { v4 } from 'uuid'
import multer from 'multer'
import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';

//import User from './app/models/User';
import UserController from './app/controller/UserController';
import SessionController from './app/controller/SessionController';
import ProductController from './app/controller/ProductController';
import CategoryController from './app/controller/CategoryController';
import OrderController from './app/controller/OrderController';

const routes = new Router();
const upload = multer(multerConfig);        //Importa configuração do caminho de pasta em config/multer.js

routes.get('/', (req,res) => {
    return res.status(200).json({message: 'API acessada com sucesso!'})
});

routes.post('/users', UserController.store)         //.store recebe instanaciado a função req, res
routes.post('/session', SessionController.store)

routes.use(authMiddleware);             //à partir dessa linha todas as rotas usarão por obrigação o authMiddleware

routes.post('/products', upload.single('file'), ProductController.store)        //no uploado o 'file' é o campo que o frontend vai enviar
routes.get('/products', ProductController.index)                    //envia rota de todos os produtos
routes.put('/products/:id', upload.single('file'), ProductController.update)

routes.post('/categories', upload.single('file'), CategoryController.store)
routes.get('/categories', CategoryController.index)
routes.put('/categories/:id', upload.single('file'), CategoryController.update)

routes.post('/orders', OrderController.store)
routes.get('/orders', OrderController.index)
routes.put('/orders/:id', OrderController.update)

/*routes.get('/', async (req,res) => {          //rota teste que cria usuário no banco de dados
    const user = await User.create({            //acessando localhost:3001
        id: v4(),
        name: 'Cristiano',
        email: 'cris.gustavogs@gmail.com',
        password_hash: 'abacate'
    })

    return res.status(201).json(user)
})*/

export default routes