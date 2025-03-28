import jwt from "jsonwebtoken"

export default function generateTokenAndSetCookieForUser(userId, res) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  })

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  })
}

export function generateTokenAndSetCookieForHealthcare(healthcareId, res) {
  const token = jwt.sign({ healthcareId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  })

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  })
}
