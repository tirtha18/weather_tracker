import axios from 'axios';
import { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { RiWindyLine } from "react-icons/ri";
import { MdOutlineWaterDrop } from "react-icons/md";
import { useEffect } from 'react';
export default function WeatherCard() {
  const [temp, setTemp] = useState('');
  const [location, setlocation]=useState("");
  const [humidity, setHumidity] = useState("");
  const [windspeed, setWindspeed] = useState("");
  const [name, setName] = useState('');
  const [wiCon, setwiCon] = useState("");
  useEffect (() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude =  position.coords.longitude;
      console.log(latitude);
      getW(latitude,longitude);
      getCityname(latitude, longitude);
    }, (error) => {
      console.error("Error getting geolocation:", error.message);
    });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  },[]);
  async function getCityname(latitude, longitude) {
    try {
      console.log("Success");
      const respos = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=0918dab7a79455ebc16c44a0001be4c7`); 
      setName(respos.data[0].name);
    } catch (error) {
      console.error("Error getting position", error);
    }
  }
  async function getPosition() {
    try {
      console.log("Success");
      const respos = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=0918dab7a79455ebc16c44a0001be4c7`);
      const lat = respos.data[0].lat;
      const lon = respos.data[0].lon; 
      setName(respos.data[0].name);
      console.log(respos.data[0]);
      getW(lat, lon);
    } catch (error) {
      console.error("Error getting position", error);
    }
  }  
  async function getW(lat, lon) {
    try {
      console.log("Success");
      const resw = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0918dab7a79455ebc16c44a0001be4c7`);
      const winfo = resw.data;
      const temp=Math.round(winfo.main.temp-273.12);
      console.log(winfo.weather[0].main," TTT");
      if(winfo.weather[0].main === "Rain")
      {
        setwiCon("🌧");
      }
      else if(winfo.weather[0].main === "Clouds")
      {
        setwiCon("☁");
      }
      else if(winfo.weather[0].main === "Clear")
      {
        setwiCon("☀");
      }
      else
      {
        setwiCon("🌥️");
      }
      setHumidity(winfo.main.humidity);
      setWindspeed(winfo.wind.speed);
      setTemp(temp);
    } catch (error) {
      console.error("Error getting weather", error);
    }
  }
  //getPosition();
  return (
    <div className="w-screen min-h-screen max-h-full bg-black">
        <div className="flex justify-center">
          <div className=" flex flex-col min-h-screen max-h-full sm:max-w-sm w-screen bg items-center bg-gradient-to-br from-blue-600 to-violet-800">
            <div className="flex flex-row mt-6">
                <div><input placeholder="Search" type="text"  className=" rounded-3xl h-12 w-auto mr-3 text-xl text-gray-400 px-5 uppercase" value={location} onChange={() =>{setlocation(event.target.value);}} /></div>
                <div><button className="rounded-full w-12 h-12 bg-white flex items-center justify-center " onClick={() => {console.log(location);getPosition();}}><CiSearch size={31}/></button></div>
            </div>
            <div className="flex flex-col mt-32 items-center text-white mb-40">
                <div className="text-9xl mb-5">
                    <h1>{wiCon}</h1>
                </div>
                <div className="text-5xl font-semibold mb-6">
                    <h1>{temp}°C</h1>
                </div>
                <div className="text-3xl ">
                    <h1>{name}</h1>
                </div>
            </div>
            <div className="flex flex-row text-white justify-between max-w-sm w-screen sm:px-3 px-4 mb-8">
                <div className="flex flex-row font-semibold">
                    <MdOutlineWaterDrop size={60} className="mr-1"/>
                    <div className="flex flex-col">
                        <h1 className="text-2xl">{humidity}%</h1>
                        <h2>Humidity</h2>
                    </div>
                </div>
                <div className="flex flex-row font-semibold">
                    <RiWindyLine size={60} className="mr-1"/>
                    <div className="flex flex-col">
                        <h1 className="text-2xl">{windspeed}</h1>
                        <h2>Wind Speed</h2>
                    </div>
                </div>                            
            </div>
          </div>
        </div>
      </div>
  )
}
