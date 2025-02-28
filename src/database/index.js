import Sequelize from "sequelize";
import mongoose from "mongoose";

import configDatabase from "../config/database.js"

import User from "../app/models/User";
import Product from "../app/models/Product.js";
import Category from "../app/models/Category.js";



const models = [        //Array para fazer um map e não precisar criar uma conexão para cada model
    User,
    Product,
    Category
]

class Database {
    constructor() {
        this.init();            //Sempre que chamar o metodo já roda o init
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(configDatabase);      //instaciando o sequelize
        models
            .map((model) => model.init(this.connection))            //mapeia e inicia as conexões de todas as models
            .map(model => model.associate && model.associate(this.connection.models))           //mapeia se existe assiciate e inicia as associates de cada model
    }

    mongo() {
        this.mongoConnection = mongoose.connect('mongodb://localhost:27017/devburger')          //cria a conexão com o banco mongo
    }
}

export default new Database();      //Envia a classe instanciada