import { useEffect, useState,forwardRef, useImperativeHandle} from 'react';
import axios from "axios"

import 'css/YoutubeSlide.css';
import CardM from 'components/CardM';

function YoutubeSlide(){
    const [keyword, setKeyword] = useState('')
    const onChange = (e) => {
        setKeyword(e.target.value);
    }
    const [videos, setVideos] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const maxLength = 6
    const addKeyword = () => {
        if (!keywords.includes(keyword) && keyword!=="") {
            let temp = keywords.slice();
            temp.push(keyword);
            setKeywords(temp);
            setKeyword('')
        }
    }
    const deleteKeyword = (item) => {
        let temp = keywords.slice();
        setKeywords(temp.filter((element) => element !== item));
        axios
        .delete('/api/youtube/keyword', {
            data: {keyword:item}
        })
        .then(response => {
          console.log(response);
        })
        .catch(err => {console.log(err)});    
    }
    // 로그인되어있는경우 유투브 키워드 가져옴
    useEffect(() => {
        axios.get('/api/youtube/keyword')
          .then(response => {
            console.log(response);
            setKeywords(response.data);
          }).catch(err => {console.log(err)});
    }, []);

    useEffect(() => {
        axios
            .post(
                '/api/youtube', 
                {keyword:keywords})
            .then(response => {
                console.log("response", response);
                setVideos(response.data);
            })
            .catch(err => {console.log(err)});
    }, [keywords]);
    
    return (
        <>
            <div className="keyword-container">
                {keywords.map((item)=>{
                    return (
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
                            return (
                                <div className="list_item">
                                    <CardM title={item.title} thumbnail={item.thumbnails} name={item.channelTitle} url={item.videoUrl}/>
                                </div>
                            )
                        }
                    })}
                </div>
                <div className='list_box'>
                    {videos.map((item, index)=> { 
                        if(index >= 6 && index < 11){
                            return(
                                <div className="list_item">
                                    <CardM title={item.title} thumbnail={item.thumbnails} name={item.channelTitle} url={item.videoUrl}/>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </>
    )
}

export default YoutubeSlide;