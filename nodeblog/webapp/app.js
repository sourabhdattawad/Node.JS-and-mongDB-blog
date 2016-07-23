var express = require('express');
var exphbs = require('express-handlebars');
var blog = require('./routes/blog');

var email = require('./api/email');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
mongoose.connect('mongodb://YOUR HOST URL;
var userSchema = new Schema({
    name: String,
    about: String,
    img: String
});
var projectSchema = new Schema({
    title: String,
    description: String,
    links: String,
    priority: Number,
    skills: String,
    company: String
});
var contactSchema = new Schema({
    name: String,
    message: String,
    email: String,
    created_at: Date,
    about: Array
});
var blogSchema = new Schema({
    title: String,
    description: String,
    category: String,
    date: Date
});

var categorySchema = new Schema({
    name: String,
});

var user = mongoose.model('user', userSchema);

var projects = mongoose.model('projects', projectSchema);

var contact = mongoose.model('contact', contactSchema);
var category = mongoose.model('category', categorySchema);
var blog = mongoose.model('blog', blogSchema);

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
var router = express.Router();


app.use(router);


app.get('/', function(req, res) {
    var title ="Sourabh Dattawad | That JS guy"
    user.find({ name: 'Sourabh_Dattawad' }, function(err, resultUser) {
        if (err) throw err;


        projects.find({}, function(err, resultProjects) {
            resultProjects.sort(function(a, b) {
                    return a.priority - b.priority;
                })

            res.render('home', {
                projects: resultProjects,
                user: resultUser[0],
                title : title
            });
        });


    });

});

app.post('/contact/submit', function(req, res) {
    var reqBody = req.body;
    console.log(reqBody);
    var checkbox = 'Lets talk about ';
    for (var i in reqBody.talk) {
        console.log(reqBody.talk[i]);
        checkbox += reqBody.talk[i];
        checkbox += '. ';

    }


    var message = 'A message from ' + reqBody.name + ' "';
    message += reqBody.message;
    message += '". ';
    message += checkbox;
    message += 'Email is ';
    message += reqBody.email;

    var details = new contact({
        name: reqBody.name,
        email: reqBody.email,
        message: reqBody.message,
        created_at: new Date(),
        about: reqBody.talk

    });

    details.save(function(err) {
        if (err) throw err;
        console.log('User saved successfully!');
    });



    // email.sendMail(message);


    res.end();


});

app.get('/blog', function(req, res) {
    var title = "Blog | Sourabh Dattawad"
    category.find({}, function(err, categories) {
        console.log(categories);
        blog.find({}, function(err, blogs) {
            res.render('blog', {
                category: categories,
                blog: blogs,
                title:title
            });


        })

    })

});
app.get('/blog/:category/', function(req, res) {
    var title = req.params.category + ' blogs | Sourabh Dattawad';

    blog.find({ category: req.params.category }, function(err, blogs) {
        if (err) throw err;
        var shit="<h1>hello</h1>"
        category.find({}, function(err, categories) {
            console.log(categories);

            res.render('blog', {
                category: categories,
                blog: blogs,
                title:title,
                catName:req.params.category
            });


            console.log(blogs);
        });


    });
});
app.get('/blog/:category/:title', function(req, res) {
    var title = req.params.title +' | '+ "Sourabh Dattawad";
    blog.findOne({ title: req.params.title }, function(err, blogs) {
        if (err) throw err;
        var shit="<h1>hello</h1>"
        category.find({}, function(err, categories) {
            console.log(categories);

            res.render('each-blog', {
                category: categories,
                blog: blogs,
                shit:shit,
                title:title
            });


            console.log(blogs);
        });


    });
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Hello");

});
app.use(function(req, res) {
    res.render('404.handlebars')
});

module.exports = app;
