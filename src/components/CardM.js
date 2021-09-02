import { useEffect, useState } from 'react';
import '../css/Components.css';

const CardM=(props)=>{
    const {thumbnail, title, name} = props;

    return (
        <div 
            className="card-m" 
            style={{width:200, height:60, borderRadius:5, border:'0px solid black', display:'flex', flexDirection:'row', backgroundColor:'white'}}>
            {/* 그림자 넣기 */}
                <div className="card-thumbnail">
                    <img src={thumbnail} style={{width:45, height:45}}/>
                </div>
                <div>
                    <div >
                        <h3>{title}</h3>
                    </div>
                    <div>
                        <p>{name}</p>
                    </div>
                </div>
        </div>
    )
}
export default CardM;