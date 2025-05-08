import express from "express"
import bcrypt from "bcryptjs"
import Healthcare from "../models/healthcare.model.js"
import { generateToken } from "../utils/tokenManager.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)

//signup controller
async function signup(req, res) {
  try {
    const { name, email, password, contact, address } = req.body
    if (
      name == null ||
      email == null ||
      password == null ||
      contact == null ||
      address == null
    ) {
      return res.status(400).json({ message: "Incomplete Healthcare Data" })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Minimum password length is 6!" })
    }
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
      const token = generateToken(newHealthcare._id)
      await newHealthcare.save()

      return res
        .status(201)
        .json({ message: "Signup Successfull!", jwt: token })
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

    const token = generateToken(healthcare._id, res)

    return res.status(200).json({ message: "Login Successfull!", jwt: token })
  } catch (error) {
    console.log("Error in login:", error.message)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

export default router
