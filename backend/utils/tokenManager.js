import jwt from "jsonwebtoken"

const generateToken = (_id) => {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  })
  return token
}
function decodeToken(token, res) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
      return res
        .status(400)
        .json({ error: "Unauthorized: Token can't be decoded!" })
    }
    if (!decoded._id) {
      return res.status(400).json({ error: "Unauthorized: Invalid Token" })
    }
    return decoded._id
  } catch (error) {
    console.log("Error in decodeToken: ", error.message)
    return res.status(500).json({ error: "Internal server error!" })
  }
}
export { generateToken, decodeToken }
