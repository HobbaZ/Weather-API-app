//Use moment.js to get today's date and display in currentDay element
var currentDay = moment().format("dddd, Do MMMM, YYYY");
$("#currentDay").text("Today is " + currentDay);

//page element vriables
var checkWeatherButton = document.getElementById("checkWeather");
var clearHistoryButton = document.getElementById("clearHistory");
clearHistoryButton.style.display = "none"; // hide clear button on page load

var displayWeatherEl = document.querySelector("#displayWeather");
var cityInput = document.querySelector("#cityInput");

//;ocal storage
var searches = [];

var apiKey = "892a001eaf149bea14813996e20dbc89";

//___________SEARCH CITY NAME__________________

function getCityName(event) { //search city after button click
    event.preventDefault();
    var city = cityInput.value.trim();

    if (city) { //call first api and send to local storage
        getApi(city);
        storeCity(city);

        displayWeatherEl.textContent = "";
        clearHistoryButton.style.display = "block";

    } else {
        alert("Please enter a city name");
        return;
    }
}

//___________________GET FIRST API___________________________

//fetch api
function getApi(city) {
    var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + apiKey;
    displayWeatherEl.innerHTML="";

    fetch(requestURL)
    .then(function (response) {
        if(response.ok) { // if response found
      console.log(response.status);
      return response.json();
        } else {
            alert('Error: ' + response.status + ", check the city spelling");
            return;
        }
    })

    .then(function (data) {
        console.log(data);
        var latitude = data.coord.lat;
        var longitude = data.coord.lon;
        var selectedCity = city
        getCityData(latitude, longitude, selectedCity);
    });

    //_______________GET SECOND API________________________

    //call second api function and insert lat and long from first api
    function getCityData(latitude, longitude, selectedCity) {
        //displayWeatherEl.innerHTML="";
        var requestURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+latitude+'&lon='+longitude+'&exclude=hourly,minutely&units=metric&appid=' + apiKey;

    fetch(requestURL)
      .then(function (response) {
          if(response.ok) { // if response found
        console.log(response.status);
        return response.json();
          } else {
              alert('Error: ' + response.status);
              return;
          }
      })

      .then(function (data) {
          console.log(data);
          displayWeatherData(data, selectedCity);
      });
  }
}

//_________________CURRENT WEATHER___________________________

  function displayWeatherData(data, selectedCity) { //current weather data
    
    var cityName = document.createElement("h1");
    cityName.textContent = selectedCity.toUpperCase();
    
    var currentCard = document.createElement("div");
        currentCard.classList.add("mainCardStyle");
        currentCard.classList.add("px-5");
        currentCard.appendChild(cityName);


    var date = document.createElement("h2");
    date.textContent = moment().format("Do MMM YYYY");

    var sectionTitle = document.createElement('h3');
    sectionTitle.textContent = "Current";

    //append all to beginning of display element
    currentCard.appendChild(date);
    currentCard.appendChild(sectionTitle);

    //get weather icon
    var imageContainer = document.createElement('div');
    var image = document.createElement('img');
    var weatherIcon = data.current.weather[0].icon;
    image.src = "https://openweathermap.org/img/wn/"+ weatherIcon +"@2x.png";
    imageContainer.appendChild(image);
    currentCard.appendChild(imageContainer);

    //convert unix time
    var unixDate = data.current.dt;
    var forecastDate = moment(unixDate*1000).format("Do MMM YYYY");

    var rating = document.createElement('p');

    //UV index ratings disappeared for some reason
    if (data.current.uvi >= 11) {
        rating.textContent = "UV: " + data.current.uvi.toFixed(1) + " Extreme";
        rating.style.backgroundColor = "red";

    } else if (data.current.uvi < 11 && data.current.uvi >= 8) {
        rating.textContent = "UV: " + data.current.uvi.toFixed(1) + " Very High";
        rating.style.backgroundColor = "orangered";

    } else if (data.current.uvi < 8 && data.current.uvi >= 6) {
        rating.innerHTML = "UV: " + data.current.uvi.toFixed(1) + " High";
        rating.style.backgroundColor = "orange";

    } else if (data.current.uvi < 6 && data.current.uvi >= 3) {
        rating.textContent = "UV: " + data.current.uvi.toFixed(1) + " Moderate";
        rating.style.backgroundColor = "green";
        
    } else {
        rating.innerHTML = "UV: " + data.current.uvi.toFixed(1) + " Low";
        rating.style.backgroundColor = "rgb(120, 179, 2)";
    }

    var weatherInfoArray = [
    "Weather: " + data.current.weather[0].description,
    "Temperature: " + data.current.temp.toFixed(1) +"℃",
    "Humidity: " + data.current.humidity + "%",
    "Wind Speed: " + data.current.wind_speed.toFixed(1) + "Km/h",

    ];

    for (let index = 0; index < weatherInfoArray.length; index++) {
        var sectionInfo = document.createElement("p");
        sectionInfo.textContent = weatherInfoArray[index];
        currentCard.appendChild(sectionInfo); //append current weather data to display element
        currentCard.appendChild(rating);
    }

    displayWeatherEl.appendChild(currentCard);
    
    //____________________5 DAY FORECAST_______________________

    var forecastContainer = document.createElement('div');
    forecastContainer.classList.add("row");

    var sectionTitle = document.createElement('h2');
    sectionTitle.textContent = "5 Day Forcast";
    displayWeatherEl.appendChild(sectionTitle);

    var days = 6; //number of days to forcast (max 8);

    for (let index = 1; index < days; index++) { // 1 is tomorrow, 0 is today
        //create card for each day
        var card = document.createElement("div");
        card.classList.add("cardStyle");
        card.classList.add("col-lg");
        card.classList.add("col-sm-12");
        card.classList.add("mx-1");

        //convert unix time
        var unixDate = data.daily[index].dt;
        var forecastDate = moment(unixDate*1000).format("Do MMM YYYY");

        //creat date holder and append forecast date to it
        var day = document.createElement("h3");
        day.textContent = forecastDate;
        card.appendChild(day);

        //get weather icon
        var imageContainer = document.createElement('div');
        var image = document.createElement('img');
        var weatherIcon = data.daily[index].weather[0].icon;
        image.src = "https://openweathermap.org/img/wn/"+ weatherIcon +"@2x.png";
        imageContainer.appendChild(image);
        card.appendChild(imageContainer);

        var rating = document.createElement('p');

        //UV index ratings
        if (data.daily[index].uvi >= 11) {
            rating.textContent = data.daily[index].uvi.toFixed(1) + "Extreme";
            rating.style.backgroundColor = "red";

        } else if (data.daily[index].uvi < 11 && data.daily[index].uvi >= 8) {
            rating.textContent = "UV: " + data.daily[index].uvi + " Very High";
            rating.style.backgroundColor = "orangered";

        } else if (data.daily[index].uvi < 8 && data.daily[index].uvi >= 6) {
            rating.textContent = "UV: " + data.daily[index].uvi.toFixed(1) + " High";
            rating.style.backgroundColor = "orange";

        } else if (data.daily[index].uvi < 6 && data.daily[index].uvi >= 3) {
            rating.textContent = "UV: " + data.daily[index].uvi.toFixed(1) + " Moderate";
            rating.style.backgroundColor = "green";
            
        } else if (data.daily[index].uvi < 3 && data.daily[index].uvi > 0) {
            rating.textContent = "UV: " + data.daily[index].uvi.toFixed(1) + " Low";
            rating.style.backgroundColor = "rgb(120, 179, 2)";
        }

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
            card.appendChild(rating);
        }
            forecastContainer.appendChild(card);
            displayWeatherEl.appendChild(forecastContainer);
    }
  }

  function storeCity(city) {
    searches.push(city);
    console.log(searches);
    history.innerHTML = "";
    localStorage.setItem("searchHistory", JSON.stringify(searches));
    displayHistory();
}

