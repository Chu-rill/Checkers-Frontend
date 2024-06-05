let reg_username = document.querySelector("#reg_username");
let reg_password = document.querySelector("#reg_password");

let button = document.querySelector("button");
console.log(button);

button.addEventListener("click", () => {
  window.location.href = "/pages/home.html";
  console.log(button);
});

//register user
const response = await fetch("localhost:3000/routes/registerUser", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: reg_username,
    password: reg_password,
  }),
});
const res = await response.json();
if (res.message === "Successful") {
  alert("User Created");
}
if (res.message === "User already exists") {
  alert("User already exists");
}
