const express = require("express")
const path = require("path")
const session = express.Router()

const usersRouter = require("./routes/users")
const authRoutes = require("./routes/authRoutes")
const messageRoutes = require("./routes/messageRoutes")

const app = express()
const port = process.env.PORT || 4001

app.use(express.static("public"))

app.use(express.json())

app.use("/", messageRoutes)
app.use("/", authRoutes)
app.use("/users", usersRouter)

app.get("/", (req, res) => {
  // res.send('Welcome to our server!')
  res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.listen(port, () => {
  console.log(`Web server is listening on port ${port}!`)
})
