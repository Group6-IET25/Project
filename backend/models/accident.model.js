import mongoose from "mongoose"

const AccidentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  healthcareId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Healthcare",
  },
  accidentLocation: {
    type: String,
  },
  status: {
    type: String,
    enum: ["NeedsHelp", "Helping", "Helped"],
    // to limit what can be there
  },
})

const AccidentModel = mongoose.model("Accidents", AccidentSchema)

export default AccidentModel
