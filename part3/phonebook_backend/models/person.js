const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI

console.log("connected to:", url);

// データベースへの接続を確立
mongoose.connect(url)
    .then(res => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log("connection error:", error.message)
    })


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: (v) => {
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: props => `${props.value}は無効です`,
        }
    }
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// モデル定義
module.exports = mongoose.model("Person", personSchema)


