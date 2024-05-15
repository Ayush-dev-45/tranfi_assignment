const mongoose= require('mongoose');

const StudentSchema= new mongoose.Schema({
    rollNumber:{
        type: String,
        unique: true
    },
    fullName: String,
    enrolledCourse: {
        enrolledOn: Date,
        courseCode: String,
        courseName: String
    },
    email: String,
    address:{
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: Number
    },
    dateOfBirth: Date

});


const StudentUser= new mongoose.model('students', StudentSchema);

module.exports = StudentUser;