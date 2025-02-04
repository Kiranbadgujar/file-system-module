const { body, check } = require("express-validator");

exports.registrationValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").trim().isEmail().withMessage("Invalid email address"),
  body("mobile").trim().isLength({ min: 10, max: 10 }).withMessage("Invalid mobile number"),
  body("password").trim().notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  // body("hobby").custom((value) => {
  //   const allowedHobbies = ["Tennis", "Football"];
  //   if (
  //     !Array.isArray(value) ||
  //     !value.every((hobby) => allowedHobbies.includes(hobby))
  //   ) {
  //     throw new Error("Please select valid hobbies (tennis and/or football)");
  //   }
  //   return true;
  // }),
  // body("hobby").trim().isIn(["tennis", "badminton","football"]).withMessage("Please select tennis badminton football"),
  body("gender").trim().isIn(["male", "female"]).withMessage("Please select male or female"),
  body("country").trim().isIn(["india", "usa", "japan"]).withMessage("Please select India, USA, or Japan"),
  // check("file").custom((value, { req }) => {
  //   if (req.file) {
  //     const allowedTypes = ["image/jpeg", "image/jpg"];
  //     if (!allowedTypes.includes(req.file.mimetype)) {
  //       throw new Error("Only .jpg and .jpeg file types are allowed");
  //     }
  //   }  
  //   return true; // If no file, no error is thrown
  // }),
];

exports.loginValidator = [
  body("email").trim().isEmail().withMessage("Invalid email address"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  body("password").trim().isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
];

// module.exports = {
//   registrationValidator,
//   loginValidator,
// };

// check('password', 'Password must be greater than 6 characters, and contains at least one uppercase letter, one lowercase letter, and one number, and one special character')
// .isStrongPassword({
//     minLength:6,
//     minUppercase:1,
//     minLowercase:1,
//     minNumbers:1
// }),

// check('image').custom( (value, {req}) => {
//   if(req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png'){
//       return true;
//   }
//   else{
//       return false;
//   }
// } ).withMessage("Please upload an image Jpeg, PNG")