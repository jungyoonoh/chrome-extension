// '/api' directory

const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const iconv1 = require('iconv').Iconv;
const fs = require('fs');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../credentials/.env")}); //dir수정

// ------------------------------------------------------------------
// Naver News API
// ------------------------------------------------------------------

// 네이버 뉴스 api를 이용해 뉴스 정보 가져옴
const request = require('request');
const axios = require('axios');

router.get('/news',async(req,res)=>{//핫토픽 뉴스를 크롤링을 이용해 가져옴 -> 수정해야함
  const url=`https://news.naver.com/`;
  const options={
    url: url,
    method: "GET",
    encoding:null,
  };
  axios(options).then((response)=>{
    if(response.status == 200){
      console.log(response.data);
      let iconv = new iconv1('euc-kr', 'utf-8');
      let htmlDoc = iconv.convert(response.data).toString();
      const $=cheerio.load(htmlDoc);//encoding
      const newsResult=[];
      const list_arr=$(".brick-vowel _brick_column");
      list_arr.map((idx,li)=>{
        newsResult[idx]={
          url: `https://news.naver.com/${$(li).find("a").attr('href')}`,
          thumb: $(li).find("a>img").attr('src'),
          title:$(li).find(".list_tit").text().trim(),
          comp:$(li).find(".list_press").text().trim(),
        }
      })
      res.status(200);
      res.send(newsResult);
    }
  }).catch((error)=>{
    console.error(error);
  });
});


router.post('/news',(req,res)=>{//키워드 기반으로 크롤링하여 뉴스 가져옴
  const url=`https://search.naver.com/search.naver?where=news&sm=tab_jum&query=${encodeURI(req.body.keyword)}`;
  const options={
    url: url,
    method: 'get'
  };
  axios(options).then((response)=>{
    if(response.status == 200){
      const $=cheerio.load(response.data);
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
  }).catch((error)=>{
    console.error(error);
  });
});

router.post('/location',(req,res)=>{//키워드 기반으로 위치정보를 가져옴 (특정 위치의 날씨정보 가져올 때 사용)
  const locationUrl=`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(req.body.keyword)}`;
  const options={
    url:locationUrl,
    type:'get',
    method:'get',
    headers: {'Authorization' : `KakaoAK ${process.env.KAKAO_LOCATION_API_KEY}`}
  };
  axios(options).then((response)=>{
    if(response.status == 200){
      const {documents}=response.data;
      const addrArray=[];
      documents.map((addr,idx)=>{
        addrArray[idx]={
          address:addr.address_name,
          lat:addr.y,
          lon:addr.x,
        }
      })
      res.send(addrArray);
    }
  }).catch((error)=>{
    console.log(error);
  });
});

router.get(`/weather`,(req,res)=>{// default 위치인 서울 중구의 날씨 가져옴
  const url=`https://api.openweathermap.org/data/2.5/weather?lat=37.5555892070291&lon=126.981204133005&appid=${process.env.WEATHER_API_KEY}`;
  axios.get(url).then((response)=>{
    if(response.status==200){
      const result= response.data;
      const weatherResult={
        main : result.main,
        icon : `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`,
        addr : `서울특별시 중구 회현동1가`,
      }
      res.status(200).set('charset=utf-8');  
      res.send(weatherResult); //string 값으로 받아옴
    }
  }).catch((error)=>{
    console.log(error);
  });
});

router.post(`/weather`,(req,res)=>{//특정 위치의 날씨 가져옴
  const{location}=req.body;
 // const url=`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${process.env.WEATHER_API_KEY}`;
  const url=`https://api.openweathermap.org/data/2.5/weather`;
  const params={
    lat:location.lat,
    lon:location.lon,
    appid:process.env.WEATHER_API_KEY,
  };
  const options={
    url:url,
    method:'get',
    params:params,
  };
  axios(options).then((response)=>{
    if(response.status==200){
      const result= response.data;
      const weatherResult={
        main : result.main,
        icon : `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`,
        addr : location.address,
      }
      res.status(200).set('charset=utf-8');  
      res.send(weatherResult); //string 값으로 받아옴
    }
  }).catch((error)=>{
    console.log(error);
  })
});
// ------------------------------------------------------------------
// YOUTUBE DATA API v3. Search
// 파라미터 가이드 : https://developers.google.com/youtube/v3/docs/search
// ------------------------------------------------------------------

router.get('/youtube', (req, res) => {
  // https://www.googleapis.com/youtube/v3/videos?chart=mostPopular&key={YOUR_API_KEY}&part=snippet&maxResults=4
  var url = "https://www.googleapis.com/youtube/v3/videos?";
  var displayNum = 5;
  var optionParams = {
    part:"snippet",
    chart:"mostPopular",
    regionCode:"kr",
    key:process.env.GCP_API_KEY,
    maxResults: displayNum
  };

  for(var option in optionParams){
    url += option + "=" + optionParams[option]+"&";
  }
  
  url = url.substr(0, url.length - 1);

  var videoBaseUrl = "https://www.youtube.com/watch?v=";

  request.get(url, (err, response, body) => {
    result = JSON.parse(body);
    const videoInfoList = [];
    for(var i = 0; i < displayNum; i++){
      const videoInfo = {};
      // 썸네일 사이즈 (defauit : 120x90 / medium : 320x180 / high : 480x360)
      videoInfo["title"] = result["items"][i]["snippet"]["title"];
      // videoInfo["description"] = result["items"][i]["snippet"]["description"];
      videoInfo["channelTitle"] = result["items"][i]["snippet"]["channelTitle"];
      videoInfo["thumbnails"] = result["items"][i]["snippet"]["thumbnails"]["high"]["url"]; 
      videoInfo["videoUrl"] = videoBaseUrl + result["items"][i]["id"];
      videoInfoList.push(videoInfo);
    }
    res.send(videoInfoList);
  });
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
    const videoInfoList = [];
    for(var i = 0; i < displayNum; i++){
      const videoInfo = {};
      // 썸네일 사이즈 (defauit : 120x90 / medium : 320x180 / high : 480x360)
      videoInfo["title"] = result["items"][i]["snippet"]["title"];
      videoInfo["description"] = result["items"][i]["snippet"]["description"];
      videoInfo["channelTitle"] = result["items"][i]["snippet"]["channelTitle"];
      videoInfo["thumbnails"] = result["items"][i]["snippet"]["thumbnails"]["high"]["url"]; 
      videoInfo["videoUrl"] = videoBaseUrl + result["items"][i]["id"]["videoId"];
      videoInfoList.push(videoInfo);
    }
    res.send(videoInfoList);
  });
})

