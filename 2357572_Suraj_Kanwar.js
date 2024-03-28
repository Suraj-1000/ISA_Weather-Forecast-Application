//Suraj Kanwar
//2357572

let searchbox = document.getElementById("search-input");
let searchbutton = document.getElementById("search-button");
let result = document.getElementById("result");
const historyButton = document.querySelector(".history");

const apikey = "7de9475040c10c841c2c7d3e598b0f52";

function checkweather() {
  const placename = searchbox.value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${placename}&appid=${apikey}`;

  if (placename.length <= 0) {
    result.innerHTML = `<h2 class="msg">Please Enter a City Name</h2>`;
    hideWeatherData();
  }else {
    const storedData = getStoredWeatherData();
    const lowercaseCityName = placename.toLowerCase();

    if (storedData[lowercaseCityName]){
      console.log("Data retrieved from local storage:");
      displayWeatherData(storedData[lowercaseCityName]);
    }
  
    else {
      fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data retrieved from the internet:");

        if (data.cod === 200) {
          result.innerHTML = "";
          showWeatherData();
          displayWeatherData(data);
          storeWeatherData(lowercaseCityName,data);

        } else {
          result.innerHTML = `<h2 class="msg">City Not Found!</h2>`;
          hideWeatherData();
          console.log("City Not Found!");
        }
      })
      .catch((error) => {
        if (!navigator.onLine) {
          result.innerHTML = `<h2 class="msg">No internet connection.</h2>`;
          hideWeatherData();
          console.log("No internet connection.");
          
        } else {
          result.innerHTML = `<h2 class="msg">Error occurred while fetching weather data. Please try again later.</h2>`;
          console.error(error);
          hideWeatherData();
        }
        });
    }
  }
}

function hideWeatherData() {
  document.querySelector("#city").style.display = 'none';
  document.querySelector("#icon").style.display = 'none';
  document.querySelector(".data").style.display = 'none';
  document.querySelector(".humi").style.display = 'none';
  document.querySelector(".windy").style.display = 'none';
}

function showWeatherData() {
  document.querySelector("#city").style.display = 'block';
  document.querySelector("#icon").style.display = 'block';
  document.querySelector(".data").style.display = 'block';
  document.querySelector(".humi").style.display = 'block';
  document.querySelector(".windy").style.display = 'block';
}

function displayWeatherData(data) {
  result.innerHTML = "";
  showWeatherData();
  const timezoneOffset = 0;

  document.querySelector("#city").innerHTML = `<h3>Weather in ${data.name}</h3>`;
  document.querySelector("#icon").src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  document.querySelector("#temp").innerHTML = `${Math.round(data.main.temp - 273.15)}&deg;C`;
  document.querySelector("#cloudy").innerHTML = data.weather[0].description;
  document.querySelector("#feels").innerHTML = `${Math.round(data.main.temp_min - 273.15)}&deg; / ${Math.round(data.main.temp_max - 273.15)}&deg; Feels like: ${Math.round(data.main.feels_like - 273.15)}&deg;`;
  document.querySelector("#date").innerHTML = `<p id="date">Time: ${getTimeWithOffset(timezoneOffset)}</p>`;
  document.querySelector("#humidity").innerHTML = `Humidity: ${data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = `Wind speed: ${data.wind.speed} km/h`;

  document.querySelector("#longitude").innerHTML = `Longitude: ${data.coord.lon}&deg;C`;
  document.querySelector("#latitude").innerHTML = `Latitude: ${data.coord.lat}&deg;C`;
  document.querySelector("#pressure").innerHTML = `Pressure: ${data.main.pressure} Pa`;
  document.querySelector("#visibility").innerHTML = `Visibility: ${data.visibility} m`;
  document.querySelector("#sunrise").innerHTML = `Sunrise: ${convertUnixTimestamp(data.sys.sunrise)} AM`;
  document.querySelector("#sunset").innerHTML = `Sunset: ${convertUnixTimestamp(data.sys.sunset)} PM`;
  document.querySelector("#country").innerHTML = `Country: ${data.sys.country}`;

  document.querySelector("#icon").style.display = 'block';
  document.querySelector(".humi").style.display = 'block';
  document.querySelector(".windy").style.display = 'block';
}

function getTimeWithOffset() {
  const localTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });
  return localTime;
}

function convertUnixTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  const formattedTime = hours + ":" + minutes.slice(-2);
  return formattedTime;
}

historyButton.addEventListener("click", function() {
  const searchInputValue = document.getElementById('search-input').value;
  const url = 'http://localhost/Weather_Forecast/2357572_Suraj_Kanwar.php?city=' + encodeURIComponent(searchInputValue);
  window.location.href = url;
});

function storeWeatherData(CityName,data) {
  const storedData = getStoredWeatherData() || {};
  storedData[CityName] = data;
  localStorage.setItem("weather", JSON.stringify(storedData));
}

function getStoredWeatherData() {
  return JSON.parse(localStorage.getItem("weather")) || {};
}

storeWeatherData();
const storedData = getStoredWeatherData();

function loadWeatherDataFromLocalStorage(cityName) {
  const storedData = getStoredWeatherData();
  const lowercaseCityName = cityName.toLowerCase();

  if (storedData[lowercaseCityName]) {
    console.log("Data retrieved from local storage:");
    displayWeatherData(storedData[lowercaseCityName]);
  } 
}

searchbutton.addEventListener("click", checkweather);
window.addEventListener("load", function() {
  const searchInputValue = document.getElementById('search-input').value;
  if (navigator.onLine) {
    checkweather();
  } else {
    loadWeatherDataFromLocalStorage(searchInputValue); 
  }
});





