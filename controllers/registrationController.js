const fs = require("fs");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

// get user Data
exports.getRegistrationData = (req, res) => {
  fs.readFile("registrationData.json", (err, data) => {
    if (err) {
      console.log("Error registration data", err);
      return;
    }
    let jsonData = [];
    if (data) {
      jsonData = JSON.parse(data);
    }
    res.json(jsonData);
  });
};

// registration user
exports.handleRegistration = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {firstName,lastName,email,mobile,gender,country,password,} = req.body;
// console.log(req.body)
// console.log(hobby);

  // Generate unique ID for the user
  const userId = uuidv4();

  const registrationData = {
    id: userId,
    firstName,
    lastName,
    email,
    mobile,
    gender,
    country,
    // hobbies: hobby,  
    password,
    file: req.file ? `/uploads/${req.file.filename}` : null,
  };

  // Read the current registration data from the JSON file
  fs.readFile("registrationData.json", (err, data) => {
    let jsonData = [];
    if (!err && data) {
      jsonData = JSON.parse(data);
    }

    // Check if the email already exists
    const emailUser = jsonData.find((user) => user.email === email);
    if (emailUser) {
      return res.status(400).json({
        message: "Email already registered. Please try again with a different email.",
      });
    }

    // Check if the mobile number already exists
    const mobileUser = jsonData.find((user) => user.mobile === mobile);
    if (mobileUser) {
      return res.status(400).json({
        message: "Mobile number already registered. Please try again with a different number.",
      });
    }

    // If no existing user is found, proceed with registration
    jsonData.push(registrationData);

    // Write the updated data back to the JSON file
    fs.writeFile("registrationData.json", JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error saving registration data" });
      }
      // Respond with a success message
      res.status(200).json({ message: "Registration successful!" });
    });
  });
};

// Login user
exports.handleLogin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  fs.readFile("registrationData.json", (err, data) => {
    if (err) {
      console.log("Error reading file", err);
      return res.status(500).json({ message: "Error reading user data" });
    }
    let jsonData = [];
    if (data) {
      jsonData = JSON.parse(data);
    }
    // Find the user with the given email
    const existingUser = jsonData.find((user) => user.email === email);
    if (!existingUser) {
      return res.status(400).json({
        message: "Email not found. Please register first.",
      });
    }
    // Compare the password
    if (password !== existingUser.password) {
      return res
        .status(400)
        .json({ message: "Incorrect password. Please try again." });
    }
    return res.status(200).json({
      message: "Login successful!",
    });
  });
};

// delete  user
exports.handledelete = (req, res) => {
  const { userId } = req.params;

  fs.readFile("registrationData.json", (err, data) => {
    if (err) {
      // console.log("Error reading registration data", err);
      return res
        .status(500)
        .json({ message: "Error reading registration data" });
    }
    let jsonData = [];
    if (data) {
      jsonData = JSON.parse(data);
    }

    // Filter method is used to delete
    const updatedData = jsonData.filter((data) => data.id !== userId);
    fs.writeFile(
      "registrationData.json",
      JSON.stringify(updatedData, null, 2),
      (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error saving updated registration data" });
        }
        // Respond with a success message
        res.status(200).json({ message: "User deleted successfully" });
      }
    );
  });
};

// get userid for update
exports.getUserId = (req, res) => {
  const userId = req.params.id;
  // console.log(userId)
  fs.readFile("registrationData.json", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading data" });

    const jsonData = JSON.parse(data);
    const user = jsonData.find((u) => u.id === userId);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
};

// update user
exports.handleUpdate = (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    email,
    mobile,
    gender,
    country,
    hobby,
    password,
  } = req.body;

  fs.readFile("registrationData.json", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error reading registration data." });
    }
    let jsonData = JSON.parse(data);

    // Find the user by userId
    const userIndex = jsonData.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user data
    jsonData[userIndex] = {
      ...jsonData[userIndex],
      firstName,
      lastName,
      email,
      mobile,
      gender,
      country,
      hobbies: Array.isArray(hobby) ? hobby : [hobby],
      password,
      file: req.file
        ? `/uploads/${req.file.filename}`
        : jsonData[userIndex].file, // Retain old file if no new file
    };

    // Write the updated data back to the JSON file
    fs.writeFile(
      "registrationData.json",
      JSON.stringify(jsonData, null, 2),
      (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error saving updated data." });
        }
        res.status(200).json({ message: "User updated successfully!" });
      }
    );
  });
};
