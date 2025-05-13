import express from "express"
import path from "path"
import dotenv from "dotenv"
import cors from "cors"

import connectToMongoDb from "./utils/connectToMongoDb.js"

import userAuthRouter from "./routes/user.auth.routes.js"
import healthcareAuthRouter from "./routes/healthcare.auth.routes.js"
import userMonitorRouter from "./routes/user.monitor.routes.js"
import healthcareMonitorRouter from "./routes/healthcare.monitor.routes.js"

const app = express()
const __dirname = path.resolve()
dotenv.config()

app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
  })
)

app.use("/api/auth/user", userAuthRouter)
app.use("/api/auth/healthcare", healthcareAuthRouter)
app.use("/api/monitor/user", userMonitorRouter)
app.use("/api/monitor/healthcare", healthcareMonitorRouter)
app.use("/api/", (req, res) => {
  // res.redirect("/")
  res.status(400).json({ error: "Invalid API endpoint." })
})

app.use(express.static(path.join(__dirname, "../frontend/dist")))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  connectToMongoDb()
  console.log(`Server Running on ${PORT}`)
})
