// '/api' directory

const express = require('express');
const router = express.Router();
const path = require(`path`);
const cheerio = require('cheerio');
const iconv1 = require('iconv').Iconv;
const fs = require('fs');
require('dotenv').config({path: path.join(__dirname, "../credentials/.env")}); //dir수정

// ------------------------------------------------------------------
// Naver News API
// ------------------------------------------------------------------

// 네이버 뉴스 api를 이용해 뉴스 정보 가져옴
const request = require('request');

router.post('/news',(req,res)=>{
  /*const api_url = `https://openapi.naver.com/v1/search/news?query=${encodeURI(req.body.keyword)}`; //query=검색어 , sort는 정렬 순서, 기본값은 정확도 순
  const options = {
      url: api_url,
      headers: {'X-Naver-Client-Id':process.env.CLIENT_ID, 'X-Naver-Client-Secret': process.env.CLIENT_SECRET}
   };
  request.get(options, (error, response, body)=> {
    if (!error && response.statusCode == 200) {
      res.status(200).set('Content-Type','text/json;charset=utf-8');   
      res.send(body); 
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });*/
  const url=`https://search.naver.com/search.naver?where=news&sm=tab_jum&query=${encodeURI(req.body.keyword)}`;
  const options={
    url: url,
    method: "GET"
  };
  request(options,(error,response,body)=>{
    if (error) {
          console.error(error);
          return;
      }
      if(response.statusCode == 200){
        const $=cheerio.load(body);
        const newsResult=[];
        const list_arr=$(".list_news>li>.news_wrap");
        list_arr.map((idx,div)=>{
          newsResult[idx]={
            title: $(div).find(".news_tit").attr("title"),
            url:$(div).find(".news_tit").attr("href"),
            description:$(div).find(".news_dsc").text().trim(),
            thumb:$(div).find(".dsc_thumb>img").attr("src"),
            comp:$(div).find("a.info.press").text().replace("언론사 선정",''),
          }
        })
        res.send(newsResult);
      }
    });

});
router.post('/weather',(req,res)=>{//개선사항 에러처리 + 콜백처리 깔끔하게
const locationUrl=`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(req.body.keyword)}&key=${process.env.LOCATION_API_KEY}&language=ko`;
  //const url=`https://api.openweathermap.org/data/2.5/forecast?q=${req.body.city}&appid=${process.env.WEATHER_API_KEY}`;//5일 날씨
let weatherResult={};
  request.get(locationUrl, (error,response,body)=>{
    // res.status(200).set('Content-Type','text/json;charset=utf-8');   
    if (error) {
          console.error(error);
          return;
    }
    if(response.statusCode == 200){
    const {results}=JSON.parse(body);
    weatherResult={ addr:results[0].formatted_address,loaction:results[0].geometry.location}; 
    
    const url=`https://api.openweathermap.org/data/2.5/weather?lat=${weatherResult.loaction.lat}&lon=${weatherResult.loaction.lng}&appid=${process.env.WEATHER_API_KEY}`;
    request.get(url,(error2,response2,body2)=>{
      if (error2) {
        console.error(error2);
        return;
    }
    if(response2.statusCode == 200){
      res.status(200).set('Content-Type','text/json;charset=utf-8');  
    const result= JSON.parse(body2);
    weatherResult['main']=result.main;
    //273.15
    weatherResult['icon'] =`http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`;
    res.send(weatherResult); //string 값으로 받아옴
    }
  });
}
   });
});

// ------------------------------------------------------------------
// YOUTUBE DATA API v3. Search
// 파라미터 가이드 : https://developers.google.com/youtube/v3/docs/search
// ------------------------------------------------------------------

router.get('/youtube', (req, res) => {
    // for display data
})

