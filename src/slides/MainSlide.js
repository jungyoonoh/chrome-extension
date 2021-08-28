import { useEffect, useState } from 'react';
import 'css/MainSlide.css';
import axios from "axios"


function MainSlide() {
    // 1. 구글 검색창
    const [searchTerm, setSearchTerm] = useState('')
    const [isInputFocused, setIsInputFocused] = useState(false)
    const onChange=(e)=>{
        setSearchTerm(e.target.value)
        console.log(e.target.value)
    }
    const googleSearch=()=>{
        let link="https://www.google.com/search?q="+searchTerm
        window.open(link)
    }
    const onCheckEnter = (e)=>{
        if (e.key=='Enter' && isInputFocused){
            googleSearch()
        }
    }
    // 2. 자주가는사이트

    // 3. 주식 top 5
    const [stockTop5, setStockTop5] = useState([])
    const [isStockLoaded, setIsStockLoaded] = useState(false)
    const getTopTradingStockData = async () => {
        await axios.get(
          '/api/stock'
        ).then(response => {
          console.log(response);
        }).catch(err => {console.log(err)});
      }

    return (
        <div style={{}}>
            <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
            <div style={{display:'flex', flexDirection:'row'}}>
                <div>
                    <div className='google-search' style={{backgroundColor:'pink'}}>
                        <input value={searchTerm} onChange={onChange} onFocus={()=>{setIsInputFocused(true)}} onBlur={()=>{setIsInputFocused(false)}} onKeyPress={onCheckEnter}/>
                        <button 
                            className='google-search-button'
                            onClick={googleSearch}>
                            검색
                        </button>
                    </div>
                    <div className='frequent-sites' style={{backgroundColor:'yellow'}}>
                        
                    </div>
                </div>
                <div className='stock-top5' style={{backgroundColor:'blue'}}>
                    <button onClick={getTopTradingStockData}>가져오기</button>
                </div>
            </div>
            <div style={{display:'flex', flexDirection:'row'}}>
                <div className='youtube-top5' style={{backgroundColor:'green'}}>

                </div>
                <div className='news-top5' style={{backgroundColor:'aqua'}}>

                </div>
            </div>
        </div>
    )
}

export default MainSlide;