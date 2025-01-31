const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");



router.get("/admin/categories/new", (req,res)=>{
    res.render("admin/categories/new");
});

//rota que vem do formularios sempre e post
router.post("/categories/save", (req,res)=>{
  var title = req.body.title;
  if(title != undefined){
       Category.create({
         title: title,
         slug:slugify(title)
         }).then(()=>{
          res.redirect("/admin/categories");
         }) 
  }else {
    res.redirect("/admin/categories/new");
  }
});

//rota  para receber do banco de dados e aparecer no html
router.get("/admin/categories", (req,res)=>{
   Category.findAll().then(categories => {
    res.render("admin/categories/index", {categories: categories});
  })
});


//rota para deletar informacoes no banco de dados 
router.post("/categories/delete", (req,res)=>{
   var id = req.body.id;
   if(id !=undefined){
      if(!isNaN(id)){
        //se passar por toda a verificacao assim pode ser deletado
        Category.destroy({
          where:{
            id : id
          }
        }).then(()=>{
          res.redirect("/admin/categories");
        });

      }else{//nao for um numero
        res.redirect("/admin/categories");
      } 
            
   }else{//nao for mull
    res.redirect("/admin/categories");
  
   }
    
});


//rota para editar um programa 
router.get("/admin/categories/edit/:id", (req, res) => {
  var id = req.params.id;
  if (isNaN(id)) {
    res.redirect("/admin/categories");
  }
  Category.findByPk(id).then(category => {
    if (category != undefined) {
      res.render("admin/categories/edit", { category: category }); // Use relative path
    } else {
      res.redirect("/admin/categories");
    }
  }).catch(erro => {
    res.redirect("/admin/categories"); // Redirect on error
  });
});


router.post("/categories/update", (req, res) => {
  var id = req.body.id;
  var title = req.body.title;

  Category.update({title: title, slug: slugify(title)}, {
     where: {
         id:id
     }
  }).then(()=>{
    res.redirect("/admin/categories"); 
  })
 
});  




module.exports = router;









module.exports = router;