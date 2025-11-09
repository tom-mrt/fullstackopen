import { useQuery } from "@apollo/client/react";
import { ME, ALL_BOOKS } from '../query';

const Recommend = (props) => {
  // 真偽値に変換
  const visible = !!props.show

  const token = localStorage.getItem("booklists-user-token")
  const userResult = useQuery(ME, {
    skip: !token || !visible,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first"
  })
  
  const genre = userResult.data?.me.favoriteGenre ?? null

  const bookResult = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre || !visible
  })

  if (userResult.loading || bookResult.loading) {
    return <div>...loading</div>
  }
  
  if (!visible) {
    return null
  }

  const books = bookResult.data?.allBooks ?? []

  return (
    <div>
      <h2>recommendations</h2>

      <p>books in your favorite genre <strong>{genre}</strong></p>

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
          ))
          }
        </tbody>
      </table>
    </div>
  )
};

export default Recommend