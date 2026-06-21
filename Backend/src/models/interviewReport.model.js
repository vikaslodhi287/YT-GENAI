const mongoose = require("mongoose");

/**
 * - job description schema : String
 * - resume text : String
 * - Self description : String
 * 
 * - matchScore : Number
 * 
 * - Technical question :
 *         [{
 *           question : "",
 *          intention : "",
 *         answer : "";
 *          }]
 * - Behavioral questions : 
 *          [{
 *           question : "",
 *          intention : "",
 *         answer : "";
 *           }]
 * - Skill gaps: 
 *          [{
 *           skill : "",
 *          severity : "",
 *         type : String,
 *        enum : ["low", "medium", "high"]
 *           }]
 * - preparation plan : 
 *         [{
 *           day : Number,
 *          focus : String,
 *         task : [String]
 *           }]
 */
const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is requried"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false,
})
const interviewReportSchema = new mongoose.Schema({
    jobDescription:  {
        type: String,
        required: [true, "job description is required"]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchSconre: {
        type: Number,
        min: 0,
        max: 100,
    }
})