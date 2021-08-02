// '/api' directory

const express = require('express');
const router = express.Router();
const path = require(`path`);
const cheerio = require('cheerio');
const iconv1 = require('iconv').Iconv;
require('dotenv').config({path: path.join(__dirname, "../credentials/.env")}); //dir수정

// ------------------------------------------------------------------
// Naver News API
// ------------------------------------------------------------------

// 네이버 뉴스 api를 이용해 뉴스 정보 가져옴
const request = require('request');

router.get('/news',(req,res)=>{
    const api_url = 'https://openapi.naver.com/v1/search/news?query=' + encodeURI(req.query.query)+`&sort=date`; //query=검색어 , sort는 정렬 순서, 기본값은 정확도 순
    const options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':process.env.CLIENT_ID, 'X-Naver-Client-Secret': process.env.CLIENT_SECRET}
     };
    request.get(options, (error, response, body)=> {
      if (!error && response.statusCode == 200) {
        res.status(200).set('Content-Type','text/json;charset=utf-8');   
        res.send(body); //string 값으로 받아옴
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
});


// ------------------------------------------------------------------
// YOUTUBE DATA API v3. Search
// 파라미터 가이드 : https://developers.google.com/youtube/v3/docs/search
// ------------------------------------------------------------------

// 유튜브 정보 가져오기
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
// request.get(url, (err, res, body) => {
//     console.log(body);
// });

router.get('/youtube', (req, res) => {
    // for display data
})

// Python crawling v3.9
router.get('/stock', (req, res) => {

  const spawn = require('child_process').spawn;

  const result = spawn('python', ['getStockJson.py']);

  result.stdout.on('data', (data) => {
    console.log(JSON.parse(data.toString()));
    res.send(JSON.parse(data.toString()));
  })

  result.stderr.on('data', (data) => {
    console.log(data.toString());
  })

})

let result = {

}

router.get('/test', (req, res) => {
  let url = "https://finance.naver.com/sise/sise_quant.nhn";
  request({url, encoding:null}, (err, response, body) => {
    let resultArr = [];
    iconv = new iconv1('euc-kr', 'utf-8');
    let htmlDoc = iconv.convert(body).toString();
    const $ = cheerio.load(htmlDoc);
    let colArr = $('.type_2 tbody tr').map((i, element) => {
      let nameObj = $(element).find('td > a');
      result['name'] = String(nameObj.text());
      // let priceObj = $(element).find('td')
      // result['price'] = String($(element).find('td > a').text());
      console.log(result);
    })
    console.log(result);
    res.send(resultArr);
  })
})

// Crypto Price (Upbit)
router.get('/coin', (req, res) => {
  // 기준 화폐 단위 - 종목코드로 원하는 종목 탐색 가능
  var url = `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-BTC`;
  request.get(url, (err, response, body) => {
    console.log(body);
    res.send(body);
  });
})

module.exports = router; //exports구문 추가