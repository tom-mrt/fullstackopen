import { useState, useEffect } from 'react'
import Filter from "./components/Filter"
import PersonForm from './components/PersonForm'
import Persons from "./components/Persons"
import personService from "./services/persons"
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState()
  const [newNumber, setNewNumber] = useState()
  const [searchValue, setSearch] = useState()
  const [notifiedMessage, setNotifiedMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(personsList => {
        setPersons(personsList)
      })
  }, [])

  const AddInfo = (event) => {
    event.preventDefault()

    if (persons.map(person => person.name).includes(newName)) {
      const ok = confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      
      if (ok) {
        const changedPerson = {name: newName, number: String(newNumber)}
        const targetId = persons.find(person => person.name === newName).id
        personService
          .update(changedPerson, targetId)
          .then(data => {
            setPersons(persons.map(person => person.id === targetId ? data : person))
            setNotifiedMessage(`Changed ${newName}'s phone number.`)
            setTimeout(() => {
              setNotifiedMessage(null)
            }, 5000)
            setNewName("")
            setNewNumber("")
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
        return
      }
      else return
      
    }

    const newInfo = {name: newName, number: String(newNumber)}

    personService
      .create(newInfo)
      .then(person => {
        setPersons(persons.concat(person))
        setNotifiedMessage(`Added ${newName}`)
        setTimeout(() => {
          setNotifiedMessage(null)
        }, 5000)
        setNewName("")
        setNewNumber("")
      })
      .catch(error => {
        console.log(error.response.data.error)
        setErrorMessage(`${error.response.data.error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearch(String(event.target.value).toLowerCase())
  }

  const handleDelete = (id) => {
    const deletedPerson = persons.find(person => person.id === id)
    const ok = window.confirm(`Deleted ${deletedPerson.name}?`)
    if (ok) {
      personService
        .deletePerson(id)
    setPersons(persons.filter(person => person.id !== id))
    return
    }
    else return

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifiedMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter onChange={handleSearch}/>

      <h2>add a new</h2>
      <PersonForm onSubmit={AddInfo} newName={newName}  newNumber={newNumber} onChangeName={handleName} onChangeNum={handleNumber}/>
      <h2>Numbers</h2>
      <Persons searchValue={searchValue} persons={persons} handleDelete={handleDelete}/>
      ...
    </div>
  )
}

export default App