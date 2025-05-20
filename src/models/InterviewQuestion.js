import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    idealAnswer: {
        type: String,
        required: true,
        trim: true
    },
    keyPoints: [{
        type: String,
        trim: true
    }],
    role: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    usageCount: {
        type: Number,
        default: 0
    },
    lastUsed: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create compound index for efficient querying
interviewQuestionSchema.index({ role: 1, level: 1, category: 1 });

// Create text index for question search
interviewQuestionSchema.index({ question: 'text' });

// Kiểm tra và xóa model cũ nếu tồn tại
if (mongoose.models.InterviewQuestion) {
    delete mongoose.models.InterviewQuestion;
}

const InterviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);

export default InterviewQuestion; 