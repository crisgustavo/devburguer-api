import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import { resolve } from 'node:path'

import './database'   //quando carregar a aplicação já carrega o banco de dados e as models

class App {
    constructor() {
        this.app = express();

        this.middlewares();
        this.routes();
    };

    middlewares() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use('/product-file', express.static(resolve(__dirname, '..', 'uploads')));         //Indica para o expres o caminho onde ficam salvas as imagens.
        this.app.use('/category-file', express.static(resolve(__dirname, '..', 'uploads')));
    };

    routes() {
        this.app.use(routes)
    };
};

export default new App().app