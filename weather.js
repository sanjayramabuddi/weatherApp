const yourWeather = document.querySelector("[data-userWeather]");
const searchWeather = document.querySelector("[data-searchWeather]");
const grantAccessContainer = document.querySelector(".grant-location-container");
const loadingScreenContainer = document.querySelector(".loading-container");
const searchFormContainer = document.querySelector("[data-searchForm]");
const userContainer = document.querySelector(".user-info-container");

let currentScreen = yourWeather;
currentScreen.classList.add("current-tab");
//Initially checking Coordinates from local storage
getfromSessionStorage();

yourWeather.addEventListener("click", () => {
  // pass clicked tab as input paramter
  switchScreen(yourWeather);
});

searchWeather.addEventListener("click", () => {
  // pass clicked tab as input paramter
  switchScreen(searchWeather);
});

function switchScreen(clickedScreen) {
  if (clickedScreen != currentScreen) {
    currentScreen.classList.remove("current-tab");
    currentScreen = clickedScreen;
    currentScreen.classList.add("current-tab");

    if (!searchFormContainer.classList.contains("active")) {
      // if search form container is invisible, then make it visible
      userContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchFormContainer.classList.add("active");
    } 
    else {
      // you're in search container, make your weather tab visible
      searchFormContainer.classList.remove("active");
      userContainer.classList.remove("active"); // Doubt
      // now in weather container, so checking local storage for coordinates
      getfromSessionStorage();
    }
  }
}

//checking if coordinates are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    // if local session is not stored, then showing grant access container
    grantAccessContainer.classList.add("active");
  } 
  else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

const apiKey = "d1845658f92b31c64bd94f06f7188c9c";

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // making grant access container invisible
  grantAccessContainer.classList.remove("active");
  // making loading screen visible
  loadingScreenContainer.classList.add("active");

  // API Call
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    loadingScreenContainer.classList.remove("active");
    userContainer.classList.add("active");
    renderWeatherInfo(data);
  } 
  catch (error) {
    loadingScreenContainer.classList.remove("active");
    document.write("Something Went Wrong");
  }
}

function renderWeatherInfo(weatherInfo) {
  // Fetching all the elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const description = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temperature = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-clouds]");

  // Fetching value from WeatherInfo and applying in UI
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  description.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temperature.innerText = `${weatherInfo?.main?.temp} °C`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

// Grant Location Access Code

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } 
  else {
    alert("Geolocation is not supported by this browser");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

// Search Container Code

const searchInput = document.querySelector("[data-searchInput]");

searchFormContainer.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;
  if (cityName === "") 
    return;
  else 
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreenContainer.classList.add("active");
  userContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    loadingScreenContainer.classList.remove("active");
    userContainer.classList.add("active");
    renderWeatherInfo(data);
  } 
  catch (error) {
    loadingScreenContainer.classList.remove("active");
    document.write("Something Went Wrong");
  }
}
