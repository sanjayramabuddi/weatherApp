const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const grantAccessContainer = document.querySelector("[grant-location-container]");
const loadingScreen = document.querySelector("[loading-container]");
const searchForm = document.querySelector("[data-searchForm]");
const userContainer = document.querySelector("[user-info-container]");
// const entireContainer = document.querySelector("[weather-container]");

let currentTab = userTab;
currentTab.classList.add("current-tab");

userTab.addEventListener("click", () => {
  // pass clicked tab as input paramter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  // pass clicked tab as input paramter
  switchTab(searchTab);
});

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");
    if (!searchForm.classList.contains("active")) {
      // if search form container is invisible, then make it visible
      userContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      // you're in search container, make your weather tab visible
      searchForm.classList.remove("active");
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
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

const apiKey = "d1845658f92b31c64bd94f06f7188c9c";

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // making grant acces container invisible
  grantAccessContainer.classList.remove("active");
  // making loading screen visible
  loadingScreen.classList.add("active");

  // API Call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userContainer.classList.add("active");
    renderWeatherInfo();
  } catch (error) {
    loadingScreen.classList.remove("active");
    //
  }
}
