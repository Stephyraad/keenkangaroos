
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var app = express();

var i= 2015;


app.get('/scrape', function(req, res){

  var url = 'http://top40charts.net/index.php?page='+i+'-music-charts';
  console.log("URL: ", url);
  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var rows = $('#content #table_1 tbody > tr');
      var json = { rank : "", youTubeUrl : "", chromeProfileUrl : "", artist : "", songTitle : ""};
      var dataArray=[];
      var rank, youTubeUrl, chromeProfileUrl, artist, songTitle;

      rows.each(function(){
        rank = $(this).children().first().find('img').attr('src');
        youTubeUrl = $(this).children().first().next().find('a').attr('href');
        chromeProfileUrl = $(this).children().first().next().next().find('a').attr('href');
        artist = $(this).children().last().prev().text();
        songTitle = $(this).children().last().text();

        json.rank = rank;
        json.youTubeUrl = youTubeUrl;
        json.chromeProfileUrl = chromeProfileUrl;
        json.artist = artist;
        json.songTitle = songTitle;

        dataArray.push(JSON.stringify(json, null, 4));

        console.log("JSON: "+ JSON.stringify(json));
      }) //end of .each
    } //end of if (!error)

    fs.writeFile(i+'-data.json', dataArray , function(err){
        console.log('File successfully written!');
    }) //end of fs.write
    res.send('Check your console!')
  }); //end of request
}) //end of app.get

app.listen('3000');

console.log('Magic happens on port 3000');

exports = module.exports = app;
