import 'css/Main.css';
import { useCallback, useRef } from 'react';
// import axios from "axios"
import Slider from "react-slick";
// import Slide from "./Slide"
import MainSlide from 'slides/MainSlide';
import StockSlide from 'slides/StockSlide';

import { AiFillHome } from 'react-icons/ai'
import { BsFillPersonFill, BsFillChatDotsFill } from 'react-icons/bs'
import {FaInfoCircle, } from 'react-icons/fa'
// https://react-icons.github.io/react-icons

const Main = () => {
    const slideRef = useRef(null)
    const onClickHome = ()=>{
        slideRef.current.slickGoTo(0);
    }
    const onClickInfo =()=>{
        window.open("https://accessible-hedgehog-77e.notion.site/Toast-daca621379c844da84071452a7f46734")
    }
    return (
        <div className="contents">
            <header>
                <div className="header-icons">
                    <button className="header-button">
                        <BsFillPersonFill className="header-icon" />
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
                    <StockSlide></StockSlide>

                </Slider>
            </div>
            {/* <footer>
                    <p>footer … </p>
                </footer> */}
        </div>


    );
}

export default Main;