import 'css/Main.css';
import { useRef, useState, useEffect} from 'react';
import axios from "axios"
import Slider from "react-slick";
// import Slide from "./Slide"
import MainSlide from 'slides/MainSlide';
import StockSlide from 'slides/StockSlide';

import { AiFillHome } from 'react-icons/ai';
import { BsFillPersonFill,  } from 'react-icons/bs';
import {FaInfoCircle, } from 'react-icons/fa';
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import YoutubeSlide from 'slides/YoutubeSlide';
// https://react-icons.github.io/react-icons

const Main = () => {
    const slideRef = useRef(null)
    const onClickHome = ()=>{
        slideRef.current.slickGoTo(0);
    }
    const onClickInfo =()=>{
        window.open("https://accessible-hedgehog-77e.notion.site/Toast-daca621379c844da84071452a7f46734")
    }
    const [userName, setUserName] = useState(null)
    const [isLogin, setIsLogin] = useState(false)
    const Login=()=>{
        if (isLogin){
            setUserName(null)
            window.location.href = "http://localhost:3001/auth/logout"
        }else{
            window.location.href="http://localhost:3001/auth/google"
        }
        // const {data}=await axios.get(`/database`);
        // setUserName(data.displayName)
    }
    const getLoginInfo = async () => {//로그인 여부 체크
        await axios.get(
          '/auth'
          ).then(response => {
            console.log(response);
            if (response.data == "") setIsLogin(false);
            else setIsLogin(true);
            setUserName(response.data.displayName)
          }).catch(err => {
            console.log(err);
          })
    }
    useEffect(() => {
        if (!isLogin){
            getLoginInfo()
        }
    }, [isLogin])
    const goLeft = () => {
        slideRef.current.slickPrev();
    }
    const goRight = () => {
        slideRef.current.slickNext();
    }
    return (
        <div className="wrap">
            <header className="header">
                <h1 className="blind">베지-토스트</h1>
                {userName !== undefined && <p className="header_msg">{userName}님 안녕하세요!</p>}
                <div className="header_icons">
                    <button className="header_button">
                        <FiArrowLeft className="header_icon" onClick={goLeft}/>
                        <span className="blind">왼쪽 슬라이드로</span>
                    </button>
                    <button className="header_button">
                        <BsFillPersonFill className="header_icon" onClick={Login}/>
                        <span className="blind">로그인</span>
                    </button>
                    <button className="header_button">
                        <AiFillHome className="header_icon" onClick={onClickHome}/>
                        <span className="blind">홈으로</span>
                    </button>
                    <button className="header_button">
                        <FaInfoCircle className="header_icon" onClick={onClickInfo}/>
                        <span className="blind">개발자 정보</span>
                    </button>
                    <button className="header_button">
                        <FiArrowRight className="header_icon" onClick={goRight}/>
                        <span className="blind">오른쪽 슬라이드로</span>
                    </button>
                </div>
            </header>
            <main className="main">
                <Slider
                    speed={500}
                    dots={true}
                    ref={slideRef}
                    arrows={false}
                    infinite={true}>
                        <MainSlide></MainSlide>
                        <YoutubeSlide></YoutubeSlide>
                        <StockSlide></StockSlide>
                </Slider>
            </main>
        </div>


    );
}

export default Main;