//_______________CLEAR HISTORY____________________________

//needs to be fixed clear list
function clearHistory(event) {
    event.preventDefault();
    localStorage.clear();
    searches.length = 0;
    displayHistory();
}

//_______________DISPLAY HISTORY FUNCTION______________________

function displayHistory() {
    var storedSearches = localStorage.getItem("searchHistory");

    var history = document.querySelector('#history');
    history.classList.add("pb-4");
    history.innerHTML = "<h1>History</h1><p>Previous searches appear here</p>";
    clearHistoryButton.style.display = "block";

    var searchHistory = JSON.parse(storedSearches);

    if (searchHistory !=null && searchHistory.length > 0) {
    for (let i = 0; i < searchHistory.length; i++) {
        var search = document.createElement("button"); //create button of search value
        search.classList.add("w-100");
        search.classList.add("btn-block");
        search.classList.add("btn-outline-primary");
        search.textContent = searchHistory[i].toUpperCase();
        history.appendChild(search);

        //execute getCityName function when search history button pressed
        search.addEventListener("click", function() {
            console.log("You are trying to load " + searchHistory[i]);
            getApi(searchHistory[i]);
        });
}
    } else {
        clearHistoryButton.style.display = "none";
        history.innerHTML = "";
    }

    history.appendChild(clearHistoryButton);
}

//______________CHANGE SITE COLOURS OVER TIME PERIODS_________________

  //change colour for time of day (e.g sunrise/sunset orange, midday blue, night dark grey);
  function backgroundChange() {

    //var currentHour = moment().format("HH");
    var currentHour = moment().hour();

    console.log("Current hour is " + currentHour);

    var header = document.querySelector(".jumbotron");
    var cards = document.querySelector("div");
    var message = document.createElement('h3');
    
    if (currentHour >=5 && currentHour < 7) {
        header.classList.add("sunriseTheme");
        cards.classList.add("sunriseTheme");
        message.textContent = "Good Morning";

    } else if (currentHour >=7 && currentHour < 12) {
        header.classList.add("midTheme");
        cards.classList.add("midTheme");
        message.textContent = "Good Morning";

    } else if (currentHour >=12 && currentHour < 13) {
        header.classList.add("middayTheme");
        cards.classList.add("middayTheme");
        message.textContent = "Good Afternoon";

    } else if (currentHour >= 13 && currentHour < 18 ) {
        header.classList.add("sunriseTheme");
        cards.classList.add("sunriseTheme");
        message.textContent = "Good Afternoon";

    } else {
        header.classList.add("nightTheme");
        cards.classList.add("nightTheme");
        message.textContent = "Good Evening";
    } 
    header.appendChild(message);
}

  checkWeatherButton.addEventListener("click", getCityName);
  clearHistoryButton.addEventListener("click", clearHistory);
  backgroundChange();