import React, { useEffect, useState } from "react";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const API_URL = "https://crio-location-selector.onrender.com/countries";

function Home() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [states, setStates] = useState([]);
  const [state, setState] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStateDisabled, setIsStateDisabled] = useState(true);
  const [isCityDisabled, setIsCityDisabled] = useState(true);

  const fetchStates = (country) => {
    axios
      .get(
        `https://crio-location-selector.onrender.com/country=${country}/states`
      )
      .then((res) => {
        setStates(res.data);
        setIsStateDisabled(false);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Error fetching data:", err.message);
      });
  };

  const fetchCities = (state, country) => {
    axios
      .get(
        `https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`
      )
      .then((res) => {
        console.log(res.data);
        setCities(res.data);
        setIsCityDisabled(false);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Error fetching data:", err.message);
      });
  };

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
    if (selectedCountry) {
        fetchStates(selectedCountry);
    } else {
      setIsStateDisabled(true);
      setStates([]);
      setState("");
      setIsCityDisabled(true);
      setCities([]);
      setCity("");
    }
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    const selectedCountry = country;
    setState(event.target.value);
    if (selectedState) {
        fetchCities(selectedState, selectedCountry);
    } else {
      setIsCityDisabled(true);
      setCities([]);
      setCity("");
    }
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };


  // Logs error to console on API failure (already handled in useEffect's catch block)
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setCountries(res.data);
        // setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching data:", err.message);
      });
  }, []);

  return (
    <>
      <h1>Select Location</h1>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="dedemo-simple-select-country-label">Country</InputLabel>
        <Select
          labelId="demdemo-simple-select-country-label"
          id="demo-simple-select-country-label"
          value={country}
          label="Country"
          onChange={handleCountryChange}
        >
          <MenuItem key="default-country" value="">
            <em>Select a country</em>
          </MenuItem>
          {countries &&
            countries.map((countryName) => (
              <MenuItem key={countryName} value={countryName}>
                {countryName}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-state-label">State</InputLabel>
        <Select
          labelId="demo-simple-select-state-label"
          id="demo-simple-select-state-label"
          value={state}
          label="State"
          onChange={handleStateChange}
          disabled={isStateDisabled}
        >
          <MenuItem key="default-state" value="">
            <em>Select a state</em>
          </MenuItem>
          {states &&
            states.map((stateName) => (
              <MenuItem key={stateName} value={stateName}>
                {stateName}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

       <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-city-label">City</InputLabel>
        <Select
          labelId="demo-simple-select-city-label"
          id="demo-simple-select-city-label"
          value={city}
          label="City"
          onChange={handleCityChange}
          disabled={isCityDisabled}
        >
          <MenuItem key="default-city" value="">
            <em>Select a city</em>
          </MenuItem>
          {cities &&
            cities.map((cityName) => (
              <MenuItem key={cityName} value={cityName}>
                {cityName}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {city && <h1>You selected {city}, {state}, {country}</h1>}
    </>
  );
}

export default Home;
