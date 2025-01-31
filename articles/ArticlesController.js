const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middleware/adminAuth");



router.get("/admin/articles", adminAuth,  (req,res)=>{
      
    Article.findAll({
      include: [{model: Category}]
    }).then(articles =>{
        res.render("admin/articles/index", {articles: articles});
     });
});



router.get("/admin/articles/new", adminAuth, (req,res)=>{
     Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories});

    })
  });


  router.post("/articles/save", adminAuth, (req,res)=>{
    
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

   
         Article.create({
           title: title,
           slug:slugify(title),
           body: body,
           categoryId: category

          }).then(()=>{
            res.redirect("/admin/articles");
          })  
   });
  
   router.post("/articles/delete", adminAuth, (req,res)=>{
    var id = req.body.id;
    if(id !=undefined){
       if(!isNaN(id)){
         //se passar por toda a verificacao assim pode ser deletado
         Article.destroy({
           where:{
             id : id
           }
         }).then(()=>{
           res.redirect("/admin/articles");
         });
 
       }else{//nao for um numero
         res.redirect("/admin/articles");
       } 
             
    }else{//nao for mull
     res.redirect("/admin/articles");
   
    }
     
 });
 
router.get("/admin/articles/edit/:id", adminAuth, (req, res) =>{
var id = req.params.id;
   Article.findByPk(id).then(article => {
     if (article != undefined) {
        Category.findAll().then(categories => {   
       res.render("admin/articles/edit", { categories: categories, article: article,}); // Use relative path
    });
   } else {
      res.redirect("/admin/articles");
    }
  }).catch(erro => {
    res.redirect("/admin/articles"); // Redirect on error
  });
});



router.post("/articles/update", adminAuth,(req, res) => {
  var id = req.body.id;
  var title = req.body.title;
  var body = req.body.body;
  var category = req.body.category;

  Article.update({title: title, body: body , categoryId: category, slug:slugify(title)}, {
     where: {
         id:id
     }
  }).then(()=>{
    res.redirect("/admin/articles"); 
  }).catch (err =>{
    res.redirect("/")
  });
 
}); 

router.get("/articles/page/:num", (req, res) => {
  let page = parseInt(req.params.num);
  let offset = 0;

  if (isNaN(page) || page <= 1) {
      offset = 0;
      page = 1;
  } else {
      offset = (page - 1) * 4;
  }

  Article.findAndCountAll({
      limit: 4,
      offset: offset,
      order: [['id', 'DESC']],
      include: [{ model: Category }] // Inclua a categoria aqui para acessar no template
  }).then(articles => {
      const next = offset + 4 < articles.count;

      const result = {
          page: parseInt(page),
          next: next,
          articles: articles.rows, // Acesse os artigos com .rows
          count: articles.count
      };

      Category.findAll().then(categories => {
          res.render("admin/articles/page", { result: result, categories: categories });
      });
  }).catch(err => {
      console.error("Erro na paginação:", err);
      res.redirect("/admin/articles"); // Redireciona em caso de erro
  });
});






  
  module.exports = router;

