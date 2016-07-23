var express = require('express');
var app = express();
var router = express.Router();
var exphbs = require('express-handlebars');

var blog = require('./routes/blog');
var allroutes = require('./routes/allroutes');
var contact = require('./api/db');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


router.use('/blog', blog);
router.use('/update', allroutes);

app.use(router);


app.get('/', function(req, res) {
	res.redirect('/update/view');
    
});



var port = process.env.PORT || 8000;
app.listen(port, function() {
	console.log("Hello");

});

module.exports = app;
