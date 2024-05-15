const express= require('express');
const fs= require('fs');
const path= require('path');
const connection= require('./dataBase/db');
const StudentUser= require('./dataBase/student');

const app= express();
const port= 8000;

app.use(express.json());   

connection.connectDB(); 

//Adding New Students
app.post('/api/student/add', async(req,res)=>{
    try{
        const {fullName, enrolledCourse, email, address, dateOfBirth} = req.body;

        //Generating roll number 

        const collegeCode= 'TF';
        const courseCode= enrolledCourse.courseName.substring(0,2).toUpperCase();
        const enrolledDate=new Date(enrolledCourse.enrolledOn);
        const year= enrolledDate.getFullYear().toString().substring(2);

        const lastStudentArray= await StudentUser.find({"enrolledCourse.courseCode": courseCode,
            'rollNumber': { $regex: '^' + collegeCode + year + courseCode }}).sort({rollNumber:-1}).limit(1);
        
        //console.log(lastStudentArray);

        let lastRoll= 0;
        if(lastStudentArray.length >=1){
            const lastStudent= lastStudentArray[0];
            console.log(lastStudent);
            console.log(lastStudent.rollNumber);
            const lastRollNumber= lastStudent.rollNumber;

            lastRoll= parseInt(lastRollNumber.substr(-4));
        }

        //console.log(lastCode);

        const nextRoll= lastRoll + 1;
        const rollNumber= collegeCode + year+ courseCode + nextRoll.toString().padStart(4,'0');
        console.log(rollNumber);
        
        const newStudent= new StudentUser({rollNumber, fullName, enrolledCourse, email, address, dateOfBirth});
        await newStudent.save(); 
        res.status(201).json({newStudent, msg:"New student added!!!"});
    } 
    catch(err){
        console.log(err);
        res.status(501).json({err:"Internal Server Error"});
    }  
}); 


// Listing all Students
app.get('/api/student', async(req,res)=>{
    try{
        const students= await StudentUser.find().sort({rollNumber:-1});

        res.status(201).json(students);
    }
    catch(err){
        console.log(err);
        res.status(501).json({err:"Internal Server Error"});
    }
});


//Updating the student record using id from database
app.put('/api/student/update/:id', async(req,res)=>{
    try{
        const {id}= req.params;
        const {fullName, email, address, dateOfBirth}= req.body;

        const updatedStudent= await StudentUser.findByIdAndUpdate(id, {fullName, email, address, dateOfBirth});
        res.status(201).json({updatedStudent, msg:"Information Updated"});

    }
    catch(err){
        console.log(err);
        res.status(501).json({err:"Internal Server Error"});
    }
})

//Deleting a student using roll number  
app.delete('/api/student/delete/:roll', async(req,res)=>{
    try{
        const {roll}= req.params;
        const student= await StudentUser.findOne({rollNumber: roll});

        await StudentUser.deleteOne(student);

        res.status(201).json({roll,msg:'Deleted'});

    }
    catch(err){
        console.log(err);
        res.status(501).json({err:"Internal Server Error"});
    }
});

//api for paging students with name starting with query including {name, page, limit}

app.get('/api/student/page', async(req,res)=>{
    try{
        let {page, limit, name}= req.query;

        page= parseInt(page) || 1;
        limit= parseInt(limit) || 10;

        //console.log(page, limit);
        let filter={};
        if(name){
            filter=name;
        }
        const skip= (page-1)* limit;
        const students= await StudentUser.find({fullName: {$regex: '^'+filter, $options: 'i'}}).skip(skip).limit(limit);
        
        res.status(201).json(students);
    }
    catch(err){
        console.log(err);
        res.status(501).json({err:"Internal Server Error"});
    }
});


//api for downloading the students data through csv file
app.get('/api/student/download', async(req,res)=>{
    try{
        const students= await StudentUser.find();
        
        const coloumns= ['rollNumber','fullName','enrolledCourseOn','enrolledCourseCode','enrolledCourseName','email','address','dateOfBirth'];

        let studentCsv= coloumns.join(',')+'\n';

        students.forEach(element => {
            const row=[element.rollNumber,
                element.fullName,
                `${element.enrolledCourse.enrolledOn}`,
                `${element.enrolledCourse.courseCode}`,
                `${element.enrolledCourse.courseName}`,
                element.email,
                `${element.address.street},${element.address.city},${element.address.state},${element.address.country},${element.address.zipCode}`,
                element.dateOfBirth
            ];
            studentCsv += row.map(field =>`"${field}"`).join(',')+'\n';
        }
    );
    res.setHeader('Content-Type', 'text/csv');
    res.send(studentCsv);
    }
    catch(err){
        console.log(err);
        res.status(501).json({err:"Internal Server Error"});
    }
});


app.listen(8000);