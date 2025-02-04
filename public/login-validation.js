document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const form = this;
    let valid = true;

    // Validate Email
    const email = form.querySelector('[name="email"]');
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.value.trim() || !emailPattern.test(email.value)) {
      valid = false;
      email.classList.add("is-invalid");
    } else {
      email.classList.remove("is-invalid");
    }

    // Validate Password
    const password = form.querySelector('[name="password"]');
    if (!password.value.trim() || password.value.length < 6) {
      valid = false;
      password.classList.add("is-invalid");
    } else {
      password.classList.remove("is-invalid");
    }

    if (!valid) {
      return; // Stop further processing if validation failed
    }

    const emailValue = email.value;
    const passwordValue = password.value;
    // console.log(emailValue);
    // console.log(passwordValue);

    // Send login using Fetch API
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue,
      }),
    })
      .then((response) => {
        // console.log("Server ok response:", response);
        return response.json();
      })
      .then((data) => {
        console.log("Server data:", data);
        if (data.message === "Login successful!") {
          alert("login sucess");
          window.location.href = "dashboard.html";
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent = "An error occurred. Please try again later.";
        errorMessage.style.display = "block";
        console.error("Error during login request:", error);
      });
  });