let stockDirection = {}

fs.readFile('../server/data/stockDirection.json', 'utf8', (err, jsonFile) => {
  if(err) return console.log(err);
  stockDirection = JSON.parse(jsonFile);    
  console.log("StockDirection Load Fin!");
})

// 거래량 상위 종목 5개
const startTr = 3; // 종목 시작 카운트
const topTradingStockNum = 5; // 거래량 상위 n개 종목
router.get('/stock', (req, res) => {

  const url = "https://finance.naver.com/sise/sise_quant.nhn";

  request({url, encoding:null}, (err, response, body) => {
    let iconv = new iconv1('euc-kr', 'utf-8');
    let htmlDoc = iconv.convert(body).toString();
    const $ = cheerio.load(htmlDoc);
    const topTradingStockList = [];

    for(var j = startTr; j < startTr + topTradingStockNum; j++){
      $(`.type_2 > tbody > tr:nth-of-type(${j})`).map((i, element) => {
        let rank = (j - startTr + 1) + "위";
        let dir = $(element).find('td:nth-of-type(4)').find('img').toString();
        if(dir.length == 0) dir = "보합";
        else dir = stockDirection[$(element).find('td:nth-of-type(4)').find('img').attr('src').toString()];
        let changePrice = $(element).find('td:nth-of-type(4)').find('span').text().trim();
        let changeRate = $(element).find('td:nth-of-type(5)').find('span').text().trim();
        if(dir === "상승" || dir === "상한") changePrice = "+" + changePrice;
        else if (dir === "하락" || dir === "하한") changePrice = "-" + changePrice;
        let stockJson = {};
        stockJson["rank"] = rank;
        stockJson["title"] = $(element).find('td:nth-of-type(2)').find('a').text().trim();
        stockJson["price"] = $(element).find('td:nth-of-type(3)').text().trim();
        stockJson["dir"] = dir;
        stockJson["changePrice"] = changePrice;
        stockJson["changeRate"] = changeRate;
        stockJson["url"] = stockCodeUrl[title];
        topTradingStockList.push(stockJson);
      })
    }
    res.status(200);
    res.send(topTradingStockList);
  })  
})

