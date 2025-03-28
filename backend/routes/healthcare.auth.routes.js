import express from "express"
import bcrypt from "bcryptjs"
import Healthcare from "../models/healthcare.model.js"
import { generateTokenAndSetCookieForHealthcare } from "../utils/generateToken.js"

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

//signup controller
async function signup(req, res) {
  try {
    const { name, email, password, contact, address } = req.body

    const healthcare = await Healthcare.findOne({ email })
    if (healthcare) {
      return res.status(400).json({ error: "Email already in use" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const newHealthcare = new Healthcare({
      name,
      email,
      password: hashPassword,
      contact,
      address,
    })

    if (newHealthcare) {
      generateTokenAndSetCookieForHealthcare(newHealthcare._id, res)
      await newHealthcare.save()

      return res.status(201).json({
        _id: newHealthcare._id,
        name: newHealthcare.name,
        email: newHealthcare.email,
      })
    } else {
      return res.status(400).json({ error: "Invalid Healthcare Data." })
    }
  } catch (error) {
    console.log("Error in signup:", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

//login controller
async function login(req, res) {
  try {
    const { email, password } = req.body
    const healthcare = await Healthcare.findOne({ email })

    if (!healthcare) {
      return res.status(400).json({ error: "Invalid Email" })
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      healthcare.password
    )
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Password" })
    }

    generateTokenAndSetCookieForHealthcare(healthcare._id, res)

    return res.status(200).json({
      _id: healthcare._id,
      name: healthcare.name,
      email: healthcare.email,
    })
  } catch (error) {
    console.log("Error in login:", error.message)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

//logout controller
function logout(req, res) {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Logged Out Successfully!" })
  } catch (error) {
    console.log("Error in logout:", error.message)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
export default router
