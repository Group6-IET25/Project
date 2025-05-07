import mongoose from "mongoose"

const AccidentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Healthcare",
  },
  accidentLocation: {
    type: String,
    required: true,
  },
})

const AccidentModel = mongoose.model("Accidents", AccidentSchema)

export default AccidentModel
