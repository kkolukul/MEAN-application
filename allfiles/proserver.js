
var express = require('express'),
    path = require('path'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    mongoclient = require('mongodb').MongoClient,
    session = require('express-session'),
    MongoDBStore = require('connect-mongodb-session')(session),
    store = new MongoDBStore({
      uri:'mongodb://localhost:27017/students',
      collection:'training_session'
    });

    app.use(
      session({
        secret:'marlabs_sess_secret_key',
        resave:true,
        saveUninitialized:true,
        store:store
      })
    );

    store.on('error',function(error){
      console.log(error);
    });


app.engine('html',engines.nunjucks);
app.set('view engine','html');
app.set('views',__dirname+'/pub/views');


var conn_str = 'mongodb://localhost:27017/students';
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// app.get('/',function (req,res) {
//   console.log('in / of server');
//   res.render('proindex');
// });

// app.get('/login.html', function(req, res) {
//   console.log('in login of server');
//    res.render('prologin');
// });

// app.get('/prowelcome.html',function (req,res) {
//   console.log('in welcome of server');
//   res.render('prowelcome');
// });

app.get('/promonitor.html',function (req,res) {
  console.log('in welcome of server');
  res.render('promonitor');
});


app.get('/signup.html',function (req,res) {
  console.log('in signup of server');
  res.render('prosignup');
});


app.post('/postdetails',function (req,res) {
  console.log('in post details of server');
  var details = req.body.details;
  res.render('promonitor',{'details':details});
});

app.get('/logcheck',function (req,res) {
  console.log(req.session.loggedIn);
  res.send(req.session.loggedIn);
});

app.post('/alldetails',function (req,res) {
  var batch = req.body.batch;
  mongoclient.connect(conn_str,function(err,db){
    if(err){
      console.log('error occured in connecting to mongodb');
    } else {
         db.collection('details').find({'class':batch}).toArray(function(err,docs){
         console.log('in collection');
         res.send(docs);
      });
    }
    db.close();
    console.log('db connection closed');
  });
})


app.post('/signUp',function (req,res) {
  var username = req.body.susername,
      password = req.body.spassword,
      email = req.body.semail;

      mongoclient.connect(conn_str,function(err,db){
        if(err){
          console.log('error occured in connecting to mongodb');
        } else {
          db.collection('details').insert({
            'username':username,
            'password':password,
            'email':email
          });
        }
        db.close();
        console.log('db connection closed');
      });
res.render('prologin');
console.log('added to db');
})


app.post('/add',function (req,res) {
  console.log('in add of server');
  var username = req.body.fusername,
      password = req.body.fpassword,
      email = req.body.femail,
      className = req.body.fclass,
      subject1 = req.body.fsubject1,
      subject2 = req.body.fsubject2,
      subject3 = req.body.fsubject3;

      mongoclient.connect(conn_str,function(err,db){
        if(err){
          console.log('error occured in connecting to mongodb');
        } else {
          db.collection('details').insert({
            'username':username,
            'password':password,
            'email':email,
            'class':className,
            'score':[
              {
                'subject1':subject1,
                'subject2':subject2,
                'subject3':subject3
              }
            ]
          });
        }
        db.close();
        console.log('db connection closed');
      });
 res.end();
 });

app.post('/authenticate',function (req,res) {
  var username = req.body.username,
      password = req.body.password;


      mongoclient.connect(conn_str,function(err,db){
        if(err){
          console.log('error occured in connecting to mongodb');
        } else {
          var data = db.collection('details').find({'username':username,'password':password}).toArray(function(err,docs){
             console.log('in collection');
             req.session.userDetails = docs;
             req.session.loggedIn = true;
             console.log('added to session');
             res.send(docs);
          });
        }
        db.close();
        console.log('db connection closed');
      });

});

app.get('/logout',function (req,res) {
  req.session.loggedIn = false;
  req.session.destroy();
  console.log('session destroyed');
  // res.send('successfully loggedout');
  res.render('prologin');
});


app.use('/',express.static(__dirname+'/pub'));





app.listen(3307,function(){
    console.log('server running @3307');
  });
