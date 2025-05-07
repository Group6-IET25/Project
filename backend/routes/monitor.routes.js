import express from "express"
import { upload } from "../utils/upload.js"
import fs from "fs"

import Accident from "../models/accident.model.js"
import userProtectRoute from "../middleware/healthcareProtectRoute.js"
import healthcareProtectRoute from "../middleware/healthcareProtectRoute.js"

const router = express.Router()

router.post(
  "/user/upload",
  userProtectRoute,
  upload.single("currentFrame"),
  handleIncomingFrames
)
router.post("/user/response", userProtectRoute, handleUserResponse)
router.get("/user/track", userProtectRoute, trackAccident)

router.get("/healthcare/dashboard", healthcareProtectRoute, getAvailableHelps)
router.post("/healthcare/help", healthcareProtectRoute, markHealthcareHelping)

// this controller tests the incoming frames against the model
async function handleIncomingFrames(req, res) {
  try {
    // we get current frame's path via multer
    const currentFramePath = req.file.path
    // test frame against model
    // const testResponse = await fetch("localhost:")
    const testResponse = { accident: true }
    return res.status(200).json(testResponse)
  } catch (error) {
    console.log("Error in handleIncomingFrames: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  } finally {
    // must remove the file from our directory
    fs.unlinkSync(currentFramePath)
  }
}

// this controller handles user's response after an accident has been detected
async function handleUserResponse(req, res) {
  try {
    // when false accident was detected or user said no it will be handled on frontend
    // in case of accident create a new Accident entity in database and register it
    const { location } = req.body
    const newAccident = new Accident({
      userId: req.user._id,
      handledBy: null,
      accidentLocation: location,
    })
    if (newAccident) {
      // in case of accident, create a new aciddent and save it
      await newAccident.save()
      return res.status(201).json({ accidentId: newAccident._id })
      // returning accidentId so that user can keep track of accident.
    } else {
      return res.status(400).json({ error: "Something went wrong..." })
    }
  } catch (error) {
    console.log("Error in handleUserResponse: ", error.message)
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
    // get healthcare names and details
    if (accident.handledBy == null) {
      return res.status(200).json({ message: "Someone will soon connect !" })
    }
    let result = accident
      .populate("handledBy")
      .select("name email contact address accidentLocation")

    if (!result) {
      throw new Error("Couldn't get response")
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
      .populate("userId")
      .select(
        "name email personalContact familyContact address accidentLocation"
      )
    return res.status(200).json(availableHelps)
  } catch (error) {
    console.log("Error in getAvailableHelps: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

// this controller marks healthcare who opted to help
async function markHealthcareHelping(req, res) {
  try {
    const { healthcareId, accidentId } = req.healthcare._id
    const result = await Accident.findOneAndUpdate(
      { _id: accidentId },
      { $set: { handledBy: healthcareId } }
    )
    if (!result) {
      throw new Error("Something went wrong !")
    }
    return res.status(201).json(result)
  } catch (error) {
    console.log("Error in markHealthcareHelping: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

export default router
