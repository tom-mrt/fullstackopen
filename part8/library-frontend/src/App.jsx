import { useState } from "react";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from './components/Login';
import Recommend from './components/Recommend';
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './query';

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (b) => {
    let seen = new Set()
    return b.filter((item) => {
      const title = item.title
      
      return seen.has(title) ? false : seen.add(title)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
        return {
          allBooks: uniqByTitle(allBooks.concat(addedBook))
        }
      })
}

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [currentGenre, setCurrentGenre] = useState("");
  const result = useQuery(ALL_AUTHORS)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      // window.alert("new book added")
      const addedBook = data.data.bookAdded

      updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: currentGenre } }, addedBook)
      
    }
  })

  if (result.loading) {
    return <div>...loading</div>
  }

  const authors = result.data?.allAuthors ?? []

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()

    setPage("authors")
  }
    

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && (
          <div>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={logout}>logout</button>
          </div>
        )}
      </div>

      <Authors show={page === "authors"} authors={authors}/>

      <Books show={page === "books"} genre={currentGenre} setGenre={setCurrentGenre}/>
      {!token && <Login show={page === "login"} setToken={setToken} />}

      <NewBook show={page === "add"} currentGenre={currentGenre}/>

      <Recommend show={page === "recommend"} />
    </div>
  );
};

export default App;
