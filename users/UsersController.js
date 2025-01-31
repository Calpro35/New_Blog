const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
    User.findAll().then( user => {
    res.render("admin/Users/user", {user: user});
      })
});


router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

//login 
router.get("/login",(req, res)=>{
    res.render("admin/users/login")
})

//rota autenticacao
router.post("/authenticate",(req, res)=>{
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({where:{email:email}}).then(user =>{
    if(user != undefined){ // se existe um usuario com este email
         //validar a senha
         var correct = bcrypt.compareSync(password, user.password);
            if(correct){
                 req.session.user = {
                    id:user.id,
                    email: user.email
                 }
                 res.redirect("/admin/articles");
            }else{
                res.redirect("/login")
            }
    }else{
        res.redirect("/login")
    }
  })

});

//rota de criacao de email 
router.post("/users/create", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  //validacao para saber se o email ja esta cadastrado
  User.findOne({ where: { email: email } }).then( user => {
    // se usuario for diferente de nulo = underfined
    if (user == undefined) {
      //criacao para criptografar senha
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);

      User.create({
        email: email,
        password: hash,
      })
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          res.redirect("/");
        });
    } else {
      res.redirect("/admin/users/create");
    }
  });
});


//lougout
router.get("/logout",(req, res) =>{
   req.session.user = undefined;
   res.redirect("/");

});


module.exports = router;
