import express from "express"
import path from "path"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectToMongoDb from "./utils/connectToMongoDb.js"

import userAuthRouter from "./routes/user.auth.routes.js"
import healthcareAuthRouter from "./routes/healthcare.auth.routes.js"
import monitorRouter from "./routes/monitor.routes.js"
import testRouter from "./test.routes.js"

const __dirname = path.resolve()
dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth/user", userAuthRouter)
app.use("/api/auth/healthcare", healthcareAuthRouter)
app.use("/api/monitor", monitorRouter)
app.use("/api/test/monitor", testRouter)
app.use("/api/", (req, res) => {
  res.redirect("/")
})

app.use(express.static(path.join(__dirname, "/frontend/dist")))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"))
})
const PORT = process.env.PORT

app.listen(PORT, () => {
  connectToMongoDb()
  console.log(`Server Running on ${PORT}`)
})
