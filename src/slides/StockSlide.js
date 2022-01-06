import { useEffect, useState,} from 'react';
import axios from "axios";

import 'css/YoutubeSlide.css';

const StockSlide=()=>{
    const [keyword, setKeyword] = useState('');
    const [stockData, setStockData] = useState([]);
    const onChange=(e)=>{
        setKeyword(e.target.value)
        console.log(e.target.value)
    }
    const getStock = () => {
        axios.post(
            '/api/stock', 
            {keyword:keyword})
            .then(response => {
              setStockData(response.data);
            })
            .catch(err => {console.log(err)});
    }

    return(
        <div style={{backgroundColor:'pink'}}>
            <div className="add-keyword-container">
                <input value={keyword} onChange={onChange} className="add-keyword-input" maxLength={10}/> 
                <button onClick={getStock} className="add-keyword-button">+</button>
            </div>
            {/* <div>{stockData}</div> */}
        </div>
    )
}

export default StockSlide;