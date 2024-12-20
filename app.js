const apiKey = "2014c709cf21f36d7ed0fce225ce864e";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const currentWeather = document.getElementById("current-weather");
const forecastCards = document.getElementById("forecast-cards");
const forecast = document.getElementById("forecast");

// Display current weather information
const displayCurrentWeather = (data) => {
  const cityName = document.getElementById("city-name");
  const weatherDescription = document.getElementById("weather-description");
  const weatherIcon = document.getElementById("weather-icon");
  const temperature = document.getElementById("temperature");

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  weatherDescription.textContent = data.weather[0].description;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  temperature.textContent = Math.round(data.main.temp);
};

// Display forecast for the next 5 days
const displayForecast = (data) => {
  forecastCards.innerHTML = "";
  const forecastList = data.list.filter((_, index) => index % 8 === 0); // Get one forecast per day

  forecastList.forEach((day) => {
    const date = new Date(day.dt * 1000).toLocaleDateString();
    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    const temp = Math.round(day.main.temp);
    const desc = day.weather[0].description;

    const card = `
      <div class="col-md-2">
        <div class="card p-2 shadow bg-light text-center">
          <h5>${date}</h5>
          <img src="${icon}" class="weather-icon mx-auto">
          <p>${temp}&#8451;</p>
          <p>${desc}</p>
        </div>
      </div>
    `;
    forecastCards.innerHTML += card;
  });
};

// Error handling function
const errorHandler = (errorMessage, city) => {
  const weatherDescription = document.getElementById("weather-description");
  const temperature = document.getElementById("temperature");
  const weatherIcon = document.getElementById("weather-icon");
  const cityName = document.getElementById("city-name");

  cityName.textContent = city;
  weatherDescription.textContent = errorMessage.toUpperCase();
  // Add error class
  temperature.textContent = ""; // Clear temperature
  weatherIcon.src = "https://openweathermap.org/img/wn/01d.png";

  forecastCards.innerHTML = ""; // Clear forecast cards
};

const fetchWeatherData = async (city) => {
  try {
    const currentWeatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const currentWeatherData = await currentWeatherRes.json();

    if (currentWeatherRes.ok) {
      displayCurrentWeather(currentWeatherData);
    } else {
      errorHandler("City not found. Please check the city name.", city);
      return;
    }

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    const forecastData = await forecastRes.json();

    if (forecastRes.ok) {
      displayForecast(forecastData);
    } else {
      errorHandler(
        "Unable to fetch forecast data. Please try again later.",
        city
      );
    }
  } catch (error) {
    console.error(error);
    errorHandler("Failed to fetch weather data. Please try again later.", city);
  }
};

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
    localStorage.setItem("lastSearch", city);
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeatherData(city);
      localStorage.setItem("lastSearch", city);
    }
  }
});

window.addEventListener("load", () => {
  const lastSearch = localStorage.getItem("lastSearch");
  if (lastSearch) {
    cityInput.value = lastSearch;
    fetchWeatherData(lastSearch);
  }
});
