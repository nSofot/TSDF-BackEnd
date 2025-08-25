import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        unique: true
    },
    // customerType: {
    //     type: String,
    //     required: true,
    //     enum: ['shareholder', 'external']
    // },
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
    shares: {
        type: Number,
        default: 0
    },
    loanDaily: {
        type: Number,
        default: 0
    },
    loanWelfare: {
        type: Number,
        default: 0
    },
    loanShortTerm: {
        type: Number,
        default: 0
    },
    loanLongTerm: {
        type: Number,
        default: 0
    },
    loanProject: {
        type: Number,
        default: 0
    },
    birthDate: {
        type: Date,
    },
    notes: {
        type: String
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