var searchCityEl= document.querySelector("#city-search");
var searchBtnEl= document.querySelector(".search-btn");
var cityHistory= document.querySelector(".city-history");
var current= document.querySelector(".current-city");
var currentTemp= document.querySelector(".temp");
var currentWind= document.querySelector(".wind-speed");
var currentHumid= document.querySelector(".humidity");
var currentUV= document.querySelector(".uv-index");
var futureDayDate;
var futureDayIcon;
var futureDayTemp;
var futureDayWS;
var futureDayHumid;
var history= [];
var city= [];


/*create variables for .current-city, .temp, .humidity, .wind-speed, uv-index,
future-date, future-icon, future-temp, future-wind-speed, future-humidity */

var displayWeather= function(event)
{
    event.preventDefault();
    
    //api call to get some of the current weather data, will use another fetch call to get more information
    var currentApiUrl= "https://api.openweathermap.org/data/2.5/weather?q="+ searchCityEl.value.trim() +"&units=imperial&appid=970d068bfc6e2a02c68140b48a10c8e0";
     
    fetch(currentApiUrl).then(function(response)
    {
        if (response.ok)
        {
            response.json().then(function(data){
                console.log(data);
                /*console.log("city name: "+data.name);
                console.log("icon: "+data.weather[0].icon);
                console.log("wind speed: "+data.wind.speed);
                console.log("temp in F: "+data.main.temp);
                console.log("humidity: "+data.main.humidity);*/
                
                //api url for the icon image
                var iconUrl= "https://openweathermap.org/img/wn/"+ data.weather[0].icon +"@2x.png";
                
                //api call for more data by using location (call needed to get uv index and future forcast)
                var bigApiUrl= "https://api.openweathermap.org/data/2.5/onecall?lat="+data.coord.lat+"&lon="+data.coord.lon+"&units=imperial&appid=970d068bfc6e2a02c68140b48a10c8e0";

                //copied from stack overflow to get current date without moment
                var currentDate = new Date().toLocaleDateString("en", {year:"numeric", day:"2-digit", month:"2-digit"});
                //console.log(date);
                /* usable variables:
                    data.name
                    data.weather[0].icon
                    data.wind.speed
                    data.main.temp
                    data.main.humidity
                    use trick to call uv index(need lat and long)
                    */
                
                //convert stuff to page
                //header setup
                current.textContent= data.name+ " "+currentDate+" "+data.weather[0].icon;
                
                //setup remaining info for current day
                currentTemp.textContent= "Temperature: " +data.main.temp+ " \xB0F";
                currentWind.textContent= "Wind Speed: " +data.wind.speed+ " MPH";
                currentHumid.textContent= "Humidity: " +data.main.humidity + " %";
                
                city= [data.name, current.textContent, 
                    currentTemp.textContent, currentWind.textContent, currentHumid.textContent];

                

                //set uv index and forcast
                getForecast(bigApiUrl);

                console.log(history);
                console.log(city);

                //save city info
                saveCity(city);

            });
        }
    });

};

var getForecast= function(url)
{
    fetch(url).then(function(response)
    {
        if (response.ok)
        {
            response.json().then(function(data)
            {
                //set uv index
                console.log(data);
                currentUV.textContent="UV Index: "+data.current.uvi;
                
                history= city.push(currentUV.textContent);
                
                //console.log((data.daily[0].dt)*1000);
                
                for (var i= 1; i < 6; i++)
                {
                    //copied code from stack overflow to convert time
                    var dateConvert= new Date(data.daily[i].dt*1000).toLocaleDateString("en-US");

                    futureDayDate= document.querySelector(".future-date-"+i);
                    futureDayIcon= document.querySelector(".future-icon-"+i);
                    futureDayTemp= document.querySelector(".future-temp-"+i);
                    futureDayWS= document.querySelector(".future-wind-speed-"+i);
                    futureDayHumid= document.querySelector(".future-humidity-"+i);

                    futureDayDate.textContent= dateConvert;
                    futureDayIcon.textContent= data.daily[i].weather[0].icon;
                    futureDayTemp.textContent= "Temperature: "+data.daily[i].temp.day+" \xB0F";
                    futureDayWS.textContent= "Wind Speed: "+data.daily[i].wind_speed+" MPH";
                    futureDayHumid.textContent= "Humidity: "+data.daily[i].humidity+" %";

                    history= city.push(futureDayDate.textContent, futureDayIcon.textContent, futureDayTemp.textContent, 
                        futureDayWS.textContent, futureDayHumid.textContent);
                }
            });
        }
    });
};

/*var getIcon= function(url)
{
    fetch(url).then(function(response)
    {
        if(response.ok)
        {
            response.blob().then(function(data)
            {
                console.log(data);
                var image= URL.createObjectURL(data);

                return image;
                
            });
        }
    });
};*/

//save to local storage
var saveCity= function(input)
{
    var searchedCity= document.createElement("button");
    searchedCity.textContent= input[0];
    searchedCity.classList= "saved-btn bg-info";
    cityHistory.appendChild(searchedCity);
    localStorage.setItem("city", JSON.stringify(input));
};

//load from local storage
var loadCities= function()
{
    if (cityHistory.hasChildNodes())
    {
        var simple= localStorage.getItem("city");
        var searchedCities= JSON.parse(simple);
        console.log(simple);
        console.log(searchedCities);

        current.textContent= searchedCities[1];
        currentTemp.textContent= searchedCities[2];
        currentWind.textContent= searchedCities[3];
        currentHumid.textContent= searchedCities[4];
        currentUV.textContent= searchedCities[5];

        for (var i= 1; i < 6; i++)
        {
            futureDayDate= document.querySelector(".future-date-"+i);
            futureDayIcon= document.querySelector(".future-icon-"+i);
            futureDayTemp= document.querySelector(".future-temp-"+i);
            futureDayWS= document.querySelector(".future-wind-speed-"+i);
            futureDayHumid= document.querySelector(".future-humidity-"+i);

            var count= 0;

            futureDayDate.textContent= searchedCities[6+count]; count++;
            futureDayIcon.textContent= searchedCities[6+count]; count++;
            futureDayTemp.textContent= searchedCities[6+count]; count++;
            futureDayWS.textContent= searchedCities[6+count]; count++;
            futureDayHumid.textContent= searchedCities[6+count]; count++;
        }
    }
};

//loadCities();

//console.log(searchCityEl.value);
searchBtnEl.addEventListener("click", displayWeather);
//$(".saved-btn").on("click", loadCities);