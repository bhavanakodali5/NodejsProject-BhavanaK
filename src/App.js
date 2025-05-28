import React, { useState, useCallback } from 'react';
import { fetchCurrentWeather, fetchWeatherForecast } from './weatherService';
import WeatherTemperatureChart from './WeatherChart';

function WeatherApp() {
  const [cityInput, setCityInput] = useState('');
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [appErrorMessage, setAppErrorMessage] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchWeather = useCallback(async () => {
    setAppErrorMessage('');
    setCurrentWeatherData(null);
    setForecastData(null);
    setIsFetching(true);

    if (!cityInput.trim()) {
      setAppErrorMessage('Please enter a city name.');
      setIsFetching(false);
      return;
    }

    try {
      const current = await fetchCurrentWeather(cityInput);
      setCurrentWeatherData(current);

      const forecast = await fetchWeatherForecast(current.coord.lat, current.coord.lon);
      setForecastData(forecast);

    } catch (error) {
      console.error("Error in fetching weather:", error);
      setAppErrorMessage(error.message || 'An unknown error occurred.');
    } finally {
      setIsFetching(false);
    }
  }, [cityInput]);

  const prepareChartData = () => {
    if (!forecastData) return null;

    const dailyForecasts = forecastData.list.filter((item, index, arr) => {
      if (index === 0) return true;

      const currentDay = new Date(item.dt * 1000).getDate();
      const previousDay = new Date(arr[index - 1].dt * 1000).getDate();

      return currentDay !== previousDay;
    }).slice(0, 5);

    return {
      labels: dailyForecasts.map(item =>
        new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
      ),
      datasets: [{
        label: 'Daily Temperature',
        data: dailyForecasts.map(item => item.main.temp),
        fill: true,
        backgroundColor: 'rgba(70, 130, 180, 0.4)',
        borderColor: '#4682b4',
        tension: 0.3,
        pointBackgroundColor: '#1e90ff',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#1e90ff',
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    };
  };

  return (
    <div style={styles.appContainer}>
      <h1 style={styles.appTitle}>Dynamic Weather Display</h1>
      <div style={styles.inputGroup}>
        <input
          type="text"
          placeholder="Enter city name (e.g., London)"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleFetchWeather();
          }}
          style={styles.cityInput}
          disabled={isFetching}
        />
        <button onClick={handleFetchWeather} style={styles.fetchButton} disabled={isFetching}>
          {isFetching ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {appErrorMessage && <p style={styles.errorMessage}>{appErrorMessage}</p>}

      {currentWeatherData && (
        <div style={styles.weatherCard}>
          <h2>{currentWeatherData.name}, {currentWeatherData.sys.country}</h2>
          <div style={styles.currentDetails}>
            <img
              src={`https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`}
              alt={currentWeatherData.weather[0].description}
              style={styles.weatherIcon}
            />
            <div style={styles.temperatureInfo}>
              <p style={styles.mainTemp}>{Math.round(currentWeatherData.main.temp)}°C</p>
              <p style={styles.description}>{currentWeatherData.weather[0].description}</p>
            </div>
          </div>
          <p>Humidity: {currentWeatherData.main.humidity}%</p>
          <p>Wind Speed: {currentWeatherData.wind.speed} m/s</p>
          <p>Feels like: {currentWeatherData.main.feels_like}°C</p>
        </div>
      )}

      {forecastData && (
        <WeatherTemperatureChart chartData={prepareChartData()} />
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    textAlign: 'center',
    padding: '30px',
    maxWidth: '900px',
    margin: '40px auto',
    backgroundColor: '#f5f7fa',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    color: '#333',
  },
  appTitle: {
    color: '#2c3e50',
    marginBottom: '35px',
    fontSize: '2.8em',
    fontWeight: '700',
    textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
  },
  inputGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  cityInput: {
    padding: '14px 20px',
    fontSize: '1.1em',
    borderRadius: '10px',
    border: '1px solid #aebac7',
    width: '70%',
    maxWidth: '400px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  cityInputFocus: {
    borderColor: '#007bff',
    boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.25)',
  },
  fetchButton: {
    padding: '14px 25px',
    fontSize: '1.1em',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 10px rgba(0, 123, 255, 0.3)',
  },
  fetchButtonHover: {
    backgroundColor: '#0056b3',
    transform: 'translateY(-2px)',
  },
  fetchButtonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  errorMessage: {
    color: '#e74c3c',
    marginTop: '20px',
    fontSize: '1.1em',
    fontWeight: '500',
  },
  weatherCard: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
    marginTop: '30px',
    marginBottom: '40px',
    display: 'inline-block',
    minWidth: '350px',
  },
  currentDetails: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0',
  },
  weatherIcon: {
    width: '100px',
    height: '100px',
    marginRight: '20px',
  },
  temperatureInfo: {
    textAlign: 'left',
  },
  mainTemp: {
    fontSize: '4.5em',
    fontWeight: 'bold',
    margin: '0',
    color: '#34495e',
    lineHeight: '1',
  },
  description: {
    fontSize: '1.4em',
    textTransform: 'capitalize',
    color: '#666',
    marginTop: '5px',
  },
};

export default WeatherApp;