router.post('/youtube', (req, res) => {
  // 유튜브 정보 가져오기
  // 영문 검색시
  var keyword = req.body.keyword;

  // 검색 필터 기준값
  // order, relevance.. 등
  var filter = "relevance";
  var displayNum = 5;

  var optionParams = {
      q:keyword,
      part:"snippet",
      type:"video",
      order:filter,
      key:process.env.GCP_API_KEY,
      maxResults:displayNum
  };

  // 한글 검색어 사용시 인코딩 과정 필요
  optionParams.q = encodeURI(optionParams.q);

  var url = "https://www.googleapis.com/youtube/v3/search?";

  
  for(var option in optionParams){
    url += option + "=" + optionParams[option]+"&";
  }
  
  url = url.substr(0, url.length - 1);

  var videoBaseUrl = "https://www.youtube.com/watch?v=";
  
  request.get(url, (err, response, body) => {
    result = JSON.parse(body);
    const videoInfoList = {
      "videos" : []
    }
    for(var i = 0; i < displayNum; i++){
      const videoInfo = {};
      // 썸네일 사이즈 (defauit : 120x90 / medium : 320x180 / high : 480x360)
      videoInfo["title"] = result["items"][i]["snippet"]["title"];
      videoInfo["description"] = result["items"][i]["snippet"]["description"];
      videoInfo["channelTitle"] = result["items"][i]["snippet"]["channelTitle"];
      videoInfo["thumbnails"] = result["items"][i]["snippet"]["thumbnails"]["high"]["url"]; 
      videoInfo["videoUrl"] = videoBaseUrl + result["items"][i]["id"]["videoId"];
      videoInfoList["videos"].push(videoInfo);
    }
    console.log(videoInfoList);
    res.send(videoInfoList);
  });
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

let stockCodeUrl = {};

fs.readFile('../server/data/stockCodeUrl_pc.json', 'utf8', (err, jsonFile) => {
    if(err) return console.log(err);
    stockCodeUrl = JSON.parse(jsonFile);    
    console.log("StockCode Load Fin!");
})

router.post('/stock', (req, res) => {
  const title = req.body.keyword;
  const url = stockCodeUrl[title];
  console.log(url);
  const stockInfo = {};
  if(url === undefined) {
    stockInfo['err'] = 'Noname';
    res.send(stockInfo)
  }
  else{
    request({url, encoding:null}, (err, response, body) => {
      iconv = new iconv1('euc-kr', 'utf-8');
      let htmlDoc = iconv.convert(body).toString();
      const $ = cheerio.load(htmlDoc);
      let priceFragments = "";
      let changePriceFragments = "";
      let changeRateFragments = "";
      let priceList = $('#chart_area > .rate_info > .today > .no_today > em').map((i, element) => {
        priceFragments += $(element).find('span').text().trim();
      })
      let changePriceList = $('#chart_area > .rate_info > .today > .no_exday > em:nth-of-type(1)').map((i, element) => {
        changePriceFragments += $(element).find('span').text().trim();
      })
      let changeRateList = $('#chart_area > .rate_info > .today > .no_exday > em:nth-of-type(2)').map((i, element) => {
        changeRateFragments += $(element).find('span').text().trim();
      })
      let price = priceFragments.substring(0, priceFragments.length / 2);
      let dir = changePriceFragments.substring(0, 2);
      let changePrice = ""
      if(dir === "상승") changePrice += "+";
      else if(dir === "하락") changePrice += "-";
      changePrice += changePriceFragments.substring(2, changePriceFragments.length / 2 + 1);
      let changeRate = changeRateFragments.substring(0, changeRateFragments.length / 2) + "%";
      console.log(title);
      console.log(price);
      console.log(dir);
      console.log(changePrice);
      console.log(changeRate);
      stockInfo["title"] = title; // 종목명
      stockInfo["price"] = price; // 현재가
      stockInfo["changePrice"] = changePrice; // 등락액
      stockInfo["changeRate"] = changeRate; // 등락률
      stockInfo["dir"] = dir; // 방향   
      res.status(200);
      res.send(stockInfo)
    })
  }  
})

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

// Crypto Info (Upbit)
let coinCode = {};

fs.readFile('../server/data/coinCode.json', 'utf8', (err, jsonFile) => {
  if(err) return console.log(err);
  coinCode = JSON.parse(jsonFile);    
  console.log("CoinCode Load Fin!");
})

router.get('/coin', (req, res) => {
  var url = `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-BTC`;
  request.get(url, (err, response, body) => {
    console.log(body);
    res.status(200);
    res.send(body);
  });
})

router.post('/coin', (req, res) => {
  // 기준 화폐 단위 - 종목코드로 원하는 종목 탐색 가능 
  const code = coinCode[req.body.keyword]
  const coinInfo = {};
  if(code === null){
    coinInfo['err'] = "Noname";
    res.status(200);
    res.send(coinInfo);
  }else {
    var url = `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-` + code;
    request.get(url, (err, response, body) => {      
      data = JSON.parse(body);
      // console.log(data); 전체
      coinInfo['title'] = req.body.keyword;
      coinInfo['tradePrice'] = data[0]['tradePrice'];
      coinInfo['changePrice'] = data[0]['signedChangePrice'];
      coinInfo['changeRate'] = Math.round(data[0]['signedChangeRate'] * 10000) / 100;
      console.log(coinInfo);
      res.status(200);
      res.send(coinInfo);
    });
  }    
})

module.exports = router; //exports구문 추가