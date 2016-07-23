var express = require('express');

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'cloud_name',
    api_key: 'cloud_name',
    api_secret: ' api_secret'
});

var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
mongoose.connect('mongodb://YOUR-HOST-URL');



var Schema = mongoose.Schema;

var contactSchema = new Schema({
    name: String,
    message: String,
    email: String,
    created_at: Date
});
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
var category = mongoose.model('category', categorySchema);
var blog = mongoose.model('blog', blogSchema);



var router = express.Router();



router.get('/about', function(req, res) {
    var user = mongoose.model('user', userSchema);
    user.find({ name: 'Sourabh_Dattawad' }, function(err, result) {
        if (err) throw err;
        console.log(result)
        res.render('about', result[0]);
    });

});

router.get('/view', function(req, res) {
    var user = mongoose.model('user', userSchema);
    user.find({ name: 'Sourabh_Dattawad' }, function(err, resultUser) {
        if (err) throw err;
        console.log(resultUser)
        projects.find({}, function(err, resultProjects) {
            resultProjects.sort(function(a, b) {
                return a.priority - b.priority;

            })
            res.render('home', {
                projects: resultProjects,
                user: resultUser[0]
            });
        });


    });

});

router.post('/about', upload.single('avatar'), function(req, res) {
    var user = mongoose.model('user', userSchema);

    if (req.file != undefined) {
        cloudinary.uploader.upload(req.file.path, function(result) {
            user.findOneAndUpdate({ name: 'Sourabh_Dattawad' }, { about: req.body.about, img: result.url }, function(err, user) {
                if (err) throw err;

                console.log(user);
                res.redirect('/update/about');
            });
        });

    } else {
        user.findOneAndUpdate({ name: 'Sourabh_Dattawad' }, { about: req.body.about }, function(err, user) {
            if (err) throw err;
            console.log(user);
            res.redirect('/update/about');
        });


    }

});



router.get('/projects', function(req, res) {
    projects.find({}, function(err, result) {
        result.sort(function(a, b) {
            return a.priority - b.priority;

        })
        res.render('projects', {
            projects: result
        });
    });
})
router.post('/projects', function(req, res) {
    console.log(req.body);

    var project = new projects({
        title: req.body.title,
        description: req.body.description,
        links: req.body.links,
        skills: req.body.skills,
        company: req.body.company,
        priority: Number(req.body.priority)
    });
    project.save(function(err) {
        if (err) throw err;
        console.log('Project saved successfully!');
    });

    res.redirect('/update/projects');
})

router.get('/projects/delete/:id', function(req, res) {
    console.log(req.params.id);

    projects.findByIdAndRemove({ _id: new ObjectID(req.params.id) }, function(err) {
        if (err) throw err;
        console.log('Project deleted!');
        res.redirect('/update/projects');
    });

})

router.get('/projects/edit/:id', function(req, res) {
    console.log(req.params.id);
    projects.findById({ _id: new ObjectID(req.params.id) }, function(err, result) {
        if (err) throw err;
        res.render('projects', {
            project: result,
            edit: true,
        });
    });

})
router.post('/projects/edit/:id', function(req, res) {
    projects.findByIdAndUpdate({ _id: new ObjectID(req.params.id) }, req.body, function(err, result) {
        if (err) throw err;
        res.redirect('/update/projects');
    });

})

router.get('/blog', function(req, res) {
    category.find({}, function(err, categories) {
        console.log(categories);
        blog.find({}, function(err, blogs) {
            res.render('blog', {
                category: categories,
                blog: blogs
            });



        })

    })


});
router.get('/blog/category', function(req, res) {
    res.render('add-category');

});
router.post('/blog/category/add', function(req, res) {
    console.log(req.body);
    var newcat = new category({
        name: req.body.category,
    });
    newcat.save(function(err) {
        if (err) throw err;
        console.log('Project saved successfully!');
        res.render('add-category');
    });


});
router.get('/blog/:category/', function(req, res) {

    blog.find({ category: req.params.category }, function(err, blogs) {
        if (err) throw err;
        category.find({}, function(err, categories) {
            console.log(categories);

            res.render('blog-list', {
                category: categories,
                blog: blogs
            });


            console.log(blogs);
        });


    });
});

router.get('/blog/post/create', function(req, res) {
    category.find({}, function(err, categories) {
        console.log(categories);
        res.render('create-blog', {
            category: categories
        });



    })

    console.log(req.body);
    // res.render('create-blog');
    // body...
});

router.post('/blog/post/create', function(req, res) {
    req.body.date = new Date();
    var newblog = new blog(req.body);
    newblog.save(function(err) {
        if (err) throw err;
        console.log('Blog saved successfully!');
        res.redirect('/update/blog');
    });

    console.log(req.body);

});

router.get('/blog/edit/:id', function(req, res) {
    console.log(req.params.id);
    blog.findById({ _id: new ObjectID(req.params.id) }, function(err, result) {
        if (err) throw err;
        category.find({}, function(err, categories) {
            console.log(categories);
            res.render('create-blog', {
                category: categories,
                blog: result,
                edit: true
            });

        });

    });

})
router.post('/blog/edit/:id', function(req, res) {
    blog.findByIdAndUpdate({ _id: new ObjectID(req.params.id) }, req.body, function(err, result) {
        if (err) throw err;
        res.redirect('/update/blog');
    });

})
router.get('/blog/delete/:id', function(req, res) {
    blog.findByIdAndRemove({ _id: new ObjectID(req.params.id) }, function(err) {
        if (err) throw err;
        console.log('blog deleted!');
        res.redirect('/update/blog');
    });

})




module.exports = router;
