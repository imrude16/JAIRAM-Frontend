import { Schema, model } from "mongoose";

/**
 * ════════════════════════════════════════════════════════════════
 * ROLE CHANGE REQUEST SCHEMA
 * ════════════════════════════════════════════════════════════════
 * 
 * Tracks role change requests from Editor to Admin
 * Implements approval workflow for role elevation
 * ════════════════════════════════════════════════════════════════
 */

const roleChangeRequestSchema = new Schema(
    {
        // ══════════════════════════════════════════════════════════
        // USER BEING CHANGED
        // ══════════════════════════════════════════════════════════
        
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },

        // ══════════════════════════════════════════════════════════
        // ROLE CHANGE DETAILS
        // ══════════════════════════════════════════════════════════
        
        currentRole: {
            type: String,
            enum: ["USER", "EDITOR", "TECHNICAL_EDITOR", "REVIEWER", "ADMIN"],
            required: true,
        },

        requestedRole: {
            type: String,
            enum: ["USER", "EDITOR", "TECHNICAL_EDITOR", "REVIEWER", "ADMIN"],
            required: true,
        },

        // ══════════════════════════════════════════════════════════
        // REQUEST TRACKING
        // ══════════════════════════════════════════════════════════
        
        requestedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Requester ID is required"],
        },

        reason: {
            type: String,
            trim: true,
            required: [true, "Reason for role change is required"],
            maxlength: [1000, "Reason cannot exceed 1000 characters"],
        },

        // ══════════════════════════════════════════════════════════
        // APPROVAL TRACKING
        // ══════════════════════════════════════════════════════════
        
        status: {
            type: String,
            enum: {
                values: ["PENDING", "APPROVED", "REJECTED"],
                message: "{VALUE} is not a valid status",
            },
            default: "PENDING",
            index: true,
        },

        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        reviewedAt: Date,

        adminComments: {
            type: String,
            trim: true,
            maxlength: [1000, "Admin comments cannot exceed 1000 characters"],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ══════════════════════════════════════════════════════════════════
// INDEXES
// ══════════════════════════════════════════════════════════════════
roleChangeRequestSchema.index({ userId: 1, status: 1 });
roleChangeRequestSchema.index({ requestedBy: 1 });
roleChangeRequestSchema.index({ reviewedBy: 1 });
roleChangeRequestSchema.index({ status: 1, createdAt: -1 });

// ══════════════════════════════════════════════════════════════════
// STATIC METHODS
// ══════════════════════════════════════════════════════════════════

roleChangeRequestSchema.statics.findPendingRequests = async function () {
    return this.find({ status: "PENDING" })
        .populate("userId", "firstName lastName email role")
        .populate("requestedBy", "firstName lastName email role")
        .sort({ createdAt: -1 });
};

roleChangeRequestSchema.statics.findByUser = async function (userId) {
    return this.find({ userId })
        .populate("requestedBy", "firstName lastName email")
        .populate("reviewedBy", "firstName lastName email")
        .sort({ createdAt: -1 });
};

const RoleChangeRequest = model("RoleChangeRequest", roleChangeRequestSchema);

console.log("📦 [ROLE-CHANGE-REQUEST-MODEL] RoleChangeRequest model created and exported");

export { RoleChangeRequest };