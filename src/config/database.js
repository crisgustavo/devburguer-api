module.exports = { //configurações do Banco de dados
    dialect: 'postgres', //Linguagem de Banco de dados
    host: 'localhost', //Endereço
    port: 5432, //Porta
    username: 'postgres', //Usuario
    password: 'postgres', //Senha
    database: 'devburguer', //Nome do Banco de dados

    define: {  //Configurações internas
        timestamps: true,  //adicinar datae e hora
        underscored: true,  //variáveis em sneakcase (user_name)
        underscoredAll: true  //Mesmo de cima
    }
}