import Sequelize, { Model } from "sequelize";


class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {                                        //Campo virtual para a recuperação do arquivo de imagem
                  type: Sequelize.VIRTUAL,
                  get() {
                    return `http://localhost:3001/category-file/${this.path}`     //local para recuperar a imagem
                  }
                }
      },
      {
        sequelize
      }
    );

    return this
    
  }
}

export default Category