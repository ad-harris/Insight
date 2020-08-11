

var twitterAnalysis = function () {
    var async = require('async');
    var twitter = require("twitter");
    var dotenv = require("dotenv");
    var sentiment = require("sentiment");

    dotenv.config();


    var twitterApi = new twitter({
        // consumer_key: process.env.Consumer_Key_Twitter,
        // consumer_secret: process.env.Consumer_Secret_Twitter,
        // access_token_key: process.env.Access_Token_Twitter,
        // access_token_secret: process.env.Access_Token_Secret_Twitter
        consumer_key: '0RbLnFvBRIvDtKoM6ojz0ZZwC',
        consumer_secret: '5Wpjc58t2oXtK7mPgLJxVOCRGLrKN2NvgVSBlXHaglgjRC6Jxy',
        access_token_key: '1273564897553637376-pwaoI33hlXCnealZF8rH9tbWMAUxmz',
        access_token_secret: 'QA64R9YvlZaOhsCpQorzr4wl5HQDUkTgKXEzI8ky7TJwa',
    });


    this.getTwitterHashTagData = function (query, callback) {
        var dataScore = {"Very Negative": 0, "Negative": 0, "Neutral": 0, "Positive": 0, "Very Positive": 0};
        var sum = 0;

        twitterApi.get("search/tweets", {q: "#" + query + "-filter:retweets", lang: "en", count: "100"}, function (error, tweets, response) {
            var twitterData = [];
            var sortedTwitterData = [];
            if (error) callback(error);

            async.each(tweets.statuses, function (item, callEach) {
                //console.log(tweets);
                //if(item.retweet_count < 1){
                  twitterData.push(item.text.includes("RT"));
                var sentScore = sentiment(item.text, function (err, data) {
                    if (data.score < -4) {
                        sortedTwitterData.unshift(item.text);
                        dataScore["Very Negative"] += 1;
                    }
                    else if (data.score >= -3 && data.score < 0) {
                        sortedTwitterData.splice(2, 0, item.text);
                        dataScore["Negative"] += 1;
                    }
                    else if (data.score == 0) {
                        sortedTwitterData.splice(3, 0, item.text);
                        dataScore["Neutral"] += 1;
                    }
                    else if (data.score > 0 && data.score <= 3) {
                        sortedTwitterData.splice(4, 0, item.text);
                        dataScore["Positive"] += 1;
                    }
                    else {
                        sortedTwitterData.push(item.text);
                        dataScore["Very Positive"] += 1;
                    }
                    callEach(); // decrementing by 1 until the length of the array is completed for the tweets.statuses
                });

            }, function () {

                callback(null, dataScore, sortedTwitterData);
            });

        });
    };
};



module.exports = twitterAnalysis;
