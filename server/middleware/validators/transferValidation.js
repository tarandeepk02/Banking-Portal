const transactionValidator = (req, res, next) => {
    const { amount, type, email } = req.body;
  
    // Step 1: Check if amount is provided and greater than 10 dolas 
    if (!amount || amount <= 10) {
      return res.status(400).json({ message: "Amount must be greater than 10$" });
    }
  
   
    if (type === "external" && (!email || email === "")) {
      return res.status(400).json({ message: "Email is required for external transactions!" });
    }
    next();
  };
  export default transactionValidator