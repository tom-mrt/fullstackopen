const mongoose = require("mongoose")

if (process.env.length < 3) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://tomoyamorita:${password}@cluster0.xizx0of.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)

// データベースへの接続を確立
mongoose.connect(url)


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// モデル定義
const Person = mongoose.model("Person", personSchema)

if (process.argv[3] && process.argv[4]) {
    const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
    })
    person.save().then(res => {
        console.log("person saved");
    })
}

Person
    .find({})
    .then(persons => {
        persons.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
