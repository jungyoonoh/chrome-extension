import { useEffect, useState,forwardRef, useImperativeHandle} from 'react';
import axios from "axios"

import 'css/YoutubeSlide.css';
import YoutubeCardL from '../components/YoutubeCardL'
import CardM from 'components/CardM';

function YoutubeSlide(){
    const [keyword, setKeyword] = useState('')
    const onChange=(e)=>{
        setKeyword(e.target.value)
        console.log(e.target.value)
    }
    const [videos, setVideos] = useState([1,2,3, 4,5,6,7,8,9,10])
    const [keywords, setKeywords] = useState([])
    const maxLength = 5
    const addKeyword=()=>{
        if (!keywords.includes(keyword) && keyword!=="") // 아무것도 입력안했을 때, 이미 있을 때 예외처리 한 것
            keywords.push(keyword) 
            setKeyword('')
    }
    const deleteKeyword = (item)=>{
        setKeywords(keywords.filter((element) => element !== item))
    }
    return (
        <div>
            <div className="keyword-container">
                {
                    keywords.map((item)=>{
                        return(
                            <div className="keyword" onClick={()=>{deleteKeyword(item)}}>{item}</div>
                        )
                    })
                }
                {
                    keywords.length<maxLength &&
                        <div className="add-keyword-container">
                            <input value={keyword} onChange={onChange} className="add-keyword-input" maxLength={10}/> 
                            <button onClick={addKeyword} className="add-keyword-button">+</button>
                        </div>
                }
            </div>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
                <div>
                    {videos.map((item, index)=>{ 
                        if(index<5){
                            return(
                                <CardM title={item} thumbnail="" name="asdf" />
                            )
                        }
                    }
                    )}
                </div>
                
                <div>
                    {videos.map((item, index)=>{ 
                        if(index>=5&&index<10){
                            return(
                                <CardM title={item} thumbnail="" name="asdf" />
                            )
                        }
                    }
                    )}
                </div>
            </div>
        </div>
    )
}

export default YoutubeSlide;