var express = require('express'),
    SendGrid = require('sendgrid').SendGrid,
    port = process.env.PORT || 5000;

var Bird = require('bird');
var oauth = {
  oauth_token : process.env.TWITTER_CONSUMER_KEY,
  oauth_token_secret : process.env.TWITTER_CONSUMER_SECRET,
  callback: 'http://sensorcoach.heroku.com/callback'
};

var app = module.exports = express();
app.use(express.logger());

app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/static'));

app.use(express.bodyParser());
app.use(express.session({secret: "aha-erlebniss"}));
app.use(express.methodOverride());
app.use(app.router);

app.listen(port, function() {
  console.log("Listening on " + port);
});

app.get('/', function(req, res){
  res.send('<a href="/login">Login</a><br><a href="/home_timeline.json">Home Timeline</a>');
});


app.get('/login', function(req, res) {
  req.session.oauth = oauth;
  Bird.login(req.session.oauth, function(err,r,body){
    if (err) {
      //add error handling here for when twitter returns an error
      res.send("Error getting OAuth request token");
    } else {
      //parse tokens received from twitter
      var tokens = qs.parse(body);
      //set temporary oauth tokens for the users session
      req.session.oauth.token = tokens.oauth_token;
      req.session.oauth.token_secret = tokens.oauth_token_secret;

      //redirect user to authorize with temporary token
      res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + tokens.oauth_token);
    }
  });
});

app.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

app.get('/callback', function(req, res){
  //set oauth verifier for the users session
  req.session.oauth.verifier = req.query.oauth_verifier;
  Bird.auth_callback(req.session.oauth, function(err, r, body){
    if (err) {
      //add error handling here for when twitter returns an error
      res.send(err);
    } else {
      //parse tokens received from twitter
      var tokens = qs.parse(body);
      //set permanent access tokens for the users session
      req.session.oauth.token = tokens.oauth_token;
      req.session.oauth.token_secret = tokens.oauth_token_secret;

      //redirect the user
      res.redirect('/');
    }
  });
});

//route using a stream
app.get('/home_timeline.json', function(req, res){
  var options = req.query;
  options.oauth = req.session.oauth;

  //Bird.home_timeline will return a stream that can be piped to a response
  Bird.home_timeline(options).pipe(res);
});

app.post('/contact', function(req, res) {
	var mailForm = req.body;
    var sendgrid = new SendGrid(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
    sendgrid.send({
    	to: 'anne@dobots.nl',
    	toname: 'rest4phone team',
    	from: mailForm.email,
    	fromname: mailForm.name,
	    subject: mailForm.subject,
	    text: mailForm.message_body
    }, function(success, response) {
    	if(!success) {
    	  console.log('Failure to send email');
		  res.send({ success: false });
    	} else {
    	  console.log('Email successfully sent');
   	      res.send({ success: true });
    	}
    });
});
