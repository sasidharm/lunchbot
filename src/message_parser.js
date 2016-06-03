var natural = require('natural');
var categories = require('./categories.json');

classifier = new natural.BayesClassifier();

function Train() {
  for (var i = 0; i < categories.length; i++) {
    var parents = categories[i].parents;
    var alias = categories[i].alias;
    var title = categories[i].title;
    var countryList = categories[i].country_whitelist;
    var count = 0;
    for (var j = 0; j < parents.length; j++) {
      var parent = parents[j];
      if(parent === 'restaurants' && contains(countryList, 'US')) {
          classifier.addDocument('i want ' + alias , alias);
          classifier.addDocument('i want ' + title , alias);
          console.log('Added ' + alias);
          console.log('Added ' + title);
          continue;
      }
    }
  }

  classifier.train();
  console.log('Finished training');
  console.log(classifier.getClassifications('haha'));
}

function contains(array, val) {
  if(array) {
    for (var i = 0; i < array.length; i++) {
      if(array[i] === val) {
        return true;
      }
    }
    return false;
  }
  return true;
}
function Classify(message) {
  console.log('Classifying ' + message);
  return classifier.classify(message);
}

module.exports = {
    train: Train,
    classify: Classify
};
