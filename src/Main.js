import 'css/Main.css';
import { useRef, useState, useEffect} from 'react';
import axios from "axios"
import Slider from "react-slick";
// import Slide from "./Slide"
import MainSlide from 'slides/MainSlide';
import StockSlide from 'slides/StockSlide';

import { AiFillHome } from 'react-icons/ai'
import { BsFillPersonFill, BsFillChatDotsFill } from 'react-icons/bs'
import {FaInfoCircle, } from 'react-icons/fa'
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
    return (
        <div className="contents">
            <header>
                <div className="header-icons">
                    {userName!==null&& <p style={{color:'white'}}>{userName}님 안녕하세요!</p>}
                    <button className="header-button">
                        <BsFillPersonFill className="header-icon" onClick={Login}/>
                        
                    </button>
                    <button className="header-button">
                        <AiFillHome className="header-icon" onClick={onClickHome}/>
                    </button>
                    <button className="header-button">
                        <FaInfoCircle className="header-icon" onClick={onClickInfo}/>
                    </button>
                </div>
            </header>
            <div className="main">
                <Slider
                    style={{}}
                    speed={500}
                    dots={true}
                    ref={slideRef}
                >
                    <MainSlide></MainSlide>
                    {/* <StockSlide></StockSlide> */}
                    <YoutubeSlide></YoutubeSlide>

                </Slider>
            </div>
            {/* <footer>
                    <p>footer … </p>
                </footer> */}
        </div>


    );
}

export default Main;