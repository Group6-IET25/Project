import express from "express"

import { decodeToken } from "../utils/tokenManager.js"
import AccidentModel from "../models/accident.model.js"

const router = express.Router()

router.get("/needsHelp", fetchAvailableHelps)
router.post("/markHelping", markHealthcareHelping)
router.post("/currentlyHelping", fetchCurrentlyHelping)
router.post("/markDone", markAccidentHandled)
router.post("/previouslyHelped", fetchPreviouslyHelped)

// this controller sends the list of person who healthcare can help
async function fetchAvailableHelps(req, res) {
  try {
    const availableHelps = await AccidentModel.find({ status: "NeedsHelp" })
      .populate({
        path: "userId",
        select: "-password -__v ",
      })
      .select("-__v -status")
    return res.status(200).json(availableHelps)
  } catch (error) {
    console.log("Error in getAvailableHelps: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

// this controller marks healthcare who opted to help
async function markHealthcareHelping(req, res) {
  try {
    const { token, accidentId } = req.body
    const healthcareId = decodeToken(token, res)
    const accident = await AccidentModel.findById(accidentId)
    if (!accident) {
      return res.status(400).json({ error: "Wrong accidentId ." })
    }
    if (accident.status != "NeedsHelp") {
      return res
        .status(200)
        .json({ message: "Help was already offered by someone else." })
    }
    const result = await AccidentModel.findOneAndUpdate(
      { _id: accidentId },
      { $set: { healthcareId: healthcareId, status: "Helping" } }
    ).select("-__v")

    if (!result) {
      throw new Error("Coudn't update database.")
    }
    return res.status(201).json({ message: "Successfully marked helping!" })
  } catch (error) {
    console.log("Error in markHealthcareHelping: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

// this controller fetches the list of people they are helping
async function fetchCurrentlyHelping(req, res) {
  try {
    const { token } = req.body
    const healthcareId = decodeToken(token, res)
    const accidentsHelping = await AccidentModel.find({
      healthcareId: healthcareId,
      status: "Helping",
    })
      .populate({ path: "userId", select: "-__v -password" })
      .select("-__v -status")

    if (!accidentsHelping) {
      return res.status(400).json({ error: "Wrong healthcareId." })
    }

    return res.status(201).json(accidentsHelping)
  } catch (error) {
    console.log("Error in fetchCurrentlyHelping: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

// this controller marks that a healthcare has successfully handled an accident
async function markAccidentHandled(req, res) {
  try {
    const { accidentId } = req.body
    const accident = await AccidentModel.findById(accidentId)
    if (!accident) {
      return res.status(400).json({ error: "Wrong accidentId." })
    }
    if (accident.status == "Helped") {
      return res.status(200).json({ error: "Already Marked Helped!" })
    }
    const result = await AccidentModel.findOneAndUpdate(
      { _id: accidentId },
      { $set: { status: "Helped" } }
    ).select("-__v -status")

    if (!result) {
      throw new Error("Coudn't update database.")
    }

    return res.status(201).json({ message: "Marked Helped Successfully!" })
  } catch (error) {
    console.log("Error in markAccidentHandled: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

// this controller marks healthcare who opted to help
async function fetchPreviouslyHelped(req, res) {
  try {
    const { token } = req.body
    const healthcareId = decodeToken(token, res)

    const accidentsHelped = await AccidentModel.find({
      healthcareId: healthcareId,
      status: "Helped",
    })
      .populate({ path: "userId", select: "-__v -password" })
      .select("-__v -status")

    return res.status(201).json(accidentsHelped)
  } catch (error) {
    console.log("Error in fetchPreviouslyHelped: ", error.message)
    return res.status(500).json({ error: "Internal Server Error!" })
  }
}

export default router
