var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://127.0.0.1:27017/loginform');
    //useNewUrlParser: true,
    //useUnifiedTopology: true


var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.post("/sign_up",(req,res)=>{
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email1 = req.body.email1;
    var password1 = req.body.password1;
    var password2 = req.body.password2;

    var data = {
        "firstname": firstname,
        "lastname": lastname,
        "email1" : email1,
        "password1" : password1,
        "password2": password2
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('index1.html')

})
app.get("/sign_in",(req,res)=>{
    res.render("sign_in");
})
app.post("/sign_in",async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await db.collection('users').findOne({email1:email});
        
        if(useremail.password1 === password) {
            res.status(201).redirect("index1.html");
        } 

    } catch (error) {
        res.status(400).send("New to MoviesBuff? Sign Up now")
    }
})

app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('SU.html');
}).listen(3000);


console.log("Listening on PORT 3000");