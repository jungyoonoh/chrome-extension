import 'css/Main.css';
import { useEffect, useState, useRef } from 'react';
import axios from "axios"
import Slider from "react-slick";
// import Slide from "./Slide"
import MainSlide from 'slides/MainSlide';


import { AiFillHome } from 'react-icons/ai'
import { BsFillPersonFill, BsFillChatDotsFill } from 'react-icons/bs'
// https://react-icons.github.io/react-icons

const Main = () => {
   
    return (
        <div className="bg">
            <div className="contents">
                <header>
                    <div className="header-icons">
                        <button className="header-button">
                            <BsFillPersonFill className="header-icon" />
                        </button>
                        <button className="header-button">
                            <AiFillHome className="header-icon" />
                        </button>
                        <button className="header-button">
                            <BsFillChatDotsFill className="header-icon" />
                        </button>
                    </div>
                </header>
                <div className="main">
                    <Slider
                        style={{}}
                        speed={500}
                        dots={true}
                        >
                            <MainSlide></MainSlide>
                            
                    </Slider>
                </div>
                <footer>
                    <p>footer … </p>
                </footer>
            </div>

        </div>
    );
}

export default Main;