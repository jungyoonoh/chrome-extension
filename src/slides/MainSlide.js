import { useEffect, useState,forwardRef, useImperativeHandle} from 'react';
import 'css/Main.css';
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
    const [testProps, setTestProps] = useState({
        main: {
            temp: 266.41,
            feels_like: 263.63,
            temp_min: 263.56,
            temp_max: 267.68,
            pressure: 1022,
            humidity: 41
            },
        icon: "http://openweathermap.org/img/wn/01n@2x.png",
        addr: "서울특별시 중구 회현동1가"
    });
    const ftoc = (f) => ((parseFloat(f)-32)*5/9).toFixed();
    // 2. 자주가는사이트

    // 3. 주식 top 5
    const [stockTop5, setStockTop5] = useState([])
    const [isStockLoaded, setIsStockLoaded] = useState(false)
    const defultData = [
        {rank:'1위', title:'로딩중', price:'', changeRate:'', url:''},
        {rank:'2위', title:'로딩중', price:'', changeRate:'', url:''},
        {rank:'3위', title:'로딩중', price:'', changeRate:'', url:''},
        {rank:'4위', title:'로딩중', price:'', changeRate:'', url:''},
        {rank:'5위', title:'로딩중', price:'', changeRate:'', url:''},
    ]
    useEffect(()=>{
        if (!isStockLoaded){
            setStockTop5(defultData)
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
    // const openStockDetail = (url)=>{
    //     window.open(url)
    // }
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
        <div className="main_slide">
            <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
            <div className='google_search'>
                <label for="google" className="blind">구글 검색창</label>
                <input id="google" className='google_search_input' value={searchTerm} onChange={onChange} onFocus={()=>{setIsInputFocused(true)}} onBlur={()=>{setIsInputFocused(false)}} onKeyPress={onCheckEnter}/>
                <button type="button" className='google_search_button' onClick={googleSearch}>
                    <BiSearch className='google_search_icon'/>
                    <span className="blind">검색하기</span>
                </button>
            </div>
            <section className='stock_ranking'>
                <div className="section_title_box">
                    <RiStockFill className="section_title_icon"/>
                    <h2 className="section_title">주식 거래량 Top 5</h2>
                    <button type="button" className='refresh_button' onClick={()=>{setIsStockLoaded(false)}}>
                        <BiRefresh className='refresh_icon'/>
                        <span className="blind">주식 top5 새로고침</span>
                    </button>
                </div>
                <ol className="stock_list">
                    {stockTop5.map((item)=>{
                        let price = "item_price";
                        let change_rate = "item_change_rate";
                        if (item.dir === "상승" || item.dir === "상한") {
                            price += " up";
                            change_rate += " up";
                            if (item.dir === "상한") change_rate += " em";
                        }
                        else if (item.dir === "하락" || item.dir === "하한") {
                            price += " down";
                            change_rate += " down";
                            if (item.dir === "하한") change_rate += " em";
                        }
                        return(
                            <li className="list_item">
                                <a href={item.url} target="_blank" className="item_link">
                                    <strong className="item_title">{item.title}</strong>
                                    <div className="item_price_box">
                                        <p className={price}>{item.price}</p>
                                        <p className={change_rate}>{item.changeRate}</p>
                                    </div>
                                </a>
                            </li>
                        )
                    })}
                </ol>
            </section>
            <div className="popular_section">
                <section className="popular_contents">
                    <img src={testProps.icon} alt="맑음" width="30" height="30"/>
                    <p>{testProps.addr}</p>
                    <p>
                        <span className="blind">섭씨</span>
                            {ftoc(testProps.main.temp)}
                        <span className="blind">도</span>
                    </p>
                    <p>
                        <span className="blind">최고기온</span>
                        {ftoc(testProps.main.temp_max)}
                    </p>
                    <p>
                        <span className="blind">최wj기온</span>
                        {ftoc(testProps.main.temp_min)}
                    </p>
                    <p>습도 {testProps.main.humidity}</p>
                </section>
                <section className="popular_contents">
                    뭐였도라
                </section>
            </div>
            <div className="popular_section">
                <section className="popular_contents">
                    <div className="section_title_box">
                        <GrYoutube className="section_title_icon"/>
                        <h2 className="section_title">유튜브 인기 동영상</h2>
                    </div>
                    <ol className="popular_contents_list">
                        {youtubeTop5.map((item, index)=>{
                            if (index < 4){
                                return(
                                    <li className="list_item">
                                        <CardM title={item.title} thumbnail={item.thumbnails} name={item.channelTitle} url={item.videoUrl}/>
                                    </li>
                                )
                            }
                        })}
                    </ol>
                </section>
                <section className="popular_contents">
                    <div className="section_title_box">
                        <BiNews className='section_title_icon'/>
                        <h2 className="section_title">언론사별 가장 많이 본 뉴스</h2>
                    </div>
                    <ol className="popular_contents_list">
                        {newsTop5.map((item)=>{
                            return(
                                <li className="list_item">
                                    <CardM title={item.title} thumbnail={item.thumb} name={item.comp} url={item.url}/>
                                </li>
                            )
                        })}
                    </ol>
                </section>
            </div>
        </div>
    )
}

export default MainSlide;