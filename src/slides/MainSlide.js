 /*global chrome*/
import React, { useEffect, useState,forwardRef, useImperativeHandle} from 'react';
import 'css/Main.css';
import axios from "axios"
import {GrFormRefresh, GrYoutube, } from 'react-icons/gr'
import {BiSearch, BiNews, BiRefresh} from 'react-icons/bi'
import {RiStockFill, } from 'react-icons/ri'
import Moment from 'react-moment'; 
import 'moment/locale/ko';
import moment from "moment";

import CardM from "../components/CardM";

function MainSlide() {
    // 1. 구글 검색창
    const [searchTerm, setSearchTerm] = useState('')
    const [isInputFocused, setIsInputFocused] = useState(false)
    const onChange=(e)=>{
        setSearchTerm(e.target.value);
    }
    const googleSearch = () => {
        if (searchTerm!="") {
            let link="https://www.google.com/search?q=" + searchTerm;
            window.open(link);
        }
    }
    const onCheckEnter = (e) => {
        if (e.key==='Enter' && isInputFocused){
            googleSearch();
        }
    }
    const [isLogin, setIsLogin] = useState(false);
    useEffect(()=>{
        axios.get(
            '/auth'
        ).then(response => {
            console.log(response);
            if (response.data == "") setIsLogin(false);
            else setIsLogin(true);
        }).catch(err => {
            console.log(err);
        });
    },[isLogin]);

    const [testProps, setTestProps] = useState({
        main: {
            temp: 10.41,
            feels_like: 263.63,
            temp_min: 263.56,
            temp_max: 267.68,
            pressure: 1022,
            humidity: 41
            },
        icon: "http://openweathermap.org/img/wn/01n@2x.png",
        addr: "서울특별시 중구 회현동1가"
    });

    // 날짜
    const dayInfo = () => {        
        let today = moment();
        return today.format('YYYY년 MM월 DD일');
    }
    
    // 시간
    const clockInfo = () => {
        let today = moment();
        return today.format('A hh:mm');
    }

    // 2. 자주가는사이트
    const [topSites,setTopSites]=useState([
        {title: 'NAVER', url: 'http://www.naver.com/'},
        {title: 'YouTube', url: 'https://www.youtube.com/'},
        {title: 'React App', url: 'http://localhost:8000/'},
        {title: 'GitHub', url: 'https://github.com/'},
        {title: '무신사 스토어', url: 'https://store.musinsa.com/app/'},
        {title: '건국대학교 eCampus', url: 'http://ecampus.konkuk.ac.kr/ilos/main/main_form.acl'},
        {title: '건국대학교 PORTAL', url: 'https://portal.konkuk.ac.kr/'},
        {title: '건국대학교 수강신청 시스템::', url: 'https://sugang.konkuk.ac.kr/'},
    ]);
    // const userTopSites=()=>{
    //     chrome.topSites.get((data)=>{
    //         setTopSites(data);
    //     });
    // }
    // useEffect(()=>{
    //     userTopSites();
    // },[])
    

    useEffect(()=>{
        console.log(topSites);
    },[topSites]);
    // 3. 주식 top 5
    const [stockTop5, setStockTop5] = useState([
        {rank:'1위', title:'로딩중', price:'', changeRate:'', url:''},
        {rank:'2위', title:'로딩중', price:'', changeRate:'', url:''},
        {rank:'3위', title:'로딩중', price:'', changeRate:'', url:''},
        {rank:'4위', title:'로딩중', price:'', changeRate:'', url:''},
        {rank:'5위', title:'로딩중', price:'', changeRate:'', url:''},
    ])
    const [isStockLoaded, setIsStockLoaded] = useState(false);
    useEffect(()=>{
        if (!isStockLoaded){
            axios.get(
                '/api/stock'
              ).then(response => {
                console.log(response.data);
                let data = response;
                // setStockTop5(Object.values(data));

                setStockTop5(response.data);
              }).catch(err => {console.log(err)});
            setIsStockLoaded(true)
        }
    },[isStockLoaded]);
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
                                <a href={item.url} target="_blank" className="item_link" rel="noreferrer">
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
                <section className="time_contents">
                    <p className='day_info'>{dayInfo()}</p>                    
                    <p className='clock_info'>{clockInfo()}</p>                    
                </section>
                <section className="topSites_contents">
                    <ul className='topSites_list'>
                    {
                        topSites.map((item,idx)=>{
                            if(idx<8){
                            return(
                                <li className='topSites_item'>
                                <a href={item.url}>
                                    <img className='topSites_img' alt="" src={'https://www.google.com/s2/favicons?sz=24&domain='+item.url}/>
                                    <strong className='topSites_label'>{item.title}</strong>
                                </a>
                                </li>
                            )
                            }
                        })
                    }
                    </ul>                 
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