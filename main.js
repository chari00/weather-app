//api source = https://openweathermap.org/forecast5

const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-button");
const weatherCard = document.querySelector(".weather-container");
const previousDayBtn = document.querySelector(".previous-day");
const nextDayBtn = document.querySelector(".next-day");
//array of all the day names starting from monday
const dayNames = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const apiKey = "087e837a4031ac9548d12839bf461080";

//store the last request
let currentDay = 0;
let currentCity = "London";

async function getCityWeather(cityName) {
	const queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
	//use the user input location to fetch the weather by city name.
	const cityData = await fetch(queryUrl, {
		headers: { Accept: "application/json" },
	});
	const cityWeatherData = await cityData.json();
	//create variable to assign temperature, wind speed, humidity and weather icon
	if (cityWeatherData.cod === "200") {
		const firstResult = cityWeatherData.list[currentDay];
		const tempKelvin = firstResult.main.temp;

		//convert temperature from kelvin to celsius and round down to the lowest number
		const tempCelsius = Math.floor(tempKelvin - 273.15);
		const wind = firstResult.wind.speed;
		const humidity = firstResult.main.humidity;
		const icon = firstResult.weather[0].icon;
		const weatherIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
		const dayName = dayNames[new Date(firstResult.dt_txt).getDay()];
		console.log(dayName);
		return {
			cityName,
			tempCelsius,
			wind,
			humidity,
			weatherIcon,
			dayName,
		};
	}

	return Promise.reject(cityWeatherData.message);
}

function showWeather(weatherData) {
	//create html element to display weather details on the webpage
	const currentWeather = `
  <h1>${weatherData.dayName} in <span>${weatherData.cityName}</span></h1>
  <div class="weather-info">
    <div class="weather-icon">
      <img src="${weatherData.weatherIcon}" alt="Weather Icon" />
    </div>
    <div class="weather-details">
      <p class="temperature">
        Temperature: <span id="temperature">${weatherData.tempCelsius}</span> °C
      </p>
      <p class="wind">Wind: <span id="wind">${weatherData.wind} KPH</span></p>
      <p class="humidity">
        Humidity: <span id="humidity">${weatherData.humidity}%</span>
      </p>
    </div>
  </div>
  `;
	weatherCard.innerHTML = currentWeather;
}

function showError(message) {
	const error = `
  <h1>${message}</h1>
  <div class="weather-info">
  </div>
  `;
	weatherCard.innerHTML = error;
}

function updateWeatherHandler() {
	if (searchInput.value !== "") {
		currentCity = searchInput.value;
	}
	getCityWeather(searchInput.value)
		.then(showWeather)
		.catch((e) => {
			console.log("[Catch]", e);
			showError(e);
		});
}

// Default
getCityWeather(currentCity)
	.then(showWeather)
	.catch((e) => {
		console.log("[Catch]", e);
		showError(e);
	});
/*
 * EVENTS
 */
//when user click the search button, call the getCityFunction
searchBtn.addEventListener("click", updateWeatherHandler);
// When the user hits enter
searchInput.addEventListener("keypress", (ev) => {
	console.log(ev);
	if (ev.key === "Enter") {
		updateWeatherHandler();
	}
});

previousDayBtn.addEventListener("click", () => {
	if (currentDay > 0) {
		currentDay -= 8;
		nextDayBtn.removeAttribute("disabled");
		nextDayBtn.style.color = "#fff";
		getCityWeather(currentCity)
			.then(showWeather)
			.catch((e) => {
				console.log("[Catch]", e);
				showError(e);
			});
	} else {
		previousDayBtn.setAttribute("disabled", true);
		previousDayBtn.style.color = "#ddd";
		console.log(currentDay, currentCity);
	}
});

nextDayBtn.addEventListener("click", () => {
	if (currentDay < 32) {
		currentDay += 8;
		previousDayBtn.removeAttribute("disabled");
		previousDayBtn.style.color = "#fff";
		getCityWeather(currentCity)
			.then(showWeather)
			.catch((e) => {
				console.log("[Catch]", e);
				showError(e);
			});
	} else {
		nextDayBtn.setAttribute("disabled", true);
		nextDayBtn.style.color = "#ddd";
		console.log(currentDay, currentCity);
	}
});
