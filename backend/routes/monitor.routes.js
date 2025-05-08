import express from "express"
import fs from "fs"

import { upload } from "../utils/upload.js"
import { decodeToken } from "../utils/tokenManager.js"

import UserModel from "../models/user.model.js"
import AccidentModel from "../models/accident.model.js"
const router = express.Router()
router.post("/user/upload", upload.single("frame"), handleIncomingFrames)
router.post("/user/response", handleUserResponse)
router.get("/user/track", trackAccident)

router.get("/healthcare/dashboard", getAvailableHelps)
router.post("/healthcare/help", markHealthcareHelping)

// this controller tests the incoming frames against the model
async function handleIncomingFrames(req, res) {
  try {
    const currentFramePath = req.file.path
    console.log(currentFramePath)
    // test frame against model
    const form = new FormData()
    // Attach image to form
    form.append("frame", fs.createReadStream(currentFramePath))
    // Send image to remote FastAPI model
    // const testResponse = await fetch(process.env.MODEL_URL, {
    //   method: "POST",
    //   body: form,
    //   headers: form.getHeaders(),
    // });
    const testResponse = { accident: true }
    // no return as we need to remove file from our directory
    return res.status(200).json(testResponse)
  } catch (error) {
    console.log("Error in handleIncomingFrames: ", error.message)
    res.status(500).json({ error: "Internal Server Error!" })
  } finally {
    // must remove the file from our directory
    fs.unlinkSync(req.file.path)
  }
}

// this controller handles user's response after an accident has been detected
async function handleUserResponse(req, res) {
  try {
    // when false accident was detected or user said no it will be handled on frontend
    // in case of accident create a new Accident entity in database and register it
    const { latitude, longitude, token } = req.body
    const userId = decodeToken(token, res)
    const isUserIdValid = await UserModel.findById(userId)
    if (!isUserIdValid) {
      return res.status(400).json({ error: "Wrong token credentials!" })
    }
    const newAccident = new AccidentModel({
      userId: userId,
      healthcareId: null,
      accidentLocation: `Latitude: ${latitude}, Longitude: ${longitude}`,
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
    console.log("Error in handleUserResponse: ", error)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

// this function allows user to track who is on its way to help them
async function trackAccident(req, res) {
  try {
    const { accidentId } = req.body
    const accident = await AccidentModel.findById(accidentId)
    if (accident == null) {
      return res.status(400).json({ message: "Invalid Accident ID." })
    }
    // get healthcare names and details
    if (accident.healthcareId == null) {
      return res.status(200).json({ message: "Someone will soon connect !" })
    }
    let result = await AccidentModel.findById(accidentId)
      .populate({
        path: "healthcareId",
        select: "-password",
      })
      .select("-__v")

    if (!result) {
      throw new Error("Couldn't get response")
    }
    const response = result.toObject() // Convert to plain JS object
    response.message = "Help is on way!"
    return res.status(201).json(response)
  } catch (error) {
    console.log("Error in trackAccident:", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

// this controller sends the logged in healthcare list of person who they can help
async function getAvailableHelps(req, res) {
  try {
    const availableHelps = await AccidentModel.find({ healthcareId: null })
      .populate({
        path: "userId",
        select: "-password -__v ",
      })
      .select("-__v")
    return res.status(200).json(availableHelps)
  } catch (error) {
    console.log("Error in getAvailableHelps: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

// this controller marks healthcare who opted to help
async function markHealthcareHelping(req, res) {
  try {
    const { token, accidentId } = req.healthcare._id
    const healthcareId = decodeToken(token, res)
    const isIdValid = await AccidentModel.findById(healthcareId)
    if (!isIdValid) {
      return res.status(400).json({ error: "Wrong token credentials!" })
    }
    const result = await AccidentModel.findOneAndUpdate(
      { _id: accidentId },
      { $set: { healthcareId: healthcareId } }
    ).select("-__v")

    if (!result) {
      throw new Error("Something went wrong !")
    }
    const response = result.toObject()
    response.message = "Marked Helping !"
    return res.status(201).json(result)
  } catch (error) {
    console.log("Error in markHealthcareHelping: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

export default router
