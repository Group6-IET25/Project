import express from "express"

import { decodeToken } from "../utils/tokenManager.js"
import AccidentModel from "../models/accident.model.js"

const router = express.Router()

router.get("/dashboard", getAvailableHelps)
router.post("/help", markHealthcareHelping)

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
