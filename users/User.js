const Sequelize = require("sequelize");
const connection = require("../database/database")

//definir nosso modulos e criar uma tabela no banco
const User = connection.define('users', {
    email:{
        type: Sequelize.STRING, 
        allowNull: false 
 
    },password:{
        type: Sequelize.STRING, 
        allowNull: false 
    }      

})



module.exports = User;