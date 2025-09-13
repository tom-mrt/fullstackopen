import { useState, useEffect } from 'react'
import weatherService from './services/weather'
import countriesService from "./services/countries"
import Display from './components/Display'

function App() {
  const [countriesList, setList] = useState([])
  const [filteredList, setFilter] = useState([])
  const [selectedCountry, setCountry] = useState(null)
  const [weatherData, setWeather] = useState(null)



  useEffect(() => {
    countriesService
      .getAll()
      .then(countryData => {
        setList(countryData)
      })
  }, [filteredList])

  useEffect(() => {
    if (filteredList.length === 1) {
      const country = filteredList[0]
      setCountry(country.name.common)
    } else {
      setCountry(null)
      setWeather(null)
    }
  }, [filteredList])

  useEffect(() => {
    if (selectedCountry) {
      countriesService
        .getOne(selectedCountry)
        .then(countryData => {
          weatherService
            .fetchWeather(countryData)
            .then(weatherData => {
              const tempWeather = {}
              tempWeather.iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
              tempWeather.temp = weatherData.main.temp
              tempWeather.wind = weatherData.wind.speed
              setWeather(tempWeather)
            })
        })
    } else {
      setWeather(null)
    }

  }, [selectedCountry])
  

  const handleChange = (event) => {
    const query = event.target.value.toLowerCase().trim()
    const filtered = countriesList.filter(country => {
      const name = country.name.common.toLowerCase()
      return name.includes(query)
      })
    setFilter(filtered)
    setCountry(null)
    }

  const handleShow = (countryName) => {
    setCountry(countryName)
  }
    

  return (
    <div>
      find coutries <input type='text' onChange={handleChange}></input>
      <Display filtered={filteredList} selectedCountry={selectedCountry} weatherData={weatherData} handleShow={handleShow}/>
    </div>
  )
}

export default App
