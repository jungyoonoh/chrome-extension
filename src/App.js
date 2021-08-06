import 'css/App.css';
import { useEffect, useState, useRef } from 'react';
import axios from "axios"

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
    testApi();
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
    </div>
  );
}

export default App;
