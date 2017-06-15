// server.js

// init project
var express = require("express");
var app = express();
var hbs = require("hbs");

var port = 8106;

var posts = [
  {
    post_title: "First Post",
    post_date: 1497493087235,
    post_body: "Lorem ipsum dolor sit amet, nulla pericula eu quo, discere quaestio incorrupte vel ad, te mucius recusabo complectitur quo. Ea per aeterno eligendi. Ea adipisci delicata conclusionemque vis. Ex augue elaboraret voluptatibus qui, quo etiam dictas civibus et. /nDuo an nibh justo moderatius, an usu dicam mediocritatem, vel autem tollit similique ad. Est ei minimum explicari rationibus, utroque platonem ne nam. Iusto scripta fabellas ut mei. Bonorum persequeris ad eam, no sea omnium dolorum, equidem perfecto appellantur cu eos."
  },
  {
    post_title: "Second Post",
    post_date: 1497491087235,
    post_body: "In a professional context it often happens that private or corporate clients corder a publication to be made and presented with the actual content still not being ready. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a newspaper or the internet. The are likely to focus on the text, disregarding the layout and its elements. Besides, random text risks to be unintendedly humorous or offensive, an unacceptable risk in corporate environments. Lorem ipsum and its many variants have been employed since the early 1960ies, and quite likely since the sixteenth century."
  }
]

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://www.npmjs.com/package/hbs
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', function(req, res) {

    res.locals = {
        title: ": Home",
        list: ["1", "2", "3"],
        posts: posts
    }

    res.render("index");
});

if (process.env.PORT){
  port = process.env.PORT;
}

// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
