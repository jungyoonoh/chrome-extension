// import { useEffect, useState } from 'react';
import '../css/Components.css';

const CardM=(props)=>{
    const {thumbnail, title, name} = props;

    return (
        <div 
            className="card-m" 
            style={{}}>
                <div className="card-thumbnail">
                    <img src={thumbnail} style={{width:70, height:70,marginRight:5, borderRadius:7}} />
                </div>
                <div>
                    <div >
                        <h3 style={{textOverflow:'ellipsis', overflow:'hidden'}}>{title}</h3>
                    </div>
                    <div>
                        <p style={{textOverflow:'ellipsis', overflow:'hidden'}}>{name}</p>
                    </div>
                </div>
        </div>
    )
}
export default CardM;