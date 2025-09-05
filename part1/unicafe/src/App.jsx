import { useState } from 'react'

const Header = (props) => {
  return (
    <h1>{props.text}</h1>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const StatisticLine = (props) => {

  if (props.unit) {
    return (
      <p>{props.text} {props.value} {props.unit}</p>
    )
  }

  return (
    <p>{props.text} {props.value}</p>
  )
}

const Statistics = ({ good, neutral, bad}) => {
  const sum = good + neutral + bad
  if (sum === 0) {
    return (
      <>
        <Header text="statistics" />
        <p>No feedback given</p>
      </>
    )
  }

  const average = (good - bad) / sum
  const positive = good / sum * 100


  return (
    <>
      <Header text="statistics" />
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value ={sum} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={positive} unit="%" />
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
  }
  const handleNeutral = () => {
    setNeutral(neutral + 1)
  }
  const handleBad = () => {
    setBad(bad + 1)
  }

  

  return (
    <div>
      <Header text="give feedback" />
      <Button onClick={handleGood} text="good" />
      <Button onClick={handleNeutral} text="neutral" />
      <Button onClick={handleBad} text="bad" />
      
      
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App