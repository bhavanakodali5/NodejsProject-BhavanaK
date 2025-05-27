require('dotenv').config()
const axios=require('axios')


const city =process.argv[2]||"Delhi";

const API_KEY=process.env.API_KEY;

console.log('API_KEY:',process.env.API_KEY);

const URL=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`;
console.log(URL)

axios.get(URL)
  .then(response => {
    const data = response.data;
    console.log(`Weather in ${data.name}, ${data.sys.country}:`);
    console.log(`Temperature: ${data.main.temp}°F`);
    console.log(`Condition: ${data.weather[0].description}`);
  })
  .catch(error => {
    console.log("Error fetching weather:", 
    (error.response && error.response.data && error.response.data.message) || error.message
  );  
  });