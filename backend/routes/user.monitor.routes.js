import express from "express"
import fs from "fs"
import path from "path"
// import FormData from "form-data"
import fetch from "node-fetch"

import { upload } from "../utils/upload.js"
import { decodeToken } from "../utils/tokenManager.js"
import UserModel from "../models/user.model.js"
import AccidentModel from "../models/accident.model.js"

const router = express.Router()
const __dirname = path.resolve()

router.post("/upload", upload.single("frame"), handleIncomingFrames)
router.post("/response", handleUserResponse)
router.post("/track", trackAccident)

// this controller tests the incoming frames against the model
async function handleIncomingFrames(req, res) {
  try {
    // below line is for testing purpose
    // return res.status(200).json({ accident: true })
    const currentFramePath = req.file.path
    console.log(currentFramePath)
    const absolutePath = path.join(__dirname, currentFramePath)
    // test frame against model
    const form = new FormData()
    // Attach image to form
    form.append("file", fs.createReadStream(absolutePath), req.file.filename)
    // Send image to remote FastAPI model
    const response = await fetch(`${process.env.MODEL_URL}/api/model/predict`, {
      method: "POST",
      body: form,
    })
    const result = await response.json()
    const testResponse = { accident: result.accident }
    // no return as we need to remove file from our directory
    return res.status(200).json(testResponse)
  } catch (error) {
    console.log("Error in handleIncomingFrames: ", error)
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
      accidentLocation: `https://www.google.com/maps?q=${latitude},${longitude}`,
      status: "NeedsHelp",
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
    console.log(accidentId)
    const accident = await AccidentModel.findById(accidentId)
    if (accident == null) {
      return res.status(400).json({ error: "Invalid Accident ID." })
    }
    // get healthcare names and details
    if (accident.healthcareId == null) {
      return res
        .status(200)
        .json({ message: "Someone will soon connect to help you !" })
    }
    let result = await AccidentModel.findById(accidentId)
      .populate({
        path: "healthcareId",
        select: "-password",
      })
      .select("-__v -status")

    if (!result) {
      throw new Error("Couldn't get response")
    }
    return res.status(201).json(result)
  } catch (error) {
    console.log("Error in trackAccident:", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}
export default router
