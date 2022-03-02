import 'css/App.css';
import { useState, useEffect } from 'react';
import React  from 'react';
import axios from "axios"

let locationArray=[];
//비 로그인 (localstorage code)
let keyword="";

const addLocalKeyword=()=>{//비 로그인시 키워드 저장하는 방법 : local storage 사용
  let arr=[];
  if(localStorage.keyword!=undefined){
      arr=JSON.parse(localStorage.keyword);
      if(!arr.includes(keyword)){
        arr.push(keyword);
        localStorage.setItem('keyword',JSON.stringify(arr));
      }
  }else {
      arr.push(keyword);
      localStorage.setItem('keyword',JSON.stringify(arr));
  }  

  console.log(localStorage.keyword)
  //전체 삭제시 localStorage.removeItem('keyword');
};
const removeKeyword=()=>{// 비로그인 시 지우는 방법
  let arr=[];
  const idx=1;
  arr=JSON.parse(localStorage.keyword);
 
  if(arr.length==1){
    if(arr[0]===keyword)
    localStorage.removeItem('keyword');
  }
  else {
    arr=arr.filter( (word) => word!==keyword);
    localStorage.setItem('keyword',JSON.stringify(arr));
      /*arr.splice(idx,idx);
      localStorage.setItem('keyword',JSON.stringify(arr));
      */
  }
  console.log(localStorage.keyword)
};

//로그인 시 Crud test
function CrudTest(){
  const [isLogin, setIsLogin] = useState(false);
  const [youtubeKeyword, setYoutubeKeyword] = useState("");
  const [stockKeyword, setStockKeyword] = useState("");


  const getLoginInfo = async () => { //로그인 여부 체크
    await axios.get(
      '/auth'
      ).then(response => {
        console.log(response);
        if (response.data == "") setIsLogin(false);
        else setIsLogin(true);
      }).catch(err => {
        console.log(err);
      })
  }
  useEffect(() => {
      getLoginInfo()
  }, [isLogin])

  const userRead=async()=>{//현재 유저 정보 조회
    const {data}=await axios.get(`/database/user`);
    console.log(data);
  };
  const keywordAdd=async()=>{
    const {data}=await axios.patch(`/database/${keyword}/add`);
    console.log(data);
  };
  
  const keywordDelete=async()=>{
    const {data}=await axios.patch(`/database/${keyword}/delete`);
    console.log(data);
  };
  const userDelete=async()=>{//현재 유저 탈퇴
    const {data}=await axios.delete('/database/user');
    await axios.get('/auth/logout');
  };
  
  const getYoutubeKeyword = async () => {
    await axios.get('/api/youtube/keyword')
      .then(response => {
        console.log(response);
      }).catch(err => {console.log(err)});
  }

  const deleteYoutubeKeyword = async () => {
    console.log(youtubeKeyword)
    await axios.delete('/api/youtube/keyword', {
      data: {
        keyword:youtubeKeyword
      }
    })
      .then(response => {
        console.log(response);
      }).catch(err => {console.log(err)});    
  }

  const getStockKeyword = async () => {
    await axios.get('/api/stock/keyword')
      .then(response => {
        console.log(response);
      }).catch(err => {console.log(err)});
  }

  const deleteStockKeyword = async () => {
    console.log(stockKeyword)
    await axios.delete('/api/stock/keyword', {
      data: {
        keyword:stockKeyword
      }
    })
      .then(response => {
        console.log(response);
      }).catch(err => {console.log(err)});    
  }

  return (
    <div id="google-test">
        <input className="input" name="news" onChange={e => {keyword=e.target.value}}/>
      {
        isLogin ?       
          (
          <div>
          <a href="/auth/logout">로그아웃</a><br></br>
          <input className="input" name="youtubekeyword" placeholder="지울 유튜브 키워드 입력하기" onChange={e => setYoutubeKeyword(e.target.value)}></input><br></br>
          <button onClick={deleteYoutubeKeyword}>Youtube 키워드 지우기</button><br></br>
          <button className="test" onClick={getYoutubeKeyword}>
            사용자가 저장한 유튜브 키워드 가져오기
          </button><br></br>
          <input className="input" name="stockkeyword" placeholder="지울 주식 종목 입력하기" onChange={e => setStockKeyword(e.target.value)}></input><br></br>
          <button onClick={deleteStockKeyword}>주식 종목 지우기</button><br></br>
          <button className="test" onClick={getStockKeyword}>
            사용자가 저장한 주식 종목 가져오기
          </button><br></br>
          <button>유저 수정</button><br></br>
          <a onClick={userDelete} href="/auth/logout">유저 삭제</a>
          </div>
          ): 
          <div>
          <a href="http://localhost:8001/auth/google">구글 아이디로 로그인</a><br></br>
          <button onClick={addLocalKeyword}>키워드 추가</button><br></br>
          <button onClick={removeKeyword}>키워드 삭제</button>
          </div>
      }

    </div>
  )
}
function News(){
  const [newsKeyword,setNewsKeyword]=useState(``);

  const newsApi=async()=>{
    const {data}=await axios.post('/api/news',{keyword:newsKeyword});
    console.log(data);
  }
  const hotNewsApi=async()=>{
    const {data}=await axios.get('/api/news');
    console.log(data);
  }
  return (
    <div>
      <input className="input" name="news" onChange={e => setNewsKeyword(e.target.value)}/>
      <button className="test" onClick={newsApi}>
      뉴스검색하기
      </button> 
      <button className="test" onClick={hotNewsApi}>
      헤드라인 뉴스 가져오기
      </button> 
    </div>
  )
}

//input 박스 담는거 하나로 통합
function Weather(){
  const [location,setMyLocation]=useState({});
  const weatherApi=async()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(async (position)=>{
        setMyLocation({lat:position.coords.latitude,lon:position.coords.longitude});
        const {data}=await axios.post('/api/weather',{lat:position.coords.latitude,lon:position.coords.longitude});
        console.log(data);
      },(error)=>{
        console.error(error);
      },{
        enableHighAccuracy:false,
        maximumAge:0,
        timeout:Infinity
      });
    }else{
      alert('GPS를 지원하지 않음');
    }

  }
  const baseWeather=async()=>{
    const {data}=await axios.get('/api/weather');
    console.log(data);
  }
 
  return (
    <div>
      <button className="test" onClick={weatherApi}>
      현재위치 날씨 가져오기
      </button>
      <button className="test" onClick={baseWeather}>
      날씨 기본값 가져오기
      </button>
    </div>
  )
}

const Youtube = () => {
  const [youtubeKeyword, setYoutubeKeyword] = useState(null);

  const getYoutubePopularVideoData = async () =>{
    await axios.get(
      '/api/youtube',
    ).then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
    })
  }

  const getYoutubeData = async () => {
    await axios.post(
      '/api/youtube', 
      {keyword:youtubeKeyword})
      .then(response => {
        console.log(response);
      }).catch(err => {console.log(err)});
  }

  return (
    <div id="youtube-test">
      <p>유튜브 키워드 검색</p>
      <input className="input" name="youtube" placeholder="검색하기" onChange={e => setYoutubeKeyword(e.target.value)}></input>
      <button className="test" onClick={getYoutubeData}>
        유튜브 검색 결과 가져오기
      </button>
      <p>실시간 인기 급상승 동영상</p>
      <button className="test" onClick={getYoutubePopularVideoData}>
        실시간 인기 급상승 동영상 가져오기
      </button>
    </div>
  )
}

const Stock = () => {
  const [stockKeyword, setStockKeyword] = useState(null);

  const getStockData = async () => {
    await axios.post(
      '/api/stock', 
      {keyword:stockKeyword})
      .then(response => {
        console.log(response);
      }).catch(err => {console.log(err)});
  }

  const getTopTradingStockData = async () => {
    await axios.get(
      '/api/stock'
    ).then(response => {
      console.log(response);
    }).catch(err => {console.log(err)});
  }

  return ( 
    <div id="stock-test">
      <p>주식 정보 검색</p>
      <input className="input" name="stock" placeholder="검색하기" onChange={e => setStockKeyword(e.target.value)}></input>
      <button className="test" onClick={getStockData}>
        주식 정보 가져오기
      </button>
      <p>거래량 상위 주식 정보 가져오기</p>
      <button className="test" onClick={getTopTradingStockData}>거래량 상위 주식 정보 가져오기</button>
    </div>
  )
  
}

const Coin = () => {
  const [coinKeyword, setCoinKeyword] = useState(null);

  const getCoinData = async () => {
    await axios.post(
      '/api/coin', 
      {keyword:coinKeyword})
      .then(response => {
        console.log(response);
      }).catch(err => {console.log(err)});
  }

  return (
    <div id="coin-test">
      <p>코인 정보 검색</p>
      <input className="input" name="coin" placeholder="검색하기" onChange={e => setCoinKeyword(e.target.value)}></input>
      <button className="test" onClick={getCoinData}>
        코인 정보 가져오기
      </button>
    </div>
  )
}

const Indices = () => {
  const getIndices = async () => {
    await axios.get(
      '/api/indices'
      ).then(response => {
        console.log(response);
      }).catch(err => {
        console.log(err);
      })
  }

  return (
    <div id="indices-test">
      <p>지수 정보 가져오기</p>
      <button className="test" onClick={getIndices}>
        (KOSPI, KOSDAK)
      </button>
    </div>
  )
}

function Google() {
  const [isLogin, setIsLogin] = useState(false);

  const getLoginInfo = async () => {
    await axios.get(
      '/auth'
      ).then(response => {
        console.log(response);
        if (response.data == "") setIsLogin(false);
        else setIsLogin(true);
      }).catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
      getLoginInfo();
  }, [isLogin]);

  return (
    <div id="google-test">
      {
        isLogin ?       
          <a href="http://localhost:8001/auth/logout">로그아웃</a> : 
          <a href="http://localhost:8001/auth/google">구글 아이디로 로그인</a>
      }
    </div>
  )
}

const App = () => {

  return (
    <div className="App">
      <Youtube/>    
      <Stock/>        
      <Coin/>
      <News/>
      <Weather/>
      <Indices/>
      <CrudTest/>
     {/* <Google/>*/}
    </div>
  );
}

export default App;