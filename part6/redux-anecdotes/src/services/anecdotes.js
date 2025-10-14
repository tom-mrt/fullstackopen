const baseUrl = "http://localhost:3001/anecdotes"

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error("failed to fetch anecdotes")
  }

  return await response.json()
};

const createAnecdote = async (content) => {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, votes: 0 })
  })

  if (!response.ok) {
    throw new Error("failed to create Anecdotes")
  }

  return await response.json()
}

const voteAnecdote = async (anecdote) => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...anecdote, votes: anecdote.votes + 1 })
  })

  if (!response.ok) {
    throw new Error("failed to update votes")
  }

  return await response.json()

}

export default { getAll, createAnecdote, voteAnecdote }