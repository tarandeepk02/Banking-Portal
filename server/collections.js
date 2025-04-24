const setupCollection = (database) => {
   
    let userCollection = database.createCollection('users', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["userId", "firstName", "lastName", "email", "password", "phoneNumber", "role", "isActive", "accounts"],
                properties: {
                    userId: {
                        bsonType: "string",
                        description: "User ID must be a string."
                    },
                    firstName: {
                        bsonType: "string",
                        minLength: 1,
                        maxLength: 255,
                        description: "First name must be a string between 1 and 255 characters."
                    },
                    lastName: {
                        bsonType: "string",
                        minLength: 1,
                        maxLength: 255,
                        description: "Last name must be a string between 1 and 255 characters."
                    },
                    email: {
                        bsonType: "string",
                        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                        description: "Email must be a valid email address."
                    },
                    password: {
                        bsonType: "string",
                        minLength: 8,
                        description: "Password must be a string with at least 8 characters."
                    },
                    phoneNumber: {
                        bsonType: "string",
                        pattern: "^[0-9]{10}$",
                        description: "Phone number must be a 10-digit number."
                    },
                    role: {
                        bsonType: "string",
                        enum: ["user", "admin"],
                        description: "Role must be either 'user' or 'admin'."
                    },
                    isActive: {
                        bsonType: "bool",
                        description: "isActive must be a boolean."
                    },
                    accounts: {
                        bsonType: "array",
                        minItems: 1,
                        items: {
                            bsonType: "object",
                            required: ["accountNumber", "accountType", "amount"],
                            properties: {
                                accountNumber: {
                                    bsonType: "string", // or "long" if applicable. String is safest.
                                    description: "Account number must be a string."
                                },
                                accountType: {
                                    bsonType: "string",
                                    enum: ["Savings", "Checking"],
                                    description: "Account type must be either 'Savings' or 'Checking'."
                                },
                                amount: {
                                    bsonType: "int",
                                    minimum: 0,
                                    description: "Amount must be a positive number."
                                }
                            }
                        },
                        description: "Accounts must be an array of account objects with accountNumber, accountType, and amount."
                    }
                }
            }
        }
    });
    
    let transactionLogCollection = database.createCollection('transactionLog', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["userId", "transactionId", "date", "type", "amount", "status", "reason"],
                properties: {
                    userId: {
                        bsonType: "string",
                        description: "UserId must be a string representing the user."
                    },
                    transactionId: {
                        bsonType: "string",
                        description: "TransactionId must be a unique string."
                    },
                    date: {
                        bsonType: "date",
                        description: "Date must be a valid date."
                    },
                    type: {
                        bsonType: "string",
                        enum: ["external", "internal"],
                        description: "Type must be either 'external' or 'internal'."
                    },
                    amount: {
                        bsonType: "int",
                        description: "Amount must be a number."
                    },
                    status: {
                        bsonType: "string",
                        enum: ["success", "failed", "pending"], // Added enum constraint here
                        description: "Status must be one of 'success', 'failed', or 'pending'."
                    },
                    reason: {
                        bsonType: "string",
                        description: "Reason message of transaction, success or what is the error."
                    }
                }
            }
        }
    });


    return( userCollection ,transactionLogCollection)
};
export default setupCollection
