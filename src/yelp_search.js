
var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  token: process.env.yelp_token,
  token_secret: process.env.yelp_secret,
});

function Search(term, success, error) {

  yelp.search({
    // term: term,
    radius_filter: '7000',
    ll: '34.100276,-84.239053',
    sort: '2',
    limit: '5',
    category_filter: term
  })
  .then(function (data) {
    console.log('Received: ' + data);
    success(data);
  })
  .catch(function (err) {
    error(err);
  });
}

module.exports = {
    search: Search
};