let stockCodeUrl = {};

fs.readFile('../server/data/stockCodeUrl_pc.json', 'utf8', (err, jsonFile) => {
    if(err) return console.log(err);
    stockCodeUrl = JSON.parse(jsonFile);    
    console.log("StockCode Load Fin!");
})

// 종목 가격
router.post('/stock', (req, res) => {
  const title = req.body.keyword;
  const url = stockCodeUrl[title];
  const stockInfo = {};
  if(url === undefined) {
    stockInfo['err'] = 'Noname';
    res.send(stockInfo)
  }
  else{
    request({url, encoding:null}, (err, response, body) => {
      let iconv = new iconv1('euc-kr', 'utf-8');
      let htmlDoc = iconv.convert(body).toString();
      const $ = cheerio.load(htmlDoc);
      let priceFragments = "", changePriceFragments = "", changeRateFragments = "";
      $('#chart_area > .rate_info > .today > .no_today > em').map((i, element) => {
        priceFragments += $(element).find('span').text().trim();
      })
      $('#chart_area > .rate_info > .today > .no_exday > em:nth-of-type(1)').map((i, element) => {
        changePriceFragments += $(element).find('span').text().trim();
      })
      $('#chart_area > .rate_info > .today > .no_exday > em:nth-of-type(2)').map((i, element) => {
        changeRateFragments += $(element).find('span').text().trim();
      })
      let price = priceFragments.substring(0, priceFragments.length / 2);
      let dir = changePriceFragments.substring(0, 2);
      let changePrice = ""
      if(dir === "상승") changePrice += "+";
      else if(dir === "하락") changePrice += "-";
      changePrice += changePriceFragments.substring(2, changePriceFragments.length / 2 + 1);
      let changeRate = changeRateFragments.substring(0, changeRateFragments.length / 2) + "%";
      stockInfo["title"] = title; // 종목명
      stockInfo["price"] = price; // 현재가
      stockInfo["changePrice"] = changePrice; // 등락액
      stockInfo["changeRate"] = changeRate; // 등락률
      stockInfo["dir"] = dir; // 방향  
      stockInfo["url"] = url;
      res.status(200);
      res.send(stockInfo)
    })
  }  
})

router.get('/indices', (req, res) => {
  let url = "https://finance.naver.com/";
  const indicesInfo = [];
  request({url, encoding:null}, (err, response, body) => {
    let iconv = new iconv1('euc-kr', 'utf-8');
    let htmlDoc = iconv.convert(body).toString();
    const $ = cheerio.load(htmlDoc);

    // KOSPI
    let kospiInfo = {};
    let kospiIndexValue = $('.kospi_area > .heading_area .num_quot').find('.num').text().trim();
    let changeKospiIndex = $('.kospi_area > .heading_area .num_quot').find('.num2').text().trim();
    let changeKospiRate = $('.kospi_area > .heading_area .num_quot').find('.num3').text().trim();
    let kospiDir = $('.kospi_area > .heading_area .num_quot > .num3').find('.blind').text().trim();
    let kospiDirText = $('.kospi_area > .heading_area .num_quot').find('.blind').text().trim();

    kospiInfo["title"] = "KOSPI";
    kospiInfo["value"] = kospiIndexValue;
    kospiInfo["changeIndex"] = kospiDir + changeKospiIndex;
    kospiInfo["changeRate"] = changeKospiRate;
    kospiInfo["dir"] = kospiDirText[1] + kospiDirText[2];
    indicesInfo.push(kospiInfo);

    // KOSDAQ
    let kosdaqInfo = {};
    let kosdaqIndexValue = $('.kosdaq_area > .heading_area .num_quot').find('.num').text().trim();
    let changeKosdaqIndex = $('.kosdaq_area > .heading_area .num_quot').find('.num2').text().trim();
    let changeKosdaqRate = $('.kosdaq_area > .heading_area .num_quot').find('.num3').text().trim();
    let kosdaqDir = $('.kosdaq_area > .heading_area .num_quot > .num3').find('.blind').text().trim();
    let kosdaqDirText = $('.kosdaq_area > .heading_area .num_quot').find('.blind').text().trim();

    kosdaqInfo["title"] = "KOSDAQ";
    kosdaqInfo["value"] = kosdaqIndexValue;
    kosdaqInfo["changeIndex"] = kosdaqDir + changeKosdaqIndex;
    kosdaqInfo["changeRate"] = changeKosdaqRate;
    kosdaqInfo["dir"] = kosdaqDirText[1] + kosdaqDirText[2];
    indicesInfo.push(kosdaqInfo);

    res.send(indicesInfo);
  })
})

