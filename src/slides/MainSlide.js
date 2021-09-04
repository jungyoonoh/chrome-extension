import { useEffect, useState,} from 'react';
import 'css/MainSlide.css';
import axios from "axios"
import {GrFormRefresh, GrYoutube, } from 'react-icons/gr'
import {BiSearch, BiNews, BiRefresh} from 'react-icons/bi'
import {RiStockFill, } from 'react-icons/ri'

import CardM from "../components/CardM"

function MainSlide() {
    // 1. 구글 검색창
    const [searchTerm, setSearchTerm] = useState('')
    const [isInputFocused, setIsInputFocused] = useState(false)
    const onChange=(e)=>{
        setSearchTerm(e.target.value)
        console.log(e.target.value)
    }
    const googleSearch=()=>{
        if (searchTerm!=""){
            let link="https://www.google.com/search?q="+searchTerm
            window.open(link)
        }
    }
    const onCheckEnter = (e)=>{
        if (e.key==='Enter' && isInputFocused){
            googleSearch()
        }
    }
    // 2. 자주가는사이트

    // 3. 주식 top 5
    const [stockTop5, setStockTop5] = useState([])
    const [isStockLoaded, setIsStockLoaded] = useState(false)
    useEffect(()=>{
        if (!isStockLoaded){
            axios.get(
                '/api/stock'
              ).then(response => {
                console.log(response.data);
                let data = response.data
                setStockTop5(Object.values(data))
                
              }).catch(err => {console.log(err)});
            setIsStockLoaded(true)
        }
    },[isStockLoaded])
    const openStockDetail = (url)=>{
        window.open(url)
    }
    // 4. 유튜브 top 5

    const [youtubeTop5, setYoutubeTop5] = useState([])
    const [isYoutubeLoaded, setIsYoutubeLoaded] = useState(false)
    useEffect(()=>{
        if (!isYoutubeLoaded){
            axios.get(
                '/api/youtube'
              ).then(response => {
                console.log(response.data);
                let data = response.data
                setYoutubeTop5(data)
              }).catch(err => {console.log(err)});
              setIsYoutubeLoaded(true)
        }
    },[isYoutubeLoaded])
    const openYoutubeDetail =(url)=>{
        window.open(url)
    }
    // 5. 뉴스 top 5
    const [newsTop5, setNewsTop5] = useState([])
    const [isNewsLoaded, setIsNewsLoaded] = useState(false)
    useEffect(()=>{
        if (!isNewsLoaded){
            axios.get(
                '/api/news'
              ).then(response => {
                console.log(response.data);
                let data = response.data
                setNewsTop5(data)
              }).catch(err => {console.log(err)});
            setIsNewsLoaded(true)
        }
    },[isNewsLoaded])
    const openNewsDetail =(url)=>{
        window.open(url)
    }

    return (
        <div style={{}}>
            <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around', marginBottom:10}}>
                <div>
                    <div className='google-search' style={{}}>
                        <div className='google-search-left'></div>
                        <input className='google-search-input' value={searchTerm} onChange={onChange} onFocus={()=>{setIsInputFocused(true)}} onBlur={()=>{setIsInputFocused(false)}} onKeyPress={onCheckEnter}/>
                        <button 
                            className='google-search-button'
                            onClick={googleSearch}>
                            <BiSearch className='google-search-icon'/>
                        </button>
                    </div>
                    <div className='frequent-sites' style={{backgroundColor:'yellow'}}>
                        
                    </div>
                </div>
                <div className='stock-top5'>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                        <RiStockFill className='h1-icon'/>
                        <h2>주식 거래량 Top 5</h2>
                        <button className='refresh-button' onClick={()=>{setIsStockLoaded(false)}}>
                            <BiRefresh className='refresh-icon'/>
                        </button>
                    </div>
                    {stockTop5.map((item)=>{
                            // changePrice: "+30"
                            // changeRate: "+1.50%"
                            // dir: "상승"
                            // price: "2,025"
                            // rank: "1위"
                            // title: "KODEX 200선물인버스2X"
                            // url: "https://finance.naver.com
                        const dir = item.dir
                        return(
                            <div
                                className='stock'
                                onClick={()=>{openStockDetail(item.url)}}>
                                <p style={{marginRight:3, color:'#595959'}}>{item.rank}</p>
                                <h3
                                    style={{width:150, textOverflow:'ellipsis',overflow:'hidden', whiteSpace:'nowrap'}}>
                                    {item.title}
                                </h3>
                                <p style={{width:80, color:dir==="상승"||dir==="상한"?'#ed0101':dir==="하락"||dir==="하한"?'#0c44ac':'#595959'}}>
                                    {item.price}
                                </p>
                                <p style={{width:80, color:dir==="상승"||dir==="상한"?'#970005':dir==="하락"||dir==="하한"?'#000052':'#595959', fontWeight:dir==="상한"||dir==="하한"?'bold':'normal'}}>{item.changeRate}</p>
                            </div>

                        )
                    })}
                </div>
            </div>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
                <div className='youtube-top5'>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <GrYoutube className='h1-icon'/>
                        <h2>유튜브 인기 동영상</h2>
                    </div>
                    {youtubeTop5.map((item, index)=>{
                        return(
                            <div
                                className='youtube'
                                onClick={()=>{openYoutubeDetail(item.videoUrl)}}>
                                <CardM title={item.title} thumbnail={item.thumbnails} name={item.channelTitle}/>
                            </div>
                        )
                    })}
                </div>
                <div className='news-top5'>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <BiNews className='h1-icon'/>
                        <h2>언론사별 가장 많이 본 뉴스</h2>
                    </div>
                    {newsTop5.map((item, index)=>{
                        return(
                            <div
                                className='news'
                                onClick={()=>{openNewsDetail(item.url)}}>
                                <CardM title={item.title} thumbnail={item.thumb} name={item.comp}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default MainSlide;