/**
 * Roles Model
 *
 * This sets up the Roles Model for the application. Roles are utilized
 * to determine user access to view, add, edit, or delete content for different
 * pages. The unique identifier for the roles is the route name being accessed.
 */

// Dependencies
const mongoose = require("mongoose")

// Schema for the Roles Model.
const roleSchema = new mongoose.Schema({
    route:  {
        type: String,
        index: true,
        unique: true
    },
    create: [String],
    read: [String],
    update: [String],
    delete: [String]
});

// Setup indexes
roleSchema.index({ route: 1 }, { unique: true });

// Export the Roles Model.
module.exports = mongoose.model("role", roleSchema)