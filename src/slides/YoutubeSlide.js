import { useEffect, useState,forwardRef, useImperativeHandle} from 'react';
import axios from "axios"

import 'css/YoutubeSlide.css';
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
    const addKeyword = async () => {
        if (!keywords.includes(keyword) && keyword!=="") // 아무것도 입력안했을 때, 이미 있을 때 예외처리 한 것
            keywords.push(keyword);
            // const {data} = await axios.patch(`/database/${keyword}/add`);
            // console.log(data);
            setKeyword('')
    }
    const deleteKeyword = async (item)=>{
        setKeywords(keywords.filter((element) => element !== item));
        // const {data}=await axios.patch(`/database/${keyword}/delete`);
        // console.log(data);
    }
    return (
        <div>
            <div className="keyword-container">
                {keywords.map((item)=>{
                    return(
                        <div className="keyword" onClick={()=>{deleteKeyword(item)}}>{item}</div>
                    )
                })}
                {keywords.length < maxLength &&
                    <div className="add-keyword-container">
                        <input value={keyword} onChange={onChange} className="add-keyword-input" maxLength={10}/> 
                        <button onClick={addKeyword} className="add-keyword-button">+</button>
                    </div>
                }
            </div>
            <div className='youtube_list'>
                <div className='list_box'>
                    {videos.map((item, index)=> { 
                        if(index < 5){
                            return(
                                <div className="list_item">
                                    <CardM title={item.title} thumbnail={item.thumbnails} name={item.channelTitle} url={item.videoUrl}/>
                                </div>
                            )
                        }
                    }
                    )}
                </div>
                <div className='list_box'>
                    {videos.map((item, index)=> { 
                        if(index >= 5 && index < 10){
                            return(
                                <div className="list_item">
                                    <CardM title={item.title} thumbnail={item.thumbnails} name={item.channelTitle} url={item.videoUrl}/>
                                </div>
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