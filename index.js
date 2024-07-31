const userTab = document.querySelector("[data-userWeather");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");


//initially variables need???

let currentTab = userTab;
const API_KEY = "0989e348a6f0a236b68b8e23befd7499";
currentTab.classList.add("current-tab");
getfromSessionStorage();

//ek kam aur kar lenge
//by default user weather open hona chahiye

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //now i am in weather tab ,so nwwd to display weather
            //for cordinates,if we haved saved them there
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", ()=>{
    //pass clicked tab as a input
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);
});


// check if coordinates are already pressed 
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //if we dont found coordinates 
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat ,lon }= coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //hw
        console.error("Error fetching weather information:", err);

    }
}

function renderWeatherInfo(weatherInfo){
    //first fetch the elements

    const cityName =document.querySelector("[data-cityname]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const descp = document.querySelector("[data-weatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherainfo
    cityName.innerText = weatherInfo?.name;
    countryIcon.src =  `https://flagcdn.com/64x48/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    descp.innerText = weatherInfo?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C` ;
    humidity.innerText = ` ${weatherInfo?.main?.humidity} %`;
    windSpeed.innerText = ` ${weatherInfo?.wind?.speed} m/s`;
    cloudiness.innerText = ` ${weatherInfo?.clouds?.all} %`;


}

function getLocation() {
   if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
   }else{
       //HW show an alert for no geolocation support
   }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,

    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener('click', getLocation);

const searchInput = document.querySelector("[data-searchInput]"); 

searchForm.addEventListener("submit" ,(e) => {
   e.preventDefault();
   let cityName = searchInput.value;

   if(cityName ==="")
    return ;
     
   else
       fetchSearchWeatherInfo(cityName);
});



async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.error("Error fetching weather information:", err);
    }
}