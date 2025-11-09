import { gql } from '@apollo/client'

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    id
    name
    born
    bookCount
  }
`

export const  ALL_AUTHORS = gql`
    query {
      allAuthors {
        ...AuthorDetails
      }
    }
    ${AUTHOR_DETAILS}
  `

export const ALL_BOOKS = gql`
  query allBooks($author: String, $genre: String) {
    allBooks (
      author: $author,
      genre: $genre,
    ){
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      published
      genres
      author {
        ...AuthorDetails
      }  
    }
  }
  ${AUTHOR_DETAILS}
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo,
    ) {
      name
      born  
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password,
    ) {
      value
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author {
        ...AuthorDetails
      }
      id
      genres
    }
  }
  ${AUTHOR_DETAILS}
`

