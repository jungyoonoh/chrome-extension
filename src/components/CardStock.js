import '../css/Components.css';

const CardStock=(props)=>{
    const {title,price,changePrice,changeRate,yesterday, capitalization,tradingVolume,
        capitalizationRank} = props;

    return (
        <a href={'!#'} target="_blank" className="card_stock" rel="noreferrer" >
            <div className="content">
                <p className="capitalizationRank">{capitalizationRank}</p>
                <strong className="title">{title}</strong>
                <p className="price"><bold>현재가</bold> : {price} </p>
                <p className='change'>
                    {
                        changePrice>0?<span className='changePrice _up'>{changePrice}</span>
                        :<span className='changePrice _down'>{changePrice}</span> 
                    }
                    <span className='changeRate'>{changeRate}</span>
                </p>
                {
                    yesterday?(<p className="yesterday">전일 종가 : {yesterday}</p>):<></>
                }
                <p className="capitalization">거래량 : {capitalization}</p>
                <p className="tradingVolume">시가 총액 : {tradingVolume}</p>
            </div>

            
            
        </a>
    )
}
export default CardStock;