const mongoose = require("mongoose");
const express = require("express");
const bodyparser = require("body-parser");
const app=express()
var reap =[]
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyparser.urlencoded({extended:true}));
mongoose.connect("mongodb://127.0.0.1:27017/craftizenDB",{
        useNewUrlParser:true
});
const userSchema = mongoose.Schema({
    Email:String,
    password:String,
    address:String,
    contact:Number,
});
const cartSchema = mongoose.Schema({
    Name:String,
    No_items:Number,
    price:Number,
    image:String,
});
const User = new mongoose.model("User",userSchema);
const Cart = new mongoose.model("Cart",cartSchema);
app.listen(3000,function(req,res){
    console.log("server is running successfully");
})
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})
app.get("/signup",function(req,res){
    res.sendFile(__dirname+"/Homepage/signuppage.html");
})
app.get("/arts",function(req,res){
    res.sendFile(__dirname+"/Art Page/arthome.html");
})
app.get("/home",function(req,res){
    res.sendFile(__dirname+"/Homepage/Home.html");
})
app.get("/login",function(req,res){
    res.sendFile(__dirname+"/Homepage/loginpage.html");
})
app.get("/items-product1",function(req,res){
    res.sendFile(__dirname+"/Art Page/items-product1.html");
})
app.get("/cart",function(req,res){
    res.sendFile(__dirname+"/Homepage/cart.html");
})
app.get("/place-order",function(req,res){
    res.sendFile(__dirname+"/Homepage/place-order.html");
})
app.get("/payment",function(req,res){
    res.sendFile(__dirname+"/Homepage/payment.html");
})

app.post("/signup",function(req,res){
    var email = req.body.email;
    var password = req.body.pass;
    var addr = req.body.addr;
    var cont = req.body.cont;
    async function f1(){
        try{
    // const f = await User.create({Email:email,password:password,address:addr,contact:cont});
    const existingUser = await User.findOne({ Email: email });
    if (existingUser) {
      // User already exists, display an error message
      console.log("User already exists");
      res.write('<p style="color: red;">User already exists. Please choose a different email.</p>');
        res.sendFile(__dirname + "/signup.html");
    }else{
    // Create a new user
    const f = await User.create({ Email: email, password: password, address: addr, contact: cont });
    console.log("User created successfully");
    res.sendFile(__dirname + "/Homepage/Home.html");
    }
    }catch (error) {
        // Handle any other errors that might occur
        console.error(error);
        res.status(500).send("An error occurred. Please try again later.");
      }
    
    }
    f1();
});
app.post("/login",function(req,res){
    var email = req.body.email;
    var password = req.body.pass;
    async function f1(){
    const f = await User.find({Email:email,password:password});
    console.log("user found successfully");
    if(f.length>0){
        res.sendFile(__dirname+"/Homepage/Home.html");
    }
    else{
        res.send("the credentials are invalid");
    }
    }
    f1();

})
app.post("/addtocart1",function(req,res){
    var c = req.body.cartadd1;
    async function f1(){
        var d = await Cart.create({Name:c,No_items:1,price:2,image:"/"+c+".jpg"})
    }
    f1()
})

app.post("/addtocart2",function(req,res){
    var zy = req.body.cartadd2;
    console.log(zy);
    async function f1(){
        var d = await Cart.create({Name:zy,No_items:1,price:1.25,image:"/"+zy+".jpg"})
    }
    f1()
})
app.post("/addtocart3",function(req,res){
    var x = req.body.cartadd3;
    console.log(x);
    async function f1(){
        var d = await Cart.create({Name:x,No_items:1,price:3.5,image:"/"+x+".jpg"})
    }
    f1()
})

app.post("/addtocart",function(req,res){
  var z  = req.body.cartadd1;
//   var m  = req.body.cartadd2;
  console.log(z);
//   if(z==="Naruto & his friends"){
//     res.send("entered here");
//   }
    // if()

 
  var m = req.body.butt;
  var c = req.body.requ;
  var d = req.body.requ1;

  if(m==="check0"){
  console.log(c,d);
  async function a1(){
    var e = await Cart.create({Name:c,No_items:d,price:d*100,image:"/"+c+".jpg"})
    console.log("value entered successfully");
  } 
  a1()
}
else{
    console.log("entered here");
    async function f1(){
        var f = /[a-z]*/
        // console.log("entered here");
        var c = await Cart.find({Name: f});

        reap =  c;
        res.render("display",{disp:reap});
    }
    f1() 
}
})

// deleteitem

//  app.delete("/cart/:id", function(req, res) {
//     var itemId = req.params.id;

//     // Assuming you are using Mongoose, you can delete the item with the specified itemId
//     Cart.findByIdAndRemove(itemId, function(err) {
//         if (err) {
//             console.error(err);
//             res.json({ success: false, message: "Error deleting item" });
//         } else {
//             res.json({ success: true, message: "Item deleted successfully" });
//         }
//     });
// });
app.post("/delete_cart",function(req,res){
    // var c = req.body.cartadd1;.
    var c = req.body.final;
    console.log(c);
    async function f1(){
        await Cart.deleteMany({Name:c});
        console.log("deleted successfully");
    }
    f1()
})

app.get('/cart', (req, res) => {
    // Fetch the customization data from the request body
    const customizationData = req.query.customizationData || '';
  
    // Render the checkout page template and pass the customization data
    res.render('checkout', { customizationData });
  });
  