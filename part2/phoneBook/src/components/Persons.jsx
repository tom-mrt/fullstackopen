const Person = ({ person, handleDelete }) => {
    return (
        <>  
            <p>{person.name} {person.number}</p>
            <button onClick={() => handleDelete(person.id)}>delete</button>
        </>
    )
}

const Persons = ({ searchValue, persons, handleDelete }) => {
    return (
        <div>
            {searchValue ? 
                persons.filter(person => person.name.toLowerCase().includes(searchValue)).map(person => {
                    return (
                        <Person key={person.id} person={person} handleDelete={handleDelete}/>
                    )
                }) : 
                persons.map(person => {
                    return (
                            <Person key={person.id} person={person} handleDelete={handleDelete}/>
                    )
                })}
        </div>
    )
}

export default Persons