router.get('/test', (req, res) => {
  let url = "https://finance.naver.com/sise/sise_quant.nhn";
  request({url, encoding:null}, (err, response, body) => {
    let resultArr = [];
    let iconv = new iconv1('euc-kr', 'utf-8');
    let htmlDoc = iconv.convert(body).toString();
    const $ = cheerio.load(htmlDoc);
    $('.type_2 tbody tr').map((i, element) => {
      let nameObj = $(element).find('td > a');
      result['name'] = String(nameObj.text());
      // let priceObj = $(element).find('td')
      // result['price'] = String($(element).find('td > a').text());
    })
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
  // 거래량 상위 5종목
  // 코드 난독화로 크롤링 불가능
  var url = `https://upbit.com/exchange?code=CRIX.UPBIT.KRW-BTC`; 
  request({url, encoding:null}, (err, response, body) => {
    let iconv = new iconv1('euc-kr', 'utf-8//translit//ignore');    
    let htmlDoc = iconv.convert(body).toString('utf-8');
    let htmlDocBin = new Buffer(htmlDoc, 'binary');
    let htmlDocUtf8 = iconv.convert(htmlDocBin).toString('utf-8');
    const $ = cheerio.load(htmlDocUtf8);
    const topTradingCoinList = {};
    for(var rank = 1; rank <= 5; rank++)
    $(`.scrollB > div > div > table > tbody > tr:nth-of-type(${rank})`).map((i, element) => {
      let titleKor = $(element).find('td:nth-of-type(3) > a > strong').text().trim();
      let titleEng = $(element).find('td:nth-of-type(3) > a > em').text().trim();
      let price = $(element).find('td:nth-of-type(4) > strong').text().trim();
      let changePrice = $(element).find('td:nth-of-type(5) > em').text().trim();
      let changeRate = $(element).find('td:nth-of-type(5) > p').text().trim();
      const coinJson = {};
      coinJson['titleKor'] = titleKor;
      coinJson['titleEng'] = titleEng;
      coinJson['price'] = price;
      coinJson['changePrice'] = changePrice;
      coinJson['changeRate'] = changeRate;
      topTradingCoinList[rank] = coinJson;
    })
    res.status(200);
    res.send(topTradingCoinList);
  })
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
    var url = `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-` + code; // Upbit API
    request.get(url, (err, response, body) => {      
      data = JSON.parse(body);
      coinInfo['title'] = req.body.keyword;
      coinInfo['tradePrice'] = data[0]['tradePrice'];
      coinInfo['changePrice'] = data[0]['signedChangePrice'];
      coinInfo['changeRate'] = Math.round(data[0]['signedChangeRate'] * 10000) / 100;
      coinInfo['url'] = "https://upbit.com/exchange?code=CRIX.UPBIT.KRW-" + code;
      res.status(200);
      res.send(coinInfo);
    });
  }    
})

module.exports = router; //exports구문 추가