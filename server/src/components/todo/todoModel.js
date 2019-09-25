/**
 * Todo Model
 *
 * This sets up the Todo Model for the application.
 */

// Dependencies
const mongoose = require("mongoose")

// Schema for the Roles Model.
const todoSchema = new mongoose.Schema({
    userID: String,
    name:  {
        type: String,
        index: true,
        required: true
    },
    description: String,
    done: Boolean,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Setup pre-use handler for the update one function.
todoSchema.pre("updateOne", function (next) {
    // Set the updated field to the current datetime.
    this.update({},{ $set: { updatedAt: new Date() } });

    // Continue in the model.
    next();
});

// Export the Todo Model.
module.exports = mongoose.model("todo", todoSchema)