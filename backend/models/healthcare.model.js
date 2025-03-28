import mongoose from "mongoose"

const HealthcareSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
})

const HealthcareModel = mongoose.model("Healthcare", HealthcareSchema)

export default HealthcareModel
