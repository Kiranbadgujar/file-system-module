// form validation
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Clear previous error message
    document.getElementById("error-message").style.display = "none";

    // Validate form fields
    const form = this;
    let valid = true;

    // Validate First Name
    const firstName = form.querySelector('[name="firstName"]');
    // console.log(firstName);
    if (!firstName.value.trim()) {
      valid = false;
      firstName.classList.add("is-invalid");
    } else {
      firstName.classList.remove("is-invalid");
    }

    // Validate Last Name
    const lastName = form.querySelector('[name="lastName"]');
    if (!lastName.value.trim()) {
      valid = false;
      lastName.classList.add("is-invalid");
    } else {
      lastName.classList.remove("is-invalid");
    }

    // Validate Email
    const email = form.querySelector('[name="email"]');
    const emailPattern =
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.value.trim() || !emailPattern.test(email.value)) {
      valid = false;
      email.classList.add("is-invalid");
    } else {
      email.classList.remove("is-invalid");
    }

    // Validate Mobile Number
    const mobile = form.querySelector('[name="mobile"]');
    if (
      !mobile.value.trim() ||
      isNaN(mobile.value) ||
      mobile.value.length < 10
    ) {
      valid = false;
      mobile.classList.add("is-invalid");
    } else {
      mobile.classList.remove("is-invalid");
    }

    // Validate Gender
    const gender = form.querySelector('[name="gender"]:checked');
    if (!gender) {
      valid = false;
      const genderRadios = form.querySelectorAll('[name="gender"]');
      genderRadios.forEach((radio) => {
        radio.classList.add("is-invalid");
      });
    } else {
      const genderRadios = form.querySelectorAll('[name="gender"]');
      genderRadios.forEach((radio) => {
        radio.classList.remove("is-invalid");
      });
    }

    // Validate Country Selection
    const country = form.querySelector('[name="country"]');
    if (!country.value) {
      valid = false;
      country.classList.add("is-invalid");
    } else {
      country.classList.remove("is-invalid");
    }

    // Validate Hobby Selection
    // const hobby = form.querySelector('[name="hobby"]:checked');
    // if (!hobby) {
    //   valid = false;
    //   const hobbyRadios = form.querySelectorAll('[name="hobby"]');
    //   hobbyRadios.forEach((radio) => {
    //     radio.classList.add("is-invalid");
    //   });
    // } else {
    //   const hobbyRadios = form.querySelectorAll('[name="hobby"]');
    //   hobbyRadios.forEach((radio) => {
    //     radio.classList.remove("is-invalid");
    //   });
    // }

    // Validate Image Upload
    const file = form.querySelector('[name="file"]');
    if (file && file.files.length === 0) {
      valid = false;
      file.classList.add("is-invalid");
    } else {
      file.classList.remove("is-invalid");
    }

    // Validate Password
    const password = form.querySelector('[name="password"]');
    if (!password.value.trim() || password.value.length < 6) {
      valid = false;
      password.classList.add("is-invalid");
    } else {
      password.classList.remove("is-invalid");
    }

    // Validate Terms and Conditions checkbox
    const terms = form.querySelector('[name="terms"]');
    if (!terms.checked) {
      valid = false;
      terms.classList.add("is-invalid");
    } else {
      terms.classList.remove("is-invalid");
    }

    // If validation is successful, submit the form
    if (valid) {
      // console.log(form);
      const formData = new FormData(form);
      // console.log(formData);
      fetch("/register", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          if (data.message) {
            if (data.message === "Registration successful!") {
              alert("Registration successful!");
              form.reset();
            } else {
              alert(data.message);
            }
          } else if (data.errors) {
            console.error(data.errors);
            document.getElementById("error-message").style.display =
              "block";
            document.getElementById("error-message").innerText =
              "Please fix the validation errors.";
          }
        })
        .catch((error) => {
          console.error("Error during registration:", error);
          document.getElementById("error-message").style.display =
            "block";
          document.getElementById("error-message").innerText =
            "An error occurred. Please try again.";
        });
    }
  });

// Remove validation error classes on input changes
document
  .querySelectorAll("input, select, textarea")
  .forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      this.classList.remove("is-invalid");
    });
  });

// mobile number to 10 digits
document
  .querySelector('[name="mobile"]')
  .addEventListener("input", function (e) {
    const maxLength = 10;
    if (this.value.length > maxLength) {
      this.value = this.value.slice(0, maxLength);
    }
  });
