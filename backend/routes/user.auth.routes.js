import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import { generateToken } from "../utils/tokenManager.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)

//signup controller
async function signup(req, res) {
  try {
    const { name, email, password, personalContact, familyContact, address } =
      req.body
    if (
      name == null ||
      email == null ||
      password == null ||
      familyContact == null ||
      personalContact == null ||
      address == null
    ) {
      return res.status(400).json({ error: "Incomplete User Data!" })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Minimum password length is 6!" })
    }
    const user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ error: "Email already in use!" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      personalContact,
      familyContact,
      address,
    })

    if (newUser) {
      const token = generateToken(newUser._id)
      await newUser.save()
      return res
        .status(201)
        .json({ message: "Signup successfull !", jwt: token })
    } else {
      return res.status(400).json({ error: "Invalid User Data." })
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
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ error: "Invalid Email." })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Password." })
    }

    const token = generateToken(user._id)

    return res.status(200).json({ message: "Login successfull !", jwt: token })
  } catch (error) {
    console.log("Error in login:", error.message)
    return res.status(500).json({ error: "Internal Server Error." })
  }
}

export default router
