const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
    email: { 
        type: String, 
        unique: true, 
        required: true },
    password: { 
        type: String, 
        required: true },
    fullName: String,
    username: String,
    
    
    },
    {
        timestamps: true
    }
  );
  
  module.exports = model("User", userSchema);