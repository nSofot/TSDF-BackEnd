import BookReferences from "../models/bookReferences.js";

export const createBookReference = async (req, res) => {
    try {
        const bookReference = new BookReferences(req.body);
        await bookReference.save();
        res.json(bookReference);
    } catch (err) {
        console.error("Error saving book reference:", err);
        res.status(500).json({ message: "Server error while saving book reference" });
    }
};


export async function getBookReferenceByBookNoAndTransactionType(req, res) {
  const { trxBookNo, transactionType } = req.params;
  try {
    const exists = await BookReferences.exists({ transactionType, trxBookNo });
    res.json({ exists: !!exists }); // ✅ return boolean
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching transactions" });
  }
}
