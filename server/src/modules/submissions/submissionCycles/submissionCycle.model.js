import { Schema, model } from "mongoose";

/**
 * ════════════════════════════════════════════════════════════════
 * SUBMISSION CYCLE SCHEMA
 * ════════════════════════════════════════════════════════════════
 * 
 * Tracks each revision cycle of a manuscript submission
 * Stores editor decisions, technical editor reviews, and reviewer feedback
 * ════════════════════════════════════════════════════════════════
 */

const submissionCycleSchema = new Schema(
    {
        // ══════════════════════════════════════════════════════════
        // CORE REFERENCES
        // ══════════════════════════════════════════════════════════
        
        submissionId: {
            type: Schema.Types.ObjectId,
            ref: "Submission",
            required: [true, "Submission ID is required"],
            index: true,
        },

        cycleNumber: {
            type: Number,
            required: [true, "Cycle number is required"],
            min: [1, "Cycle number must be at least 1"],
            default: 1,
        },

        // ══════════════════════════════════════════════════════════
        // MANUSCRIPT VERSION REFERENCE
        // ══════════════════════════════════════════════════════════
        
        manuscriptVersionId: {
            type: Schema.Types.ObjectId,
            ref: "ManuscriptVersion",
            index: true,
        },

        // ══════════════════════════════════════════════════════════
        // ASSIGNED PERSONNEL
        // ══════════════════════════════════════════════════════════
        
        technicalEditorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },

        reviewersId: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],

        // ══════════════════════════════════════════════════════════
        // EDITOR REMARKS & DECISION
        // ══════════════════════════════════════════════════════════
        
        editorRemarks: {
            comment: {
                type: String,
                trim: true,
                maxlength: [5000, "Comment cannot exceed 5000 characters"],
            },
            attachmentRefs: [{
                type: String,
                trim: true,
            }],
            remarkedAt: {
                type: Date,
                default: Date.now,
            },
        },

        editorDecision: {
            type: {
                type: String,
                enum: {
                    values: ["REVISION", "ACCEPT", "REJECT"],
                    message: "{VALUE} is not a valid decision type",
                },
            },
            reason: {
                type: String,
                trim: true,
                maxlength: [2000, "Reason cannot exceed 2000 characters"],
            },
            decidedAt: Date,
        },

        // ══════════════════════════════════════════════════════════
        // STATUS TRACKING
        // ══════════════════════════════════════════════════════════
        
        status: {
            type: String,
            enum: {
                values: [
                    "IN_PROGRESS",
                    "COMPLETED",
                    "REVISION_REQUESTED",
                ],
                message: "{VALUE} is not a valid status",
            },
            default: "IN_PROGRESS",
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
submissionCycleSchema.index({ submissionId: 1, cycleNumber: 1 }, { unique: true });
submissionCycleSchema.index({ technicalEditorId: 1 });
submissionCycleSchema.index({ reviewersId: 1 });

// ══════════════════════════════════════════════════════════════════
// STATIC METHODS
// ══════════════════════════════════════════════════════════════════

submissionCycleSchema.statics.findBySubmission = async function (submissionId) {
    return this.find({ submissionId })
        .populate("technicalEditorId", "firstName lastName email")
        .populate("reviewersId", "firstName lastName email")
        .populate("manuscriptVersionId")
        .sort({ cycleNumber: 1 });
};

submissionCycleSchema.statics.getCurrentCycle = async function (submissionId) {
    return this.findOne({ submissionId })
        .sort({ cycleNumber: -1 })
        .populate("technicalEditorId", "firstName lastName email")
        .populate("reviewersId", "firstName lastName email")
        .populate("manuscriptVersionId");
};

const SubmissionCycle = model("SubmissionCycle", submissionCycleSchema);

console.log("📦 [SUBMISSION-CYCLE-MODEL] SubmissionCycle model created and exported");

export { SubmissionCycle };