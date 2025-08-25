import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },   
    firstname: { 
        type: String, 
        required: true 
    },
    lastname: { 
        type: String, 
        required: true 
    },
    mobile: { 
        type: String,  
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true, 
    },
    isActive: { 
        type: Boolean, 
        required: true, 
        default: true
    },
    image: { 
        type: String,  
    },
    dateOfBirth: { 
        type: Date,  
    },
}, { timestamps: true }); // 👈 Adds createdAt and updatedAt automatically


const User = mongoose.model("User", userSchema);

export default User;