import { useEffect, useState,} from 'react';
import axios from "axios";

import 'css/StockSlide.css';
import CardStock from 'components/CardStock';

const StockSlide=()=>{
    const [keyword, setKeyword] = useState('');
    const onChange = (e) => {
        setKeyword(e.target.value);
    }
    const [stockList, setStockList] = useState([]);
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
        .delete('/api/stock/keyword', {
            data: {keyword:item}
        })
        .then(response => {
          console.log(response);
        })
        .catch(err => {console.log(err)});    
    }
    // 로그인되어있는경우 유투브 키워드 가져옴
    useEffect(() => {
        axios.get('/api/stock/keyword')
          .then(response => {
            console.log(response);
            setKeywords(response.data);
          }).catch(err => {console.log(err)});
    }, []);

     useEffect(() => {
         setStockList([]);
        //순서가 중요하면 callback, 아니면 promise
         let params=[];
         keywords.forEach(element => {
             params.push({keyword:element});
         });
         Promise.all(
             params.map(async param=>{
                 return await axios.post('/api/stock', param)
             })
         ).then((response)=>{
             response.forEach(res=>{
                 setStockList(arr=>[...arr,res.data])
             })
         }).catch(err => {console.log(err)});
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
             <div className='stock_list'>
             <div className='list_box'>
                     {stockList.map((item, index)=> { 
                             return (
                                 <div className="list_item">
                                      <CardStock title={item.title} price={item.price} changePrice={item.changePrice} changeRate={item.changeRate} yesterday={item.yesterday}
                                      capitalization={item.capitalization} capitalizationRank={item.capitalizationRank} tradingVolume={item.tradingVolume}
                                      thumbnail={item.thumbnails} name={item.channelTitle} url={item.videoUrl}/> 
                                 </div>
                             )
                         
                     })}
             </div>
            
             </div>
             </>
     
    )
}

export default StockSlide;