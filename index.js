const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection =  require("./database/database");
const session = require("express-session");



// rotas controller
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");


//carregando os modulos de banco 
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

// setting session
app.use(session({
  secret: "saidadealgo",
  cookie:{maxAge:30000}
}))

//view engine
app.set('view engine','ejs');


//static css img etc 
app.use(express.static('public'));



//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//database
connection
   .authenticate()
   .then(()=>{
      console.log("conexao feita com sucesso!")  
    }).catch((error) =>{
      console.log(error);
    })

// rotas use
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);


// rotas sessions 
app.get("session", (req, res) =>{


});


app.get("/leitura", (req, res) =>{


});



//rotas
app.get("/", (req,res) =>{
   
  Article.findAll({
    order: [
         ['id', 'DESC']
    ],
    limit:4
  }).then(articles =>{
    Category.findAll().then(categories => {
    res.render("index",{ articles: articles, categories: categories});
  });
});

});

app.get("/:slug",(req,res)=>{
     var slug = req.params.slug;
     Article.findOne({
          where:{
              slug: slug
          }
     }).then(article =>{
     if(article != undefined){
      Category.findAll().then(categories => {
        res.render("article",{ article: article, categories: categories});
      });
      }else{
      res.redirect("/");
     }

 }).catch(err =>{
  res.redirect("/");
 })

});


app.get("/category/:slug", (req,res)=>{
   var slug = req.params.slug;
   Category.findOne({
      where: {
        slug: slug
      },
      include: [{model: Article}]
   }).then(category =>{
      if(category != undefined){
        
        Category.findAll().then(categories =>{
          res.render("index", {articles: category.articles, categories: categories})
        });

      }else{
        res.redirect("/");
      } 

   }).catch(err =>{
    res.redirect("/");
   })
   

})





//porta de acesso 
app.listen(8080,()=>{
console.log("meu servidor está rodando !")
});


