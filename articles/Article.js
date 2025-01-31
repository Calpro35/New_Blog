const Sequelize = require("sequelize");
const connection = require("../database/database");
//importando o modulo de categoria para realizar os relaciomentos
const Category = require("../categories/Category");


//definir nosso modulos e criar uma tabela no banco
const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING, 
        allowNull: false 
 
    },slug:{
        type: Sequelize.STRING, 
        allowNull: false 
    },
    body: {
         type: Sequelize.TEXT,
         allowNull: false 
    }      

})


Category.hasMany(Article);
Article.belongsTo(Category);


module.exports = Article;


