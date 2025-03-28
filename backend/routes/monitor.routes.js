import express from "express"

import Accident from "../models/accident.model.js"
import userProtectRoute from "../middleware/healthcareProtectRoute.js"
import healthcareProtectRoute from "../middleware/healthcareProtectRoute.js"

const router = express.Router()
router.post("/user/upload", userProtectRoute, handleIncomingFrames)
router.post("/user/response", userProtectRoute, handleUserResponse)
router.get("/user/track", userProtectRoute, trackAccident)

router.get("/healthcare/dashboard", healthcareProtectRoute, getAvailableHelps)
router.post("/healthcare/help", healthcareProtectRoute, markHealthcareHelping)

// this controller tests the incoming frames against the model
async function handleIncomingFrames(req, res) {
  try {
  } catch (error) {
    console.log("Error in handleIncomingFrames: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

// this controller tests the incoming frames against the model
async function handleUserResponse(req, res) {
  try {
    const { response } = req.body
    if (!response) {
      // a case when false accident was detected or user said no
      return res.status(201).json({ message: "No Problem!" })
    }
    // in case of accident create a new Accident entity in database and register it
    const newAccident = new Accident({
      userId: req.user._id,
      handledBy: null,
    })
    if (newAccident) {
      // in case of accident create a new acciddent and save it
      await newAccident.save()
      return res.status(201).json({ accidentId: newAccident._id })
      // returning accidentId so that user can keep track of accident.
    } else {
      return res.status(400).json({ error: "Something went wrong..." })
    }
  } catch (error) {
    console.log("Error in handleIncomingFrames: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

// this function allows user to track who is on its way to help them
async function trackAccident(req, res) {
  try {
    const { accidentId } = req.body
    const accident = Accident.findById(accidentId)
    if (!accident) {
      return res.status(400).json({ message: "Invalid Accident ID." })
    }
    let result = accident
      .populate("handledBy")
      .select("name email contact address location")

    if (!result) {
      throw new Error("Couldn't Get Response")
    }

    return res.status(201).json(result)
  } catch (error) {
    console.log("Error in trackAccident:", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

// this controller sends the logged in healthcare list of person who they can help
async function getAvailableHelps(req, res) {
  try {
    const availableHelps = Accident.find({ handledBy: null })
    if (!availableHelps) {
      throw new Error("availableHelps returned null!")
    }
    return res.status(200).json(availableHelps)
  } catch (error) {
    console.log("Error in handleIncomingFrames: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

// this controller marks healthcare who opted to help
async function markHealthcareHelping(req, res) {
  try {
    const { healthcareId } = req.healthcare._id
  } catch (error) {
    console.log("Error in handleIncomingFrames: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

export default router
