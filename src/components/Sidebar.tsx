import React, { useEffect, useState } from "react";
import "../styles/components/sidebar.css";
import { HiLocationMarker } from "react-icons/hi";
import { BiCurrentLocation } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import backCloud from "../assets/cloudBackground.png";
import api from "../services/api";

interface location {
  name: string;
  data: {
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
  };
}

interface searchData {
  title: string;
  location_type: string;
  woeid: number;
  latt_long: string;
}

export default function Sidebar(props: location) {
  const [date, setDate] = useState<string>();
  const [fulldate, setFulldate] = useState<string>();
  const [searching, setSearching] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<searchData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [position, setPosition] = useState<string>();

  useEffect(() => {
    const dataHoje = new Date();
    const data = new Date(props.data.created);

    const month = data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setFulldate(month);

    if (dataHoje.getDay() === data.getDay()) {
      setDate("Hoje");
    } else if (dataHoje.getDay() - 1 === data.getDay()) {
      setDate("Ontem");
    } else {
      setDate(`${data.getDay()} / ${data.getMonth()} / ${data.getFullYear()}`);
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition(pos.coords.latitude + "," + pos.coords.longitude);
      });
    }
  }, [props.data.created]);

  if (searching) {
    return (
      <aside id="search">
        <AiOutlineClose
          size={30}
          color="#fff"
          onClick={() => {
            setSearching(!searching);
          }}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Procurar localização"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            api
              .get(`/location/search/?query=${searchQuery}`)
              .then((response) => {
                setSearchData(response.data as any);
              });
          }}
        >
          Procurar
        </button>
        {searchData ? (
          searchData.map((data) => {
            return (
              <div
                className="search-item"
                onClick={() => {
                  localStorage.setItem("woeid", data.woeid.toString());
                  setSearchData([]);
                  setSearchQuery("");
                  setSearching(false);
                  window.location.reload(false);
                }}
              >
                <h1>{data.title}</h1>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </aside>
    );
  } else {
    return (
      <aside id="sidebar">
        <img className="background" src={backCloud} alt="clouds"></img>
        <nav>
          <button
            onClick={() => {
              setSearching(!searching);
            }}
          >
            Procurar por região
          </button>
          <button
            className="location"
            onChange={() => {
              api
                .get(`location/search/?lattlong=${position}`)
                .then((response) => {
                  localStorage.setItem("woeid", response.data.woeid);
                });
            }}
          >
            <BiCurrentLocation size={20} />
          </button>
        </nav>
        <img
          src={`http://metaweather.com/static/img/weather/${props.data.weather_state_abbr}.svg`} alt="logo"
        ></img>
        <h1>{props.data.the_temp.toFixed(0)}°</h1>
        <h3>{props.data.weather_state_name}</h3>
        <p>
          {date} • {fulldate}
        </p>
        <h4>
          <HiLocationMarker size={20} /> {props.name}
        </h4>
      </aside>
    );
  }
}
