const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const session = require('express-session');


app.use(session({
    secret :'secret',
    resave : true ,
    saveUninitialized : true 
}));

app.use(function(req,res,next){
    res.set('cache-control','no-cache,private,must-revalidate,no-store');
    next();
})

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());


var conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password :'',
    database :'node'
})
conn.connect(function(err){
    if(err) throw err;
    console.log("Database connected.........")
})


app.set('view engine','ejs')

app.get('/',function(req,res){
    res.render('signup')
});


app.get('/login',function(req,res){
    res.render('login')
});


app.post('/signup',function(req,res){

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;


    const sql = `insert into users(username , email , password) values('${name}' , '${email}' , '${password}')`;

    conn.query(sql,function(err,result){

        if(err) throw err;
        res.send('<h1>User Successfully resitered.....</h1>');
    });
});








app.post('/booking',function(req,res){

    const name = req.body.name;
    const address = req.body.address;
    const region = req.body.region;
    const email = req.body.email;
    const phone = req.body.phone;
    const Aphone = req.body.Aphone;
    const des = req.body.des;


    const sql = `insert into booking2 (name , address ,region , email ,phone , Aphone , des) values('${name}' , '${address}','${region}','${email}' , '${phone}','${Aphone}','${des}')`; 

    conn.query(sql,function(err,result){

        if(err) throw err;
        res.send('<h1>User Successfully Booked a ride.....</h1>');
    });
});





// app.use('/static',express.static(path.join(__dirname,'/images')))
app.use(express.static(path.join(__dirname, 'images')));

app.get('/getimage',(req,res)=>{
    let images = getImagesFromDir(path.join(__dirname,'images'))
    // res.render('booking',{title:'node.js - Auto Generate Gallery from a Directory',images:images})
    res.render('welcome',{title:'node.js - Auto Generate Gallery from a Directory',images:images})
    // res.render('contact',{title:'node.js - Auto Generate Gallery from a Directory',images:images})
    // res.render('about',{title:'node.js - Auto Generate Gallery from a Directory',images:images})
})
function getImagesFromDir(dirPath){
    let allImages =[]
    let files = fs.readdirSync(dirPath)
}

app.post('/login',function(req,res){

    const email = req.body.email;
    const password = req.body.password;



    if(email && password){

        const sql =`select * from users where email = '${email}' AND password='${password}'`;

        conn.query(sql,function(err,results){

            if(results.length>0){
                req.session.loggedin = true ;
                req.session.email = email ;
                
                res.redirect('/welcome')
            }else{
                res.send("<h1>Incorrect email and password  </h1>")
            }

        })

    }
    else{
        res.send('<h1>Please Enter email or password')
    }

});


app.get('/welcome',function(req,res){

    if(req.session.loggedin){

        res.render('welcome',{user :`${req.session.email}`});
    }else{
        res.send("<h1>Please Login first to view this page</h1>")
    }

})



app.get('/booking',function(req,res){

    if(req.session.loggedin){

        res.render('booking',{user :`${req.session.email}`});
    }else{
        res.send("<h1>Please Login first to view this page</h1>")
    }

})

app.get('/signup',function(req,res){

    if(req.session.loggedin){

        res.render('signup',{user :`${req.session.email}`});
    }else{
        res.send("<h1>Please go to signup page first and register yourself</h1>")
    }

})




app.get('/about',function(req,res){

    if(req.session.loggedin){

        res.render('about',{user :`${req.session.email}`});
    }else{
        res.send("<h1>Please Login first to view this page</h1>")
    }

})

app.get('/contact',function(req,res){

    if(req.session.loggedin){

        res.render('contact',{user :`${req.session.email}`});
    }else{
        res.send("<h1>Please Login first to view this page</h1>")
    }

})

app.get('/logout',function(req,res){
    req.session.destroy((err)=>{
        res.redirect('/login');
    })
})





app.get("/welcome",(req,res)=>{
    res.render("welcome")
})

app.get("/about",(req,res)=>{
    res.render("about")
})


app.get("/booking",(req,res)=>{
    res.render("booking")
})

app.get("/contact",(req,res)=>{
    res.render("contact")
})









const server = app.listen(5001,()=>{
    console.log("port connected on 5001")
})