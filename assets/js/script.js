//Use moment.js to get today's date and display in currentDay element
var currentDay = moment().format("dddd, Do MMMM, YYYY");
$("#currentDay").text("Today is " + currentDay);

//change colour for time of day (e.g sunrise/sunset orange, midday blue, night dark grey);
var currentHour = moment().hour();
console.log(currentHour);

//page element vriables
var checkWeatherButton = document.getElementById("checkWeather");

var cityInput = document.querySelector("#cityInput")

responseText = document.querySelector("#responseText");

var apiKey = "892a001eaf149bea14813996e20dbc89";
var city = "Sydney"; //needs city example to work properly until input function added
var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + apiKey;

//fetch api
function getApi(event) {
    event.preventDefault();
    fetch(requestURL)
      .then(function (response) {
          if(response.ok) { // if response found
        console.log(response.status);
        return response.json();
          } else {
              throw new console.error(("Fectch denied"));
          }
      })

      .then(function (data) {
          console.log(data);
          displayWeatherData(data);
      });
  }

  function displayWeatherData(data) {
    var weatherInfo = [data.main, data.weather[0]]; //reference needed sections of weather api in array
    //weather needs to reference another array in itself so needs [0] otherwise undefined

    var displayWeatherEl = document.querySelector("#displayWeather");

    //var temperature = weatherInfo.temp; //get individual references

    //temperature = temperature.toFixed(1); round to one decimal place

    var weatherInfoArray = [
    "Weather: " + weatherInfo[1].description + " " + weatherInfo[1].icon,
    "Temperature: " + weatherInfo[0].temp.toFixed(1) +"℃",
     "Max Temperature: " + weatherInfo[0].temp_max.toFixed(1) +"℃", 
     "Min Temperature: " + weatherInfo[0].temp_min.toFixed(1) +"℃", 
     
    ];

        for (let index = 0; index < weatherInfoArray.length; index++) {
            var sectionInfo = document.createElement("p");
            sectionInfo.innerHTML = weatherInfoArray[index];
            displayWeatherEl.appendChild(sectionInfo);
      }
}

  checkWeatherButton.addEventListener("click", getApi);

  /*convert input to city id
  function getCity(event) {
    event.preventDefault();
    //if city valid, call the api and generate the data
    if(cityInput) {
    getApi();
    } else {
        var warning = document.createElement("p");
        warning.text = "Invalid city name entered";
        cityInput.appendChild(warning);
        return;
    }
  }*/




// display weather for default location


//create elements from api info

//display in displayWeather

//when checkWeatherButton clicked, add input to storage and get input data