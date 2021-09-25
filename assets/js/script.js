//Use moment.js to get today's date and display in currentDay element
var currentDay = moment().format("dddd, Do MMMM, YYYY");
$("#currentDay").text("Today is " + currentDay);

//change colour for time of day (e.g sunrise/sunset orange, midday blue, night dark grey);
var currentHour = moment().hour();
console.log(currentHour);

//page element vriables
var checkWeatherButton = document.getElementById("checkWeather");
var displayWeatherEl = document.querySelector("#displayWeather");
var cityInput = document.querySelector("#cityInput");

var apiKey = "892a001eaf149bea14813996e20dbc89";

//one call uses lat and long to find city, use weather api to get list of cities and their lats a
//longs to input into onecall?

function getCityName(event) {
    event.preventDefault();
    var city = cityInput.value.trim();

    if (city) { //call first api and send to local storage
        getApi(city);
        storeCity(city);
        cityInput.value= '';
        var cityName = document.createElement("h1");
        cityName.textContent = city;
        displayWeatherEl.appendChild(cityName);
    } else {
        alert("Please enter a city");
    }
}

function storeCity() {
    //add to local storage
}

//fetch api
function getApi(city) {
    var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + apiKey;

    fetch(requestURL)
    .then(function (response) {
        if(response.ok) { // if response found
      console.log(response.status);
      return response.json();
        } else {
            throw new console.error(("Fetch denied"));
        }
    })

    .then(function (data) {
        console.log(data);
        var latitude = data.coord.lat;
        var longitude = data.coord.lon;
        getCityData(latitude, longitude);
    });

    //call second api function and insert lat and long from first api
    function getCityData(latitude, longitude) {

        var requestURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+latitude+'&lon='+longitude+'&exclude=hourly,minutely&units=metric&appid=' + apiKey;
        //works!
        
    fetch(requestURL)
      .then(function (response) {
          if(response.ok) { // if response found
        console.log(response.status);
        return response.json();
          } else {
              alert('Error: ' + response.status)
              //throw new console.error(("Fetch denied"));
          }
      })

      .then(function (data) {
          console.log(data);
          displayWeatherData(data);
      });
  }
}

  function displayWeatherData(data) { //current weather data

    var date = document.createElement("h2");
    date.textContent = moment().format("do MMMM,YYYY");

    var sectionTitle = document.createElement('h3');
    sectionTitle.textContent = "Current";

    //append all to beginning of display element
    displayWeatherEl.appendChild(date);
    displayWeatherEl.appendChild(sectionTitle);

    //get weather icon
    //var weatherIcon = weatherInfo[1].icon;
    //var image = document.createElement('img');
    //image.src = "https://openweathermap.org/img/wn/"+weatherIcon+"@2x.png;";

    var weatherInfoArray = [
    "Weather: " + data.current.weather[0].description,
    "Temperature: " + data.current.temp.toFixed(1) +"℃",
    "Humidity: " + data.current.humidity + "%",
    "Wind Speed: " + data.current.wind_speed.toFixed(1) + "Km/h",
    ];

        for (let index = 0; index < weatherInfoArray.length; index++) {
            var sectionInfo = document.createElement("p");
            sectionInfo.innerHTML = weatherInfoArray[index];
            displayWeatherEl.appendChild(sectionInfo); //append current weather data to display element
      }

    
    //forcast weather data
    var sectionTitle = document.createElement('h1');
    sectionTitle.textContent = "5 Day Forcast";
    displayWeatherEl.appendChild(sectionTitle);

    var days = 4 //number of days to forcast (max 7);

    for (let index = 0; index < days; index++) { // 0 is tomorrow
        //create card for each day
        var card = document.createElement("card");
        var day = document.createElement("h2");

        //use moment.js to get correct next 5 days?
        if(index === 0) {
            day.textContent = "Tomorrow";
        } else {
            day.textContent = "Day " + index;
        }

        displayWeatherEl.appendChild(day);

        //add content
        var info = [
            "Weather: " + data.daily[index].weather[0].description,
            "Max Temperature: " + data.daily[index].temp.max.toFixed(1)+"℃",
            "Min Temperature: " + data.daily[index].temp.min.toFixed(1)+"℃", 
            "Humidity: " + data.daily[index].humidity + "%", 
            "Wind Speed: " + data.daily[index].wind_speed.toFixed(1) + "Km/h",
        ];

        for (let i = 0; i < info.length; i++) {
            var dailyInfo = document.createElement("p");
            dailyInfo.textContent = info[i];
            card.appendChild(dailyInfo);
        }
            displayWeatherEl.appendChild(card);
    }
  }

  checkWeatherButton.addEventListener("click", getCityName);
