const mongoose = require("mongoose")

if (process.env.length < 3) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://tomoyamorita:${password}@cluster0.xizx0of.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)

// データベースへの接続を確立
mongoose.connect(url)


const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

// モデル定義
const Note = mongoose.model("Note", noteSchema)

// const note = new Note({
//     content: "Hello JavaScript",
//     important: false,
// })

// note.save().then(result => {
//     console.log("note saved")
//     mongoose.connection.close()
// })

Note.find({important: true}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})