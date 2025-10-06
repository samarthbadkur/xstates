import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // Fetch countries on mount
  useEffect(() => {
    axios.get(API_URL)
      .then((res) => {
        setCountries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching countries: " + err.message);
        setLoading(false);
      });
  }, []);

  // Fetch states after country selection
  useEffect(() => {
    if (country) {
      axios.get(`https://crio-location-selector.onrender.com/country=${country}/states`)
        .then((res) => {
          setStates(res.data);
        })
        .catch((err) => {
          setError("Error fetching states: " + err.message);
        });
    } else {
      setStates([]);
      setState("");
      setCities([]);
      setCity("");
    }
  }, [country]);

  // Fetch cities after state selection
  useEffect(() => {
    if (country && state) {
      axios.get(`https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`)
        .then((res) => {
          setCities(res.data);
        })
        .catch((err) => {
          setError("Error fetching cities: " + err.message);
        });
    } else {
      setCities([]);
      setCity("");
    }
  }, [country, state]);

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "360px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Select Location</h2>
{/* 
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>} */}

      <label htmlFor="country-select" style={{ display: "block", marginBottom: "5px" }}>Country</label>
      <select
        id="country-select"
        value={country}
        onChange={handleCountryChange}
        style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
      >
        <option value="">Select a country</option>
        {countries.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      <label htmlFor="state-select" style={{ display: "block", marginBottom: "5px" }}>State</label>
      <select
        id="state-select"
        value={state}
        onChange={handleStateChange}
        style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
        disabled={!country || states.length === 0}
      >
        <option value="">Select a state</option>
        {states.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      <label htmlFor="city-select" style={{ display: "block", marginBottom: "5px" }}>City</label>
      <select
        id="city-select"
        value={city}
        onChange={handleCityChange}
        style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
        disabled={!state || cities.length === 0}
      >
        <option value="">Select a city</option>
        {cities.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      {city && (
        <h3>
          You selected {city}, {state}, {country}
        </h3>
      )}
    </div>
  );
}

export default Home;
