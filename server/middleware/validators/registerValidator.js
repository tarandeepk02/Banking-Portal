const registerValidtor = (req, res, next) => {
    const { email, firstName, lastName, password, phoneNumber } = req.body;


    if (email === "" || firstName === "" ||lastName === "" ||password === "" || phoneNumber === ""
    ) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if first name and last name are of valid length (between 2 and 30 characters)
    if (firstName.length < 2 || firstName.length > 30) {
        return res.status(400).json({ message: "First name must be between 2 and 30 characters!" });
    }

    if (lastName.length < 2 || lastName.length > 30) {
        return res.status(400).json({ message: "Last name must be between 2 and 30 characters!" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long!" });
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
        return res.status(400).json({ message: "Phone number must be exactly 10 digits!" });
    }
    next();
};

export default registerValidtor; 