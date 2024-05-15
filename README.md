This is the final api written by me and it contains all 3 BONUS POINTS in the assignment

It uses mongoose to connect to MongoDb database(TranFi_Learning, collection- students), nodemon, express 

This api stores the students  rollNumber, fullName, enrolledCourse ( enrolledOn: Date, courseCode: string, couseName: string), email,
address (street: string,  city : string,  state: string, + country: string, zipCode: number) and dateOfBirth 

db.js has function connectDb() for connecting MongoDB, Student.js has schema and student Model and server.js is the main file where all the /api resides

The Student Schema is as follows {rollNumber:{
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
									dateOfBirth: Date}

1.Adding a student
	It takes data {fullName,enrolledOn, courseName, courseCode...}= req.body, and generates coursecode from the first two alphabets of courseName (eg: for Mechanical Enginenenring 
	courseCode is 'ME') and generates rollNumber based on year, course in format TF22ME0001, and this rollNumber is incremental as asked in bonus part.
	
	Note: Giving courseCode based on courseName is compulsory in {req.body}
	
2.Listing all students
	I've used simple get request to list all the students 
	
3.Updating and Deleting 
	I've used two separate methods for updating and deleting.
		For updating I've used the unique id from mongoDB database
		For Deleting I've used rollNumber for deleting a particular student 
		
		It is to show both the methods can be applied

**BONUS points
	It contains all 3 BONUS points given in the assignmnet
	
4.For Paging and search
	I've modified the paging by using multiple queries i.e. it takes {page, limit, name} from req.query and shows no. of limits as per page (eg: page=2, limit=5 it shows page 2 with
	5 students list on it)
	As per name, if name="Ad", it lists all the students with names starting with "ad" and it is case insensitive here
	
5.For Csv 
	I've used a very basic logic for creating csv, and used res.header('content-type', 'txt/csv') for download
	
	
Once again I'm thankful for this opprtuinity given to me and I given more time I would have written a better code.
