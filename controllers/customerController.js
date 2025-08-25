import Customer from "../models/customer.js";
import { isAdmin } from "./userController.js";


export async function CreateCustomer(req, res) {
    // if (!isAdmin(req)) {
    //     return res.status(403).json({
    //         message: "You are not authorized to add customer",
    //     });
    // }

    let customerId = "CUS-0001";

    try {
        const lastCustomer = await Customer.find().sort({ createdAt: -1 }).limit(1);
        if (lastCustomer.length > 0) {
            const lastId = parseInt(lastCustomer[0].customerId.replace("CUS-", ""));
            customerId = "CUS-" + String(lastId + 1).padStart(4, "0");
        }
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch last customer", error: err.message });
    }

    req.body.customerId = customerId;
    req.body.createdAt = new Date(); 

    const customer = new Customer(req.body);

    try {
        await customer.save();
        res.json({ message: "Customer added" });
    } catch (error) {
        console.error("Error saving customer:", error);
        res.status(500).json({
            message: "Customer not added",
            error: error.message,
        });
    }
}


export async function getCustomer(req,res) {

    try{
        if(isAdmin(req)){
            const customers = await Customer.find()
            res.json(customers)
        }
        else{
            const customers = await Customer.find({isActive : true})
            res.json(customers)
        }

    }
    catch(err){
        res.status(500).json({
            message : "Error getting customers",
            error: err
        })
    }
}


export async function getCustomerById(req, res) {
    const customerId = req.params.customerId

    try{
        const customer = await Customer.findOne({customerId : customerId})
        if (customer == null) {
            res.status(404).json({
                message : "Customer not found"
            })
            return
        }

        if(customer.isActive == true){
            res.json(customer)
        }
        else{
            if(!isAdmin(req)){
                res.status(404).json({
                message : "Customer not found"
            })
            return
            }
            else{
                res.json(customer)
            }                
        }
    }

    catch(err){
        res.status(500).json({
            message : "Error getting customer",
            error: err
        })
    }
}



export async function deleteCustomer(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "You are not authorized to delete customer"
        });
        return;
    }

    try {
        const result = await Customer.deleteOne({ customerId: req.params.customerId });

        if (result.deletedCount === 0) {
            // No customer found with that ID
            res.status(404).json({
                message: "Customer not found"
            });
            return;
        }

        res.json({
            message: "Customer deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete customer",
            error: err.message || err
        });
    }
}



export async function updateCustomer(req, res) {
    // if (!isAdmin(req)) {
    //     res.status(403).json({
    //         message: "You are not authorized to update customer"
    //     });
    //     return;
    // }

    const customerId = req.params.customerId;
    const updatingData = req.body;

    try {
        const result = await Customer.updateOne({ customerId: customerId }, updatingData);

        if (result.matchedCount === 0) {
            // No customer found with that ID
            res.status(404).json({
                message: "Customer not found"
            });
            return;
        }

        res.json({
            message: "Customer updated successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to update customer",
            error: err.message || err
        });
    }
}


export async function searchCustomers(req, res) {
	const searchQuery = req.query.query || "";

	try {
		const regex = { $regex: searchQuery, $options: "i" };

		const filter = {
			isActive: true,
			...(searchQuery.trim() !== "" && {
				$or: [
					{ name: regex },
                    { address: regex },
                    { mobile: regex },
					{ vehicleNumbers: { $elemMatch: regex } }
				]
			})
		};

		const customers = await Customer.find(filter);
		res.json(customers);
	} catch (err) {
		res.status(500).json({
			message: "Error searching customers",
			error: err
		});
	}
}


export async function addCustomerBalance(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({ message: "Not authorized" });
    }

    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({ message: "updates array is required" });
    }

    try {
        const updatePromises = updates.map(({ customerId, amount }) => {
            if (typeof amount !== 'number') {
                throw new Error(`Invalid amount for customerId ${customerId}`);
            }

            return Customer.updateOne(
                { customerId },
                {
                    $inc: { balance: Math.abs(amount) }, // assuming positive increment
                    $set: { updatedAt: new Date() },
                }
            );
        });

        await Promise.all(updatePromises);

        res.json({ message: "Customer balances added successfully" });
    } catch (err) {
        console.error("Bulk addition failed:", err);
        res.status(500).json({
            message: "Failed to add customer balance",
            error: err.message || err,
        });
    }
}


export async function subtractCustomerBalance(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({ message: "Not authorized" });
    }

    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({ message: "updates array is required" });
    }

    try {
        const updatePromises = updates.map(({ customerId, amount }) => {
            if (!customerId || typeof amount !== 'number') {
                throw new Error(`Invalid data for customerId: ${customerId}`);
            }

            return Customer.updateOne(
                { customerId },
                {
                    $inc: { balance: -Math.abs(amount) }, // subtracting as negative increment
                    $set: { updatedAt: new Date() },
                }
            );
        });

        await Promise.all(updatePromises);

        res.json({ message: "Customer balances subtracted successfully" });
    } catch (err) {
        console.error("Balance subtraction failed:", err);
        res.status(500).json({
            message: "Failed to subtract customer balance",
            error: err.message || err,
        });
    }
}


