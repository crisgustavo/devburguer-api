import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcrypt'

class User extends Model {  //Classe que herda metodos da classe pai Model
    static init(sequelize) {        //busca o metodo sem precisar instanciar em variável
        super.init(                 //Utilizando o metodo da classe pai Model do sequelize
            {                
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                admin: Sequelize.BOOLEAN
            },
            {
                sequelize,
            }
        );

        this.addHook('beforeSave', async (user) => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 10)   //numero apos virgura são ciclos de encriptação
            }
        })

        return this
    };

    async checkPassword(password) {
        return await bcrypt.compare(password, this.password_hash)
    }
};

export default User;