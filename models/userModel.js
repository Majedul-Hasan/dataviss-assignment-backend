const crypto = require('crypto'); // crypto is a built-in Node module
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    username:{
        type : String,
        trim: true, //white space trimed out
        required: true,
        max: 32,
        unique:true,
        index: true, //make it indexing
        lowercase: true

    },
    firstName:{
        type : String,
        trim: true, //white space tremed out
        required: true,
        max: 32,
    },
    middleName:{
        type : String,
        max: 32,
    },
    lastName:{
        type : String,
        trim: true, //white space tremed out
        required: true,
        max: 32,
    },
    email:{
        type : String,
        trim: true,
        required: true,       
        unique:true,        
        lowercase: true

    },
    hashed_password :{
        type : String,       
        required: true 
    },
    salt:{
        type: String
    },
    role:{
        type: Number,
        default: 0 // 0 => user role, 1 => admin role

    },
    photo:{
        data: Buffer, // binary data type
        contentType: String
    }

},
{ timestamps: true })

userSchema.virtual('password')
    .set(function(password){
        // a temporary variable "_password" 
        this._password = password
        // generate salt
        this.salt = this.makeSalt()
        //encript password
        this.hashed_password = this.encryptPassword(password)   // set this hashed_password by #encryptPassword method
    })
    .get(function(){    //get method
        return this._password  
    })

// make salt && encryptPassword
userSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password

    },
        encryptPassword: function(password){
        if(!password) return ""
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')            
        } catch (err) {
            return ""
        }
    },
    makeSalt: function(){
        return Math.round(new Date().valueOf()*Math.random()) + "";
    }
}

const User = mongoose.model("User", userSchema);
export default User;