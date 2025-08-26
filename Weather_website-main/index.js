const userTab=document.querySelector("[data-userweather]");
const searchTab=document.querySelector("[data-searchweather]");
const usercontainer=document.querySelector(".weather-container");
const grantaccesscontainer=document.querySelector(".grant-location-container");
const searchform=document.querySelector("[data-searchform]");
const loadingscreen=document.querySelector(".loading-container");
const userinfocontainer=document.querySelector('.user-info-container');
const btn=document.querySelector(".btn");
const errorpage=document.querySelector(".error-tab");
// const searchinput = document.querySelector("data-searchinput");

// variables needed
const API_KEY=""
// let currenttab=userTab;
// currenttab.classList.add("current-tab");
let currentTab= userTab;
currentTab.classList.add("current-tab");

getfromsessionstorage();
// create a funtion for switching tab
function switchTab(clickedTab)
{
    if(clickedTab!=currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchform.classList.contains("active")){
            // kya search form screen pe show ho rha hai nhi ho rha to usmein active class add krke usko show krwana hoga

            userinfocontainer.classList.remove("active");
            grantaccesscontainer.classList.remove("active");
            searchform.classList.add("active");
        }
        else{
            searchform.classList.remove("active");
            // loadingscreen.classList.add("active");
            userinfocontainer.classList.add("active");
            errorpage.classList.remove("active");

            getfromsessionstorage();
        }
    }
}
userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

function getfromsessionstorage()
{
    const localcordinates=sessionStorage.getItem("user-coordinates");
    if(!localcordinates)
    {
        grantaccesscontainer.classList.add("active");
    }
    else{

        const coordinates=JSON.parse(localcordinates);
        fetchuserweatherinfo(coordinates);
    }

}
async function fetchuserweatherinfo(coordinates)
{
    const {lat,lon}=coordinates;
    
    // make grant access tab invisible
    grantaccesscontainer.classList.remove("active");
    // make loader visible
    loadingscreen.classList.add("active");
   
    // API calling
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
       

        const data=await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
        loadingscreen.classList.remove("active");
        // errorpage.classList.add("active");
        console.log("error aagya re bhai",err);
        
    }
}
function renderweatherinfo(weatherinfo){
    // fetch all the elements to add their things permanently

    const cityname=document.querySelector("[data-cityname]");
    const countryicon=document.querySelector("[data-countryicon]");
    const desc=document.querySelector("[data-weatherdesc]");
    const weathericon=document.querySelector("[data-weathericon]");
    const temp=document.querySelector("[data-temp]");

    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloud]")
    let farenhite=0;
    let cel=0;

    // fetch the data
    cityname.innerText=weatherinfo?.name;
    // if(cityname==undefined)
    // {
    //     errorpage.classList.add("active");
    // }
    countryicon.src=`https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherinfo?.weather?.[0]?.description;
    weathericon.src=`http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    farenhite=((weatherinfo?.main?.temp)-273).toFixed(2);
   
    temp.innerText=farenhite+"°C";

   
    windspeed.innerText = `${weatherinfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherinfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherinfo?.clouds?.all}%`;
    
}






//function get location using geolocation
function getlocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        alert("No geolocation supported");
    }
}
function showposition(position)
{
    const usercoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    };
    fetchuserweatherinfo(usercoordinates);
    
}
const grantAccessbtn=document.querySelector("[data-grantaccess]");
grantAccessbtn.addEventListener("click",getlocation());
// const cityname=document.querySelector("data-searchInput");

// let cityname=searchinput.ariaValueMax;
// btn.addEventListener("submit",(e)=>{
//     e.preventDefault();
    
//     if(cityname="")
//     {
//         return;
//     }
//     else{
//         fetchuserweatherinfo(cityname);
//     }
// });
const searchInput = document.querySelector("[data-searchInput]");

searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
        
    else 
         console.log(cityName);
         fetchsearchweatherinfo(cityName);
})
async function fetchsearchweatherinfo(city)
{
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
          );
        if(response.status==404)
        {
            errorpage.classList.add("active");
           
            loadingscreen.classList.remove("active");
            // userinfocontainer.classList.remove("active");
            // grantaccesscontainer.classList.remove("active");
        }
        else{
           

        const data = await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        errorpage.classList.remove("active");
        renderweatherinfo(data);
        }
        
    }
    catch(err) {
        //hW
        
        alert("Any error occured");
    }
}
