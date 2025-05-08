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
})

const AccidentModel = mongoose.model("Accidents", AccidentSchema)

export default AccidentModel
