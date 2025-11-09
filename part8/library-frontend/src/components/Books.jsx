import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from '../query';

const Books = ({ show, genre, setGenre }) => {
  const result = useQuery(ALL_BOOKS, {
    variables: { genre }
  })
  console.log(result);
  

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>...loading</div>
  }

  const books = result.data.allBooks ?? []
  const allGenres = [...new Set(books.flatMap(b => {
    
    return b.genres}))]
  

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <p>in genre <strong>{genre}</strong></p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
          {/* {genre && books.filter((a) => a.genres.includes(genre)).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))
          } */}
        </tbody>
      </table>
      {allGenres.map(g => {
        return (
          <button key={g} onClick={() => setGenre(g)}>{g}</button>
        )
      })}
      <button onClick={() => setGenre("")}>all</button>
    </div>
  )
}

export default Books
