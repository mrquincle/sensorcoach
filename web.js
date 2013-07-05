var express = require('express'),
    sys = require('util'),
    oauth = require('oauth'),
    SendGrid = require('sendgrid').SendGrid,
    port = process.env.PORT || 5000;

var _twitterConsumerKey = process.env['TWITTER_CONSUMER_KEY'];
var _twitterConsumerSecret = process.env['TWITTER_CONSUMER_SECRET'];
var _domain = process.env['DOMAIN'] || 'http://sensorcoach.heroku.com';

var app = module.exports = express();
app.use(express.logger());

app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/static'));

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: "aha-erlebniss"}));
app.use(express.methodOverride());
app.use(app.router);

// This is the express 3 way of storing a session
app.use(function(req, res){
    res.locals = req.session;
});

app.listen(port, function() {
  console.log("Listening on " + port);
});

// Let's create a new OAuth object every time following an example... I just don't get javascript.
function consumer() {
  return new oauth.OAuth(
    "https://api.twitter.com/oauth/request_token", "https://api.twitter.com/oauth/access_token", 
    _twitterConsumerKey, _twitterConsumerSecret, "1.0A", _domain+"/sessions/callback", "HMAC-SHA1");   
}

/*
 This function can be called in the browser and works perfect, however, calling it from AngularJS does not make it work. I have the idea that actually no 
 response object is send back, but that the browser does time out, while there is a redirect "in the background", which is not made visible to the user.
 */
app.get('/sessions/connect', function(req, res){
  consumer().getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
    } else {  
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      res.redirect("https://api.twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);      
    }
  });
});

app.get('/sessions/callback', function(req, res){
  sys.puts(">>"+req.session.oauthRequestToken);
  sys.puts(">>"+req.session.oauthRequestTokenSecret);
  sys.puts(">>"+req.query.oauth_verifier);
  consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      // Right here is where we would write out some nice user stuff
      consumer().get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
        if (error) {
          res.send("Error getting twitter screen name : " + sys.inspect(error), 500);
        } else {
          console.log("data is %j", data);
          data = JSON.parse(data);
          req.session.twitterScreenName = data["screen_name"];    
          res.send('You are signed in: ' + req.session.twitterScreenName)
        }  
      });  
    }
  });
});
