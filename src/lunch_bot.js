

var botkit = require('./lib/Botkit.js');
var parser = require('./message_parser.js');
var yelp = require('./yelp_search.js');

var chatBot;

parser.train();


if(!process.env.token) {
  console.log('Token required to start the bot');
  process.exit(1);
}

var choices = {

};

var controller = botkit.slackbot({
  debug: false
});

controller.spawn({
  token: process.env.token
}).startRTM(function(error) {
  if(error) {
    console.log('Unable to start the bot');
    throw new Error(error);
  }
});

controller.on('rtm_open', function(bot, message) {
  chatBot = bot;
});

var schedule = require('node-schedule');

schedule.scheduleJob('0 30 11 * * ?', function(){
  chatBot.say({
      text:'Hello, it is lunch time! Where do you want to go?',
      channel: 'C186WFN22'
  })
});

schedule.scheduleJob('0 0 12 * * ?', function() {
  var sortedChoices = Object.keys(choices).sort(function(a,b){return choices[b]-choices[a]});

  var finalMessage = 'I guess we are skipping lunch today!';
  if(sortedChoices[0] > 0) {
    finalMessage = 'We are going to ' + sortedChoices[0];
  }
  chatBot.say({
    text:finalMessage,
    channel: 'C186WFN22'
  });
});

var events=['message_received', 'ambient','direct_mention','mention'];

controller.on(events, function(bot, message) {
  var text = message.text;
  if(text) {
      var convoCtx = {
        bot: bot,
        message: message
      };
      console.log('Received: ' + text);
      var cuisine = parser.classify(text);
      console.log('Classified: ' + cuisine);
      yelp.search(cuisine,
                  function(searchResult) {
                    processSearchResult(searchResult, convoCtx);
                  },
                  processSearchError);
  }
});

function processSearchResult(searchResult, convoCtx) {
  console.log('Found ' + searchResult.total + ' results');
  var results = searchResult.businesses;
  var resultText='';
  if(results.length > 0) {
    for (var i = 0; i < results.length; i++) {
      resultText += results[i].name + '\n';
    }
    console.log(resultText);
    console.log(convoCtx.message.user + ' - ' + resultText);
    var question = 'Which one do you prefer?\n' + resultText;
    convoCtx.bot.startConversation(convoCtx.message, function(err, convo){
      convo.ask(question, function(response, convo){
        choices[convoCtx.message.user] = response.text;
        convo.say('Cool. I will add ' + response.text + ' to the list!');
        console.log(choices);
        convo.next();
      });
    });
  } else {
    resultText = 'Unable to find results within 5 miles. Please try a different option';
    convoCtx.bot.say({
      text:resultText,
      channel: 'C186WFN22'
    });
  }
}

function processSearchError(error) {
  console.error(err);
}
