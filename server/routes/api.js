// YOUTUBE DATA API v3. Search
// 파라미터 가이드 : https://developers.google.com/youtube/v3/docs/search

const express = require('express');
const router = express.Router();
require('dotenv').config({path: "../credentials/.env"});

const request = require('request');

// 영문 검색시
var keyword = "슈카월드";

// 검색 필터 기준값
// order, relevance.. 등
var filter = "relevance";

var optionParams = {
    q:keyword,
    part:"snippet",
    type:"video",
    order:filter,
    key:process.env.GCP_API_KEY,
    maxResults:5
};

// 한글 검색어 사용시 인코딩 과정 필요
optionParams.q = encodeURI(optionParams.q);

var url = "https://www.googleapis.com/youtube/v3/search?";

for(var option in optionParams){
    url += option + "=" + optionParams[option]+"&";
}

url = url.substr(0, url.length - 1);

// TEST
// https://www.youtube.com/watch?v=QYJDDAml6M0
// v = obj[id][videoId] value
request.get(url, (err, res, body) => {
    console.log(body);
});

router.get('/youtube', (req, res) => {
    // for display data
})
