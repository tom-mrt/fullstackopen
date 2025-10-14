const baseUrl = "http://localhost:3001/notes"

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error("failed to fetch notes")
  }

  return await response.json()
}

const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, important: false }),
  })

  if (!response.ok) {
    throw new Error("failed to create note")
  }

  return await response.json()
};

export default { getAll, createNew }