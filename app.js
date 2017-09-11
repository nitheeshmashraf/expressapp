var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var expressValidator=require('express-validator');
var db = mongojs('customerapp',['users']);
var ObjectId = mongojs.ObjectId;
var portNo=4200;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname,'public')));

app.use(function(req,res,next){
    res.locals.errors=null;
    next();
});

app.use(expressValidator({
    errorFormatter: function(param,msg,value){
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() +']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.get('/',function(req,res){
    db.users.find(function(err,docs){
        res.render('index',{
            title: 'Customers',
            persons:docs,
        });
    });
    
});

app.post('/user/add',function(req,res){
    req.checkBody('FName','First name is Mandatory').notEmpty();
    req.checkBody('LName','Last name is Mandatory').notEmpty();
    req.checkBody('Age','Age is Mandatory').notEmpty();

        var errors = req.validationErrors();
            if(errors){
            res.render('index',{
                persons:person,
                title: 'Customers',
                errors:errors
            });
            console.log('errors'); 
        }else{
            var newEntry={
                    FName: req.body.FName,
                    LName: req.body.LName,
                    Age: req.body.Age
                }
            db.users.insert(newEntry,function(err, result){
                if(err){
                    console.log(err);
                }
                res.redirect('/');
            });
                console.log(newEntry);

        }
});

app.delete('/users/delete/:id',function(req,res){
    // console.log(req.params.id);

    db.users.remove({_id: ObjectId(req.params.id)},function(err){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});




app.listen(portNo,
function(){
    console.log("Server on Port "+ portNo);
})