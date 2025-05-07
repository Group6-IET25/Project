import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  personalContact: { type: String, required: true },
  familyContact: { type: String, required: true },
  address: { type: String, required: true },
})

const UserModel = mongoose.model("User", UserSchema)

export default UserModel
