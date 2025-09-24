import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        unique: true
    },
    customerType: {
        type: String,
        required: true,
        default: 'shareholder',
        enum: ['shareholder', 'external']
    },
    title: {
        type: String,
        enum: ['Mr.', 'Mrs.', 'Ms.']
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    email: {
        type: String
    },
    image: [
        {type: String}
    ],
    joinDate: {
        type: Date
    },
    shares: {
        type: Number,
        default: 0
    },
    profits: {
        type: Number,
        default: 0
    },
    membership: {
        type: Number,
        default: 0
    },
    holdAmount: {
        type: Number,
        default: 0
    },
    birthDate: {
        type: Date,
    },
    notes: {
        type: String
    },
    memberRole: {
        type: String,
        enum: ['member', 'manager', 'chairman', 'secretary', 'treasurer', 'admin'],
        default: 'member'
    },
    password: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;