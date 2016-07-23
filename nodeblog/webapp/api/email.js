var SparkPost = require('sparkpost');
var sp = new SparkPost('<YOUR API KEY>');
module.exports = {
    sendMail: function(message) {
        sp.transmissions.send({
            transmissionBody: {
                content: {
                    from: 'testing@sparkpostbox.com',
                    subject: 'You have recived a message!',
                    html: '<html><body><p>'+message+'</p></body></html>'
                },
                recipients: [
                    { address: 'sourabhdattawad@gmail.com' }
                ]
            }
        }, function(err, res) {
            if (err) {
                console.log('Whoops! Something went wrong');
                console.log(err);
            } else {
                console.log('Woohoo! You just sent your first mailing!');
            }
        });






    }





}