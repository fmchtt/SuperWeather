import React, { useEffect, useState } from "react";
import "../styles/App.css";

import Sidebar from "../components/Sidebar";
import api from "../services/api";
import Loading from "../components/Loadind";

interface data {
  title: string;
  location_type: string;
  woeid: number;
  latt_long: string;
  timezone: string;
  consolidated_weather: [
    {
      id: number;
      weather_state_name: string;
      weather_state_abbr: string;
      wind_direction_compass: string;
      created: string;
      applicable_date: string;
      min_temp: number;
      max_temp: number;
      the_temp: number;
      wind_speed: number;
      wind_direction: number;
      air_pressure: number;
      humidity: number;
      visibility: number;
      predictability: number;
    }
  ];
  time: string;
  sun_rise: string;
  sun_set: string;
  timezone_name: string;
  parent: {
    title: string;
    location_type: string;
    woeid: number;
    latt_long: string;
  };
}

function convertDate(date: string) {
  const data = new Date(
    parseInt(date.substring(0, 4)),
    parseInt(date.substring(5, 7)) - 1,
    parseInt(date.substring(8, 10))
  );
  const dataHoje = new Date();

  if (data.getDay() === dataHoje.getDay()) {
    return "Hoje";
  } else if (data.getDay() === dataHoje.getDay() + 1) {
    return "Amanhã";
  } else {
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }
}

function verifyDate(date: string) {
  const data = new Date();

  if (parseInt(date.substring(8, 10)) === data.getDay()) {
    return false;
  } else {
    return true;
  }
}

function App() {
  const [weather, setWeather] = useState<data>();

  useEffect(() => {
    if (localStorage.getItem("woeid")) {
      api.get(`/location/${localStorage.getItem("woeid")}`).then((response) => {
        setWeather(response.data);
      });
    } else {
      api.get("location/455827").then((response) => {
        setWeather(response.data);
      });
    }
  }, []);

  if (!weather) {
    return <h1><Loading /></h1>;
  } else {
    return (
      <main className="App">
        <Sidebar data={weather.consolidated_weather[0]} name={weather.title} />
        <div id="dashboard">
          <div className="weather-wrapper">
            {weather.consolidated_weather.map((weather_day) => {
              if (verifyDate(weather_day.applicable_date)) {
                return (
                  <div key={weather_day.id} className="weather-per-days">
                    <h2>{convertDate(weather_day.applicable_date)}</h2>
                    <img
                      alt="Weather Icon"
                      src={`http://metaweather.com/static/img/weather/${weather_day.weather_state_abbr}.svg`}
                    ></img>
                    <h3>
                      <strong>{`${weather_day.max_temp.toFixed(0)}° `}</strong>
                      {`${weather_day.min_temp.toFixed(0)}°`}
                    </h3>
                  </div>
                );
              } else {
                return <></>;
              }
            })}
          </div>
          <h2>Destaques de Hoje</h2>
          <div id="content-wrapper">
            <div className="card">
              <h4>Estado do Vento</h4>
              <h1>
                {(weather.consolidated_weather[0].wind_speed * 1.60934).toFixed(
                  1
                )}
                KM/H
              </h1>
              <h3>
                Direção:{" "}
                {weather.consolidated_weather[0].wind_direction_compass}
              </h3>
            </div>
            <div className="card">
              <h4>Humidade</h4>
              <h1>{weather.consolidated_weather[0].humidity}%</h1>
              <h3>
                Previsibilidade:{" "}
                {weather.consolidated_weather[0].predictability}
              </h3>
            </div>
            <div className="card">
              <h4>Visibilidade</h4>
              <h1>
                {(weather.consolidated_weather[0].visibility * 1.60934).toFixed(
                  1
                )}{" "}
                Kilometros
              </h1>
            </div>
            <div className="card">
              <h4>Pressão do Ar</h4>
              <h1>{weather.consolidated_weather[0].air_pressure} mb</h1>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
