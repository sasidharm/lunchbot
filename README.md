# lunchbot

* Slackbot starts conversation with a Slack team to choose the lunch place everyday
* Messages the team on a slack channel at 11.30 AM every day prompting for lunch suggestions
* Searches for top rated restaurants on yelp and provides options for the team to choose

# Running lunchbot

* Get a Slack API token
* Get the following Yelp API details
 * consumer_key
 * consumer_secret
 * API token
 * API Secret

Run lunchbot by executing the following command:
```
node token=<slack api token> consumer_key=<yelp consumer_key> consumer_secret=<yelp consumer_secret> yelp_token=<yelp API token> yelp_secret=<yelp API secret> lunch_bot.js
```
