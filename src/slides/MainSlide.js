import { useEffect, useState } from 'react';
import 'css/MainSlide.css';
import axios from "axios"
import {GrFormRefresh, } from 'react-icons/gr'

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
    // channelTitle: "김안드"
    // description: "ㅠㅠ."
    // thumbnails: "https://i.ytimg.com/vi/LABr_O5MQKY/hqdefault.jpg"
    // title: "ㅁㄴㅇㄹ"
    // videoUrl: "https://www.youtube.com/watch?v=LABr_O5MQKY"

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
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <p>주식 거래량 Top 5</p>
                        <button className='refresh-button' onClick={()=>{setIsStockLoaded(false)}}><GrFormRefresh /></button>
                    </div>
                    {stockTop5.map((item)=>{
                        var dir = item.dir
                        return(
                            <div
                                className='stock'
                                style={{display:'flex', flexDirection:'row', backgroundColor:'pink', marginBottom:3}}
                                onClick={()=>{openStockDetail(item.url)}}>
                                <p>{item.title} </p>
                                <p>{item.price} </p>
                                <p>{item.changeRate}</p>
                            </div>

                        )
                    })}
                </div>
            </div>
            <div style={{display:'flex', flexDirection:'row'}}>
                <div className='youtube-top5' style={{backgroundColor:'green'}}>

                </div>
                <div className='news-top5' style={{backgroundColor:'aqua'}}>
                    {newsTop5.map((item, index)=>{
                        return(
                            <div
                                className='news'
                                onClick={()=>{openNewsDetail(item.thumb)}}>
                                <p>{item.comp}</p>
                                <p>{item.title}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default MainSlide;