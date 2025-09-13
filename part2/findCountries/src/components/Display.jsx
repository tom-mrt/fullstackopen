const ShowDetail = ({ country, selectedCountry,weatherData }) => {

    const langs = Object.values(country.languages ?? {})
    if (selectedCountry === country.name.common) {
      const capital = Array.isArray(country.capital) ? country.capital.join(",") : country.capital
      return (
        <div>
          <h1>{country.name.common}</h1>
          Capital {capital}<br/>
          Area {country.area}
          <h2>Languages</h2>
          <ul>
            {langs.map(lang => {
            return (
              <li key={lang}>{lang}</li>
            )
          })}
          </ul>
          <img src={country.flags.png} alt={`${country.name.common} flag`}/>

          <h2>Weather in {country.capital}</h2>
          <p>Temperature {weatherData?.temp} Celsius</p>
          <img src={weatherData?.iconUrl} />
          <p>Wind {weatherData?.wind} m/s</p>

        </div>
      )
    }
    else return null
  }

const Display = ({ filtered, selectedCountry, weatherData, handleShow }) => {
    if (filtered.length >= 10) {
        return (
        <p>Too many matches, specify another filter</p>
        )
    }
    else if (filtered.length < 10 && filtered.length > 1) {
        return (
        <div>
            {filtered.map(country => {
            return (
            <div key={country.cca3}>
                <p>{country.name.common} <button onClick={() => handleShow(country.name.common)}>Show</button></p>
                <ShowDetail country={country} selectedCountry={selectedCountry} weatherData={weatherData}/>
            </div>
            )
        })}
        </div>
        )
    }
    else if (filtered.length === 1) {
        const country = filtered[0]
        return (
        <div>
            <ShowDetail country={country} selectedCountry={selectedCountry} weatherData={weatherData}/>
        </div>
        )
    }
    else {
        return (
        <div></div>
        )
    }
}

export default Display