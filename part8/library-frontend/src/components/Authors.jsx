import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { EDIT_AUTHOR, ALL_AUTHORS } from '../query';

const Authors = (props) => {
  const [selectedName, setSelectedName] = useState(props.authors[0]?.name ?? "");
  const [born, setBorn] = useState("");

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS }]
  })

  if (!props.show) {
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    editAuthor({ variables: {name: selectedName, setBornTo: born} })

    setSelectedName("")
    setBorn("")
  }

  
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {props.authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <select
         value={selectedName}
         onChange={({ target }) => setSelectedName(target.value)}
      >
        {props.authors.map(a => {
          return (
            <option key={a.id} value={a.name}>{a.name}</option>
          )
        })}
      </select>
      <form onSubmit={handleSubmit}>
        <div>
          born
          <input 
            type='number'
            value={born}
            onChange={({ target}) => setBorn(Number(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
