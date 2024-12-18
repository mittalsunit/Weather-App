/* A good Practise
saraa kaam ek hii fxn mee nahii karwatee, intead of this hum har different kaam ke liyee different fxn bana sakte hai
jaisee yaha ek fxn joo api koo call & fetch karga aur dusra fxn joo iss fetched data ko user ko display karega
*/

const userTab = document.querySelector("#userWeather");
const searchTab = document.querySelector("#searchWeather");
const userContainer = document.querySelector(".weatherContainer");
const grantAccessContainer = document.querySelector(".grantLocationContainer");
const grantAccessButton = document.querySelector("#grantAccessBtn");
const searchForm = document.querySelector(".SearchForm");
const loadingScreen = document.querySelector(".loadingContainer");
const userInfoContainer = document.querySelector(".displayWeatherInfo");
const searchInput = document.querySelector("#searchInput");

// Initial Values
const API_KEY = "9dcf0afdcf343200c3112e0c2aa3da73";
let oldTab = userTab;
oldTab.classList.add("current-tab");
// jab bhi site reload hogii to start userTab see honii chahiye

getfromSessionStorage();

function switchTab(newTab) {
  // tabs koo switch karne kaa kaam karega
  if (newTab != oldTab) {
    // let say aabhi hum oldTab(Your Weather) par hai, aab agar humari newTab(Search Weather) walli hogii to current-tab walli css properties oldTab par see remove hoke newTab(jo ki naya oldTab) par apply ho jayegii
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      //aagar mera searchForm (jo search weather walle button ka part hai) invisble hai too aab usko visible(active) karna padega, to uskee liyee baaki sabko(jo search weather walle button ka part nahii hai) invisble hona padega
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      //aagar mera searchForm (jo search weather walle button ka part hai) visble(active) hai too aab usko invisible karna padega, to uskee liyee baaki sabko(jo search weather walle button ka part hai) invisble hona padega
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function getfromSessionStorage() {
  //check karega kii kya browser kee session storage mee user kii current location kee coordinates present hai yaa nahii
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    //aagar coordinates present nahii hai too grant Access walla page display karenge
    grantAccessContainer.classList.add("active");
  } else {
    //aagar coordinates present hai too api koo call karoo aur data fetch karoo
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { latitude, longitude } = coordinates; //coordinates mee se longitude aur latitude sagrigate karoo
  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");

  // API Call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data); //ye fxn data mee see required values extract karke userInfoContainer(ke UI) mee dallega
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("#LocationName");
  const countryIcon = document.querySelector("#LocationFlag");
  const desc = document.querySelector("#WeatherDescription");
  const weatherIcon = document.querySelector("#WeatherIcon");
  const temp = document.querySelector("#LocationTemprature");
  const windSpeed = document.querySelector("#WindSpeed");
  const humidity = document.querySelector("#Humidity");
  const clouds = document.querySelector("#Clouds");

  console.log(weatherInfo);

  //fetch values from weatherINfo object and put it UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp}°C`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  clouds.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(showPosition);
  else alert("No support available for this location");
}

function showPosition(position) {
  const userCoordinates = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

  fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener("click", getLocation);

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
      console.log('Location Unavailable');
  }
}
