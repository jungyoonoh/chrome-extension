// import { useEffect, useState } from 'react';
import '../css/Components.css';

const CardM=(props)=>{
    const {thumbnail, title, name, url} = props;

    return (
        <a href={url} target="_blank" className="card_m" >
            <img src={thumbnail} alt width="70" height="55" className="thumbnail"/>
            <div className="content">
                <strong className="title">{title}</strong>
                <p className="name">{name}</p>
            </div>
        </a>
    )
}
export default CardM;