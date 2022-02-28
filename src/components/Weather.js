import 'css/Weather.css';
import axios from "axios";
import { useRef, useState, useEffect} from 'react';

const Weather = () => {

    const [testProps, setTestProps] = useState({
        main: {
            temp: 10.41,
            feels_like: 263.63,
            temp_min: 263.56,
            temp_max: 267.68,
            pressure: 1022,
            humidity: 41
            },
        icon: "http://openweathermap.org/img/wn/01n@2x.png",
        addr: "서울특별시 중구 회현동1가"
    });

    const ftoc = (f) => ((parseFloat(f)-32)*5/9).toFixed();

    return(        
        <section className="weather_box">
            <img src={testProps.icon} alt="맑음" width="30" height="30"/>
            <div className="temperature">
                <span className="blind">섭씨</span>
                    {ftoc(testProps.main.temp)}℃
                <span className="blind">도</span>
            </div>
            <p>{testProps.addr}</p>
            <p>
                <span className="blind">최고기온</span>
                최고기온 : {ftoc(testProps.main.temp_max)}
            </p>
            <p>
                <span className="blind">최저기온</span>
                최저기온 : {ftoc(testProps.main.temp_min)}
            </p>
            <p>습도 : {testProps.main.humidity}</p>
        </section>
    )
}

export default Weather;