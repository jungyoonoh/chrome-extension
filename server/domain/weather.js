const axios = require('axios');


exports.getWeather=async(req,res)=>{
  const url=`https://api.openweathermap.org/data/2.5/weather?lat=37.5555892070291&lon=126.981204133005&appid=${process.env.WEATHER_API_KEY}`;
  axios.get(url).then((response)=>{
    if(response.status===200){
      const result= response.data;
      const weatherResult={
        main : result.main,
        icon : `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`,
        addr : `서울특별시 중구 회현동1가`,
      }
      res.status(200).set('charset=utf-8');  
      res.send(weatherResult); //string 값으로 받아옴
    }
  }).catch((error)=>{
    console.log(error);
  });
}

exports.postWeather=async(req,res)=>{
    const location = req.body;
    console.log("위치정보 : " + location);
    
     const url=`https://api.openweathermap.org/data/2.5/weather`;
     const params={
       lat:location.lat,
       lon:location.lon,
       appid:process.env.WEATHER_API_KEY,
     };
     const options={
       url:url,
       method:'get',
       params:params,
     };
     axios(options).then((response)=>{
       if(response.status===200){
         const result= response.data;
         const weatherResult={
           main : result.main,
           icon : `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`,
           addr : location.address,
         }
         res.status(200).set('charset=utf-8');  
         res.send(weatherResult); //string 값으로 받아옴
       }
     }).catch((error)=>{
       console.log(error);
     });
}