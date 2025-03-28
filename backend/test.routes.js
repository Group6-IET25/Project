import express from "express"

const router = express.Router()

router.post("/user/upload", handleIncomingFrames)
router.post("/user/response", handleUserResponse)
router.get("/user/track", trackAccident)

router.get("/healthcare/dashboard", getAvailableHelps)
router.post("/healthcare/help", markHealthcareHelping)

function handleIncomingFrames(req, res) {
  // accident didn't happend
  return res.status(200).json({ accidentDetected: false })

  // accident happened
  return res.status(200).json({ accidentDetected: true })
}

function handleUserResponse(req, res) {
  // user said that yes accident happened
  return res.status(200).json({ name: "Bilota Yadav", contact: "1234567890" })
}
function trackAccident(req, res) {}
function getAvailableHelps(req, res) {
  // return list of available people in need
  return res.status(200).json([
    {
      name: "qwe",
      personalContact: "1234567890",
      familyContact: "0987654321",
      location: "Haweli",
    },
    {
      name: "qwe",
      personalContact: "1234567890",
      familyContact: "0987654321",
      location: "Haweli",
    },
    {
      name: "qwe",
      personalContact: "1234567890",
      familyContact: "0987654321",
      location: "Haweli",
    },
    {
      name: "qwe",
      personalContact: "1234567890",
      familyContact: "0987654321",
      location: "Haweli",
    },
  ])
}
function markHealthcareHelping(req, res) {}

export default router
