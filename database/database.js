const Sequelize = require("sequelize");

//criando um objeto para acessar o banco
const connection = new Sequelize('blogExpress','','',{
    host:'localhost',
    dialect: 'mysql',
    timezone: '-03:00'

});

// exportala para usar em outros arquivos 
module.exports = connection;