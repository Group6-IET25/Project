import jwt from "jsonwebtoken"
import Healthcare from "../models/healthcare.model.js"
const healthcareProtectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
      return res.status(401).json({ error: "Unauthorize: No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
      res.cookie("jwt", "", { maxAge: 0 })
      return res.status(401).json({ error: "Unauthorized: Invald Token" })
    }
    const healthcare = await Healthcare.findById(decoded.healthcareId).select(
      "-password"
    )
    if (!healthcare) {
      res.cookie("jwt", "", { maxAge: 0 })
      return res.status(404).json({ error: "Invalid User" })
    }
    req.healthcare = healthcare
    next()
  } catch (error) {
    console.log("Error in healthcareProtectRoute: ", error.message)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

export default healthcareProtectRoute
