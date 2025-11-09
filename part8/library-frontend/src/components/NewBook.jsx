import { useState } from 'react'
import { useMutation } from '@apollo/client/react';
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from '../query';
import { updateCache } from '../App';

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(CREATE_BOOK, {
    update: (cache, { data }) => {
      updateCache(cache, { query: ALL_BOOKS, variables: { genre: props.currentGenre } }, data.addBook)
      
      cache.updateQuery({ query: ALL_AUTHORS}, ({ allAuthors }) => {
        const exists = allAuthors.some(a => a.id === data.addBook.author.id)
        return exists
          ? { allAuthors: allAuthors.map(a => a.id === data.addBook.author.id ? {...a, bookCount: (a.bookCount ?? 0) + 1} : a) }
          : { allAuthors: allAuthors.concat(data.addBook.author)}
      })
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    console.log("created new book");
    

    createBook({ variables: { title, author, published, genres} })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook