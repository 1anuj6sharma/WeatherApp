const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const  userInfoContainer = document.querySelector(".user-info-container");
const grantAccessBtn = document.querySelector("[data-grantAccess]");


const apiErrorContainer = document.querySelector(".api-error-container");


const messageText = document.querySelector("[data-messageText]");

const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");
let cityerr = "City Not Found";



//intially variables need???

let oldTab = userTab;
const API_KEY = "78df949a9c568845ac38d78aee77659f";
oldTab.classList.add("current-tab");
getfromSessionStorage();


//newTab = clicked tab
//oldTab = currentTab

function switchTab(newTab){
    apiErrorContainer.classList.remove("active");  // on time of switch remove the error
    if(newTab != oldTab)
        {
            oldTab.classList.remove("current-tab");
            oldTab = newTab;
            oldTab.classList.add("current-tab");


            if(!searchForm.classList.contains("active")){

                //kya search form wala container is invisible,if yes then make it visible

                userInfoContainer.classList.remove("active");
                grantAccessContainer.classList.remove("active");
                searchForm.classList.add("active");

            }

            else{
                //me pehle search wale tab par tha ,ab your weather tab visible karna h
                searchForm.classList.remove("active");
                userInfoContainer.classList.remove("active");

                //ab me your weather tab me aa gya hu ,to weather bhi display karna padega ,so let's check local storage first
                getfromSessionStorage();
            }
        }
    }


    userTab.addEventListener("click", () => {

        //pass clicked tab as input parameter
        switchTab(userTab);
    });

    searchTab.addEventListener("click", () => {
    
        //pass clicked tab as input parameter
        switchTab(searchTab);
    });

    //  ------ user weather handling -------

    //check if coordinates are present in session storage or not

    function getfromSessionStorage() {

        const localCoordinates = sessionStorage.getItem("user-coordinates");

        if(!localCoordinates)
            {
                //agar local coordinates nhi mile
                grantAccessContainer.classList.add("active");

            }

            else{
                const coordinates = JSON.parse(localCoordinates);
                fetchUserWeatherInfo(coordinates);
            }



    }
   
  

    async function fetchUserWeatherInfo(coordinates){
        const {lat,lon} = coordinates;

        //make grant container invisible
        grantAccessContainer.classList.remove("active");

        //make loader visible

        loadingScreen.classList.add("active");
    


//API CALL
try{
    const response =await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    if (!data.sys) {
        throw data;
      }

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}

catch(error) {
    
    //HW

     // console.log("User - Api Fetch Error", error.message);
     
    loadingScreen.classList.remove("active");
      apiErrorContainer.classList.add("active");
      apiErrorImg.style.display = "none";
     //apiErrorImg.classList.remove("active");
     apiErrorMessage.innerText = `Error: ${cityerr}`;
      apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
   

}



}


function renderWeatherInfo(weatherInfo){
     //fistly, we have to fetch the elements 

     const cityName = document.querySelector("[data-cityName]");
     const countryIcon = document.querySelector("[data-countryIcon]");
     const desc = document.querySelector("[data-weatherDesc]");
     const weatherIcon = document.querySelector("[data-weatherIcon]");
     const temp = document.querySelector("[data-temp]");
     const windspeed = document.querySelector("[data-windspeed]");
     const humidity = document.querySelector("[data-humidity]");
     const cloudiness = document.querySelector("[data-cloudiness]");
 
 
     console.log(weatherInfo);
 
     //fetch values from weather info object and put it in UI elements
     
     cityName.innerText = weatherInfo?.name;
     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
     desc.innerText = weatherInfo?.weather?.[0]?.description;
     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;


     temp.innerText = `${weatherInfo?.main?.temp} °C`;
     windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
     humidity.innerText = `${weatherInfo?.main?.humidity}%`;
     cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;



}

function getLocation() {

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    }

    else{
        //Hw - show an alert for no geolocation support available
        grantAccessBtn.style.display = "none";
    messageText.innerText = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position){

    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


// Handle any errors
function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        messageText.innerText = "You denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        messageText.innerText = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        messageText.innerText = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        messageText.innerText = "An unknown error occurred.";
        break;
    }
  }
  



grantAccessBtn.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");


searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else
    fetchSearchWeatherInfo(cityName);


});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
   grantAccessContainer.classList.remove("active");
    apiErrorContainer.classList.remove("active");
    


    try {
        const response = await fetch(    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data =  await response.json();
        if (!data.sys) {   // it is responsible to show error image
            throw data;
          };
    
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);


    }

    catch(error){

       // console.log("Search - Api Fetch Error", error.message);
    loadingScreen.classList.remove("active");
    apiErrorContainer.classList.add("active");
    apiErrorMessage.innerText = `${cityerr}`;
    apiErrorBtn.style.display = "none";
    

       
    }
}
    
