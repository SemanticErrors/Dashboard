import React, { useState, type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import "../styles/weatherCard.scss";

type WeatherApiResp = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
  cod?: number | string;
  message?: string;
};

const API_KEY = "20644fcc81d534dee0d3177be0e84540";

async function fetchWeather(city: string): Promise<WeatherApiResp> {
  if (!API_KEY) throw new Error("Missing OpenWeather API key.");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  const json = (await res.json()) as WeatherApiResp;

  if (!res.ok) {
    throw new Error(json?.message || "Error fetching data");
  }
  return json;
}

export default function WeatherCard(): JSX.Element {
  const [input, setInput] = useState("Cairo");
  const [city, setCity] = useState("Cairo");

  const { data, isLoading, isError, error, isFetching } = useQuery<WeatherApiResp, Error>({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
    enabled: !!city,
  });

  const onSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) setCity(input.trim());
  };

  const iconUrl = data?.weather?.[0]?.icon
    ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    : null;

  return (
    <div className="weather-card">
      <h3>Weather</h3>

      <form className="weather-form" onSubmit={onSearch}>
        <input
          placeholder="Enter city name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn" disabled={!input.trim()}>
          Search
        </button>
      </form>

      <div className="weather-body">
        {isLoading || isFetching ? (
          <p>Fetching weather…</p>
        ) : isError ? (
          <p>{error.message.includes("not found") ? "City not found" : "Error fetching data"}</p>
        ) : (
          data && (
            <div className="weather-info">
              <h4>{data.name}</h4>
              {iconUrl && <img src={iconUrl} alt={data.weather[0].description} />}
              <p className="temp">{Math.round(data.main.temp)}°C</p>
              <p className="desc">{data.weather[0].description}</p>
              <p className="meta">Humidity: {data.main.humidity}%</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
