import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
    score: {
        type: Number,
        min: 0,
        max: 10
    },
    feedback: String,
    suggestions: [String],
    strongPoints: [String],
    missedConcepts: [String],
    overallEvaluation: String
}, { _id: false });

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        trim: true
    },
    evaluation: {
        type: evaluationSchema,
        default: null
    },
    idealAnswer: {
        type: String,
        trim: true
    },
    keyPoints: [{
        type: String,
        trim: true
    }],
    expectedDuration: {
        type: Number
    },
    followUpQuestions: [{
        type: String,
        trim: true
    }],
    skillsTested: [{
        type: String,
        trim: true
    }],
    score: {
        type: Number,
        min: 0,
        max: 10
    },
    status: {
        type: String,
        enum: ['pending', 'answered', 'reviewed'],
        default: 'pending'
    }
}, { _id: false });

// Define the main schema
const interviewPracticeSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        default: function() {
            return `${this.role} ${this.level} ${this.category} Interview`;
        }
    },
    field: {
        type: String,
        required: true
    },
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
    difficulty: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    questions: [questionSchema],
    status: {
        type: String,
        enum: ['draft', 'in_progress', 'completed'],
        default: 'draft'
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    totalScore: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    notes: {
        type: String,
        trim: true
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Kiểm tra và xóa model cũ nếu tồn tại
if (mongoose.models.InterviewPractice) {
    delete mongoose.models.InterviewPractice;
}

// Tạo model mới
const InterviewPractice = mongoose.model('InterviewPractice', interviewPracticeSchema);

export default InterviewPractice;