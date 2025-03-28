import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import generateTokenAndSetCookieForUser from "../utils/generateToken.js"

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

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
      return res.status(400).json({ message: "Incomplete User Data" })
    }
    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ error: "Email already in use" })
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
      generateTokenAndSetCookieForUser(newUser._id, res)
      await newUser.save()

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      })
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
      return res.status(400).json({ error: "Invalid Email" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Password" })
    }

    generateTokenAndSetCookieForUser(user._id, res)

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
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
