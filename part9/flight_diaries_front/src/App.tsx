const WEATHER = ["sunny", "rainy", "cloudy", "windy", "stormy"] as const;
const VISIBILITY = ["great", "good", "ok", "poor"] as const;

type Weather = (typeof WEATHER)[number];
type Visibility = (typeof VISIBILITY)[number];

interface Diary {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
};

type NewDiary = Omit<Diary, "id">;

import { useState, useEffect, type ChangeEvent } from 'react'
import axios from 'axios';

function App() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<string>("");
  const [weather, setWeather] = useState<string>("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get<Diary[]>("http://localhost:3000/api/diaries")
      .then(res => {
        setDiaries(res.data);
      })
  }, [])

  const clearState = () => {
    setDate("");
    setVisibility("");
    setWeather("");
    setComment("");
  };

  const handleVisibilityChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    
    setVisibility(event.target.value);
  };

  const isVisibility = (value: string): value is Visibility => {
    return ["great", "good", "ok", "poor"].includes(value);
  };

  const isWeather = (value: string): value is Weather => {
    return ["sunny", "rainy", "cloudy", "windy", "stormy"].includes(value);
  };

  const diaryCreate = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!isVisibility(visibility) || !isWeather(weather)) {
      throw new Error("visibility, weatherの値が不正確です。")
    }

    const newDiary: NewDiary = { date, visibility, weather, comment };
    try {
      axios.post("http://localhost:3000/api/diaries", newDiary)
      .then(res => {
        console.log(res.data);
        setDiaries(diaries.concat(res.data));
        clearState();
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        
      }
    }
  };

  return (
    <>
      <h2>Add new Entry</h2>
      <form onSubmit={diaryCreate}>
        <div>
          <label htmlFor="date">Date</label>
          <input 
            type="date"
            id="data"
            value={date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
          />
        </div>
        <div>
          visibility 
          {VISIBILITY.map(v => (
            <label key={v}>
              <input 
                type="radio"
                id={v}
                value={v}
                name="visibility"
                onChange={handleVisibilityChange}
              />
              {v}
            </label>
          ))}
        </div>  
        <div>
          Weather
          {WEATHER.map(w => (
            <label key={w}>
              <input 
                type="radio"
                id={w}
                value={w}
                name="weather"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeather(e.target.value)}
              />
              {w}
            </label>
          ))}
        </div>
        <div>
          <label htmlFor="comment">Comment</label>
          <input 
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map(d => {
        return (
          <div key={d.id}>
            <h3>{d.date}</h3>
            weather: {d.weather} <br />
            visibility: {d.visibility} <br />
          </div>
        )
      })}

    </>
  )
}

export default App
