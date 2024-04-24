let usersList = document.querySelector(".main-wrapper");

window.onload = readUsers();

// const URL = " https://random-data-api.com/api/v2/users?response_type=json";

// async function getRandomUser() {
//   try {
//     const response = await fetch(URL);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();

//     if (!data || !data.avatar) {
//       console.log("No avatar found in the API response");
//       return; // Exit if no avatar is found
//     }

//     localStorage.setItem("userImage", data.avatar); // Store the fetched image in local storage
//     readUsers(); // Update the display using the new image
//   } catch (error) {
//     console.error("Failed to fetch user data:", error);
//   }
// }

function readUsers() {
  usersList.innerHTML = "";

  let object = localStorage.getItem("object");
  if (!object) {
    return;
  }
  let objectUser = JSON.parse(object);
  let userImage = localStorage.getItem("userImage"); // Retrieve the image from local storage

  objectUser.forEach((user, i) => {
    let elements = `
        <div class="user-card">
             <div class="user-image"><img src=${user.image || userImage}></div>
            <div class="user-name">${user.first_name} ${user.last_name}</div>
            <div class="user-email">${user.email}</div>
            <div class="user-status">
              <div class="user-status-circle"></div>
              ${user.status}
            </div>
            <i class="user-delete" onclick="deleteUser(${i})">
                <img class="user-delete-icon" src="./delete.png" alt="delete user">
            </i>
        </div>
        `;
    usersList.innerHTML += elements;
  });
}

function deleteUser(index) {
  let savedUsers = localStorage.getItem("object");
  const savedUsersJSON = savedUsers ? JSON.parse(savedUsers) : [];

  if (!savedUsersJSON) {
    return;
  }
  // This is deleting...
  const arrayAfterDeletion = savedUsersJSON.filter((element, i) => {
    if (i != index) {
      return element;
    }
  });
  // Deleting is done

  localStorage.setItem("object", JSON.stringify(arrayAfterDeletion));
  console.log(arrayAfterDeletion);

  readUsers();
}

function addUser(event) {
  let userInputFirstName = document.querySelector(
    "#user-add-input-first"
  ).value;
  let userInputLastName = document.querySelector("#user-add-input-last").value;
  let userStatus = document.querySelector("#user-status-selection").value;
  let userEmail = document.querySelector("#user-email").value;
  let userImage = localStorage.getItem("userImage"); // Use the image from local storage

  let newUser = {
    first_name: userInputFirstName,
    last_name: userInputLastName,
    status: userStatus,
    email: userEmail,
    image: userImage,
  };
  // users.push(newUser);
  let savedUsers = localStorage.getItem("object");
  // "[{name: 'xyz', property: 'abcd' }]"

  const savedUsersJSON = savedUsers ? JSON.parse(savedUsers) : [];
  savedUsersJSON.push(newUser);

  localStorage.setItem("object", JSON.stringify(savedUsersJSON));

  readUsers();
}

const userInputForm = document.querySelector("#user-add-form");
userInputForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addUser();
  // console.log(users);
});
