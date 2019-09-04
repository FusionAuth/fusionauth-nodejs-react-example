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
    createdAt: Date,
    updatedAt: Date
});

// Setup indexes
todoSchema.index({ name: 1 }, { unique: true });

// Setup pre-use handler
todoSchema.pre("save", function (next) {
    // Get the current datetime.
    const now = Date.now();

    // Set the updated field to the current datetime.
    this.updatedAt = now;

    // Check if this is a new entry, ie createdAt is null.
    if (!this.createdAt) {
        // Set createdAt to the current datetime.
        this.createdAt = now;
    }

    next();
});

// Export the Todo Model.
module.exports = mongoose.model("todo", todoSchema)