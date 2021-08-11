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
  const url=`https://news.naver.com/main/home.naver`;
  const options={
    url: url,
    method: "GET",
    encoding:null,
  };
  request(options,(error,response,body)=>{
    if (error) {
          console.error(error);
          return;
      }
      if(response.statusCode == 200){
        iconv = new iconv1('euc-kr', 'utf-8');
        let htmlDoc = iconv.convert(body).toString();
        const $=cheerio.load(htmlDoc);//encoding
        const newsResult=[];
        //const list_arr=$("#_rankingList0 > li > div > div > div");
        const list_arr=$("#_rankingList0 > li");
        list_arr.map((idx,li)=>{
          newsResult[idx]={
            thumb: `https://news.naver.com/${$(li).find("a").attr('href')}`,
            title:$(li).find(".list_tit").text().trim(),
            comp:$(li).find(".list_press").text().trim(),
          }
        })
        console.log(newsResult);
        res.status(200);
        res.send(newsResult);
      }
    });
});


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

router.post('/location',(req,res)=>{
  const locationUrl=`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(req.body.keyword)}`;
  const options={
    url:locationUrl,
    type:'GET',
    headers: {'Authorization' : `KakaoAK ${process.env.KAKAO_LOCATION_API_KEY}`}
  }
  request.get(options,(error,response,body)=>{
    if(error){
      console.log(error);
      return;
    }
    if(response.statusCode == 200){
      const {documents}=JSON.parse(body);
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
  })

});
router.post(`/weather`,(req,res)=>{
  const{location}=req.body;
  console.log(location);
  const url=`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${process.env.WEATHER_API_KEY}`;
  request.get(url,(error,response,body)=>{
    console.log(url);
    if(error){
      console.log(error);
    }else if(response.statusCode==200){
      const result= JSON.parse(body);
      console.log(url);
      const weatherResult={
        main : result.main,
        icon : `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`,
        addr : location.address,
      }
      console.log(weatherResult);
      res.status(200).set('charset=utf-8');  
      res.send(weatherResult); //string 값으로 받아옴
    }
  });
});
/*router.post(`/weather`,(req,res)=>{//프라미스 형태로 변환 , 날씨 시간별로 가져오기 or 링크 연결 + 영문 한글로 변환
  const locationUrl=`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(req.body.keyword)}&key=${process.env.LOCATION_API_KEY}&language=ko`;
  //const url=`https://api.openweathermap.org/data/2.5/forecast?q=${req.body.city}&appid=${process.env.WEATHER_API_KEY}`;//5일 날씨
  let weatherResult={};
  console.log(locationUrl);
    new Promise((resolve,reject)=>{
      request.get(locationUrl,(error,response,body)=>{
        if(error){
          console.log(error);
          reject(error);
        }else if(response.statusCode==200){
            const {results}=JSON.parse(body);
            weatherResult={ addr:results[0].formatted_address,loaction:results[0].geometry.location}; 
            resolve(`https://api.openweathermap.org/data/2.5/weather?lat=${weatherResult.loaction.lat}&lon=${weatherResult.loaction.lng}&appid=${process.env.WEATHER_API_KEY}`);
        }
      })
    }).then((url)=>{
      request.get(url,(error,response,body)=>{
        if(error){
          console.log(error);
        }else if(response.statusCode==200){
          const result= JSON.parse(body);
          weatherResult['main']=result.main;
          //273.15
          weatherResult['icon'] =`http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`;
          res.status(200).set('charset=utf-8');  
          res.send(weatherResult); //string 값으로 받아옴
        }
      })
    }).catch((err)=>{console.log(err)});//error 구문
});
*/

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
  request.get(url, (err, response, body) => {
    console.log(body);
    res.send(body);
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

// Crypto Info (Upbit)
const coinCode = {
  "플레이댑":"PLA", "이더리움":"ETH", "비트코인캐시에이비씨":"BCHA", "비트코인":"BTC", "이더리움클래식":"ETC", "비트토렌트":"BTT", "엑시인피니티":"AXS", "캐리프로토콜":"CRE", "리플":"XRP",
  "파워렛저":"POWR", "보라":"BORA", "플로우":"FLOW", "도지코인":"DOGE", "리스크":"LSK", "에이다":"ADA", "디카르고":"DKA", "골렘":"GLM", "비트코인골드":"BTG", "무비블록":"MBL", "이오스":"EOS",
  "메디블록":"MED", "오브스":"ORBS", "샌드박스":"SAND", "쎄타퓨엘":"THUEL", "쎄타토큰":"THETA", "아이오에스티":"IOST", "아더":"ARDR", "밀크":"MLK", "펀디엑스":"PUNDIX", "제로엑스":"ZRX",
  "비체인":"VET", "폴카닷":"DOT", "스톰엑스":"STMX", "센티넬프로토콜":"UPP", "던프로토콜":"DAWN", "헌트":"HUNT", "넴":"XEM", "체인링크":"LINK", "트론":"TRX", "엘프":"ELF", "디센트럴랜드":"MANA",
  "비트코인캐시":"BCH", "스텔라루멘":"XLM", "칠리즈":"CHZ", "썸씽":"SSX", "어거":"REP", "스택스":"STX", "세럼":"SRM", "메타디움":"META", "시아코인":"SC", "스테이터스네트워크토큰":"SNT",
  "엠블":"MVL", "룸네트워크":"LOOM", "에브리피디아":"IQ", "앵커":"ANKR", "네오":"NEO", "에스티피":"STPT", "헤데라해시그래프":"HBAR", "알파쿼크":"AQT", "퀀텀":"QTUM", "스트라이크":"STRK",
  "스와이프":"SXP", "휴먼스케이프":"HUM", "저스트":"JST", "메인프레임":"MFT", "리퍼리움":"RFR", "코박토큰":"CBK", "썬더토큰":"TT", "폴리매쓰":"POLY", "피르마체인":"FCT2", "라이트코인":"LTC",
  "카바":"KAVA", "오미세고":"OMG", "톤":"TON", "질리카":"ZIL", "메탈":"MLT", "아이콘":"ICX", "시빅":"CVC", "그로스톨코인":"GRS", "가스":"GAS", "왁스":"WAXP", "엔진코인":"ENJ", "스트라티스":"STRAX",
  "카이버네트워크":"KNC", "아하토큰":"AHT", "스팀":"STEEM", "모스코인":"MOC", "하이브":"HIVE", "테조스":"XTZ", "스팀달러":"SBD", "비트코인에스브이":"BSV", "온톨로지":"ONT", "온톨로지가스":"ONG",
  "코스모스":"ATOM", "스토리지":"STORJ", "웨이브":"WAVES", "크립토닷컴체인":"CRO", "쿼크체인":"QKC", "아크":"ARK", "베이직어텐션토큰":"BAT", "아이오타":"IOTA"
}

router.get('/coin', (req, res) => {
  var url = `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-BTC`;
  request.get(url, (err, response, body) => {
    console.log(body);
    res.send(body);
  });
})

router.post('/coin', (req, res) => {
  // 기준 화폐 단위 - 종목코드로 원하는 종목 탐색 가능 
  const code = coinCode[req.body.keyword]
    
  if(code === null){
    const noName = {
      err:"Noname"
    }
    res.status(200);
    res.send(noName);
  }else {
    var url = `https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-`;
    url += code;
    request.get(url, (err, response, body) => {
      console.log(body);
      res.send(body);
    });
  }    
})

module.exports = router; //exports구문 추가