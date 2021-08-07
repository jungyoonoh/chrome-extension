import 'css/App.css';
import { useEffect, useState, useRef } from 'react';
import axios from "axios"

let newsArray=[];
let weather=[];


function News(){
  const [newsKeyword,setNewsKeyword]=useState(``);

  const newsApi=async()=>{
    const {data}=await axios.post('/api/news',{keyword:newsKeyword});
   // console.log(data);
    newsArray=data;
    //console.log(newsArray);
  }
  return (
    <div>
      <input className="input" name="news" onChange={e => setNewsKeyword(e.target.value)}/>
      <button className="test" onClick={newsApi}>
      뉴스검색하기
      </button>
    {newsArray.map((item)=>{
      return(
        <div className='newsList'>
          <h3>{item.title} </h3>
          <p>{item.description}</p>
          <img src={item.thumb}/>
          <span>{item.comp}</span>
        </div>
      );
    })}   
    </div>
  )
}

function Weather(){
  const [cityKeyword,setCity]=useState(``);
  const weatherApi=async()=>{
    const {data}=await axios.post('/api/weather',{keyword:cityKeyword});
    weather[0]=data;
    console.log(data);
  }

  return (
    <div>
      <input className="input" name="weather" onChange={e => setCity(e.target.value)}/>
      <button className="test" onClick={weatherApi}>
      날씨검색하기
      </button>
  
      {weather.map((item)=>{
      return(
        <div className='weather'>
          <h3>{item.addr} </h3>
          <p>현재날씨 : {(item.main.temp-273.15).toFixed(2)}℃</p>
          <p>최고기온 : {(item.main.temp_max-273.15).toFixed(2)}℃ 최저기온 : {(item.main.temp_min-273.15).toFixed(2)}℃</p>
          <img src={item.icon}/>
          </div>
      );
    })} 
    
    </div>
  )
}

function App() {

  const [testValue, setTestValue] = useState(null); // 변수
  const [youtubeKeyword, setYoutubeKeyword] = useState(null);
  const [stockKeyword, setStockKeyword] = useState(null);
  const [coinKeyword, setCoinKeyword] = useState(null);
  const idFocus = useRef();

  const testApi = async () => {
    await axios.get('/api/news')
      .then(response => {
        console.log(response);
      }).catch(err => {console.log(err)});
  }

  const getYoutubeData = async () => {
    await axios.post(
      '/api/youtube', 
      {keyword:youtubeKeyword})
      .then(response => {
        console.log(response);
      }).catch(err => {console.log(err)});
  }

  const getStockData = async () => {
    await axios.post(
      '/api/stock', 
      {keyword:stockKeyword})
      .then(response => {
        console.log(response);
      }).catch(err => {console.log(err)});
  }

  const getCoinData = async () => {
    await axios.post(
      '/api/coin', 
      {keyword:coinKeyword})
      .then(response => {
        console.log(response);
      }).catch(err => {console.log(err)});
  }

  useEffect(() => {
    testApi()
  }, [testValue]);

  return (
    <div className="App">
      <p>유튜브 키워드 검색</p>
      <input className="input" name="youtube" ref={idFocus} placeholder="검색하기" onChange={e => setYoutubeKeyword(e.target.value)}></input>
      <button className="test" onClick={getYoutubeData}>
        유튜브 검색 결과 가져오기
      </button>
      <br></br>
      <p>주식 정보 검색</p>
      <input className="input" name="stock" ref={idFocus} placeholder="검색하기" onChange={e => setStockKeyword(e.target.value)}></input>
      <button className="test" onClick={getStockData}>
        주식 정보 가져오기
      </button>
      <br></br>
      <p>코인 정보 검색</p>
      <input className="input" name="coin" ref={idFocus} placeholder="검색하기" onChange={e => setCoinKeyword(e.target.value)}></input>
      <button className="test" onClick={getCoinData}>
        코인 정보 가져오기
      </button>
      <News/>
      <Weather/>
    </div>
  );
}

export default App;
