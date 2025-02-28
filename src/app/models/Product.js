import Sequelize, { Model } from "sequelize";
import { defaultValueSchemable } from "sequelize/lib/utils";


class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.DECIMAL,
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,
        url: {                                        //Campo virtual para a recuperação do arquivo de imagem
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3001/product-file/${this.path}`     //local para recuperar a imagem
          }
        }
      },
      {
        sequelize
      }
    )

    return this

  }

  static associate(models) {            //cria a associação com a tabela Category
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    })
  }
}

export default Product;