let usersList = document.querySelector(".main-wrapper");

window.onload = readUsers();

const userURL = " https://random-data-api.com/api/v2/users?response_type=json";

async function getRandomUserImage() {
  let randomUserImage = null;
  try {
    const response = await fetch(userURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (!data || !data.avatar) {
      console.log("No avatar found in the API response");
      return randomUserImage; // Exit if no avatar is found
    }

    randomUserImage = data.avatar;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
  return randomUserImage;
}

function readUsers() {
  usersList.innerHTML = "";

  let masterUsers = localStorage.getItem("masterUsers");
  if (!masterUsers) {
    return;
  }
  let masterUsersUser = JSON.parse(masterUsers);

  masterUsersUser.forEach((user, i) => {
    let tempClass = "";
    if (user.temp === "Hot") {
      tempClass = "hot";
    } else if (user.temp === "Cold") {
      tempClass = "cold";
    } else {
      tempClass = "warm";
    }

    let elements = `
        <div class="user-card">
             <div class="user-image-wrapper"><img class="user-image" src=${user.image}></div>
            <div class="user-name">${user.first_name} ${user.last_name}</div>
            <div class="user-email">${user.email}</div>
            <div class="user-status">
              <div class="user-status-circle"></div>
              ${user.status}
              <i class="user-update" onclick="prepareStatusUpdate(${i})">
                <img class="user-update-icon" src="./icons8-pencil-48.png" alt="update user">
              </i>
            </div>
            <div class="user-temp-wrapper ${tempClass}">
              <div>${user.temp}</div>
              <i class="user-temp" onclick="prepareTempUpdate(${i})">
                <img class="user-temp-icon" src="./icons8-pencil-48.png" alt="update temp">
              </i>
            </div>
            <i class="user-delete" onclick="deleteUser(${i})">
                <img class="user-delete-icon" src="./delete.png" alt="delete user">
            </i>
        </div>
        `;
    usersList.innerHTML += elements;
  });
}

async function addUser(event) {
  event.preventDefault();

  let organizations = [];

  let userInputFirstName = document.querySelector(
    "#user-add-input-first"
  ).value;
  let userInputLastName = document.querySelector("#user-add-input-last").value;
  let userStatus = document.querySelector("#user-status-selection").value;
  let userTemp = document.querySelector("#user-temp-selection").value; // Define and assign userTemp
  let userEmail = document.querySelector("#user-email").value;

  let userImage = await getRandomUserImage();

  let userID = null;

  let newUser = {
    id: userID,
    first_name: userInputFirstName,
    last_name: userInputLastName,
    status: userStatus,
    email: userEmail,
    image: userImage,
    temp: userTemp,
  };

  let savedUsers = localStorage.getItem("masterUsers");
  // "[{name: 'xyz', property: 'abcd' }]"

  const savedUsersJSON = savedUsers ? JSON.parse(savedUsers) : [];
  savedUsersJSON.push(newUser);

  localStorage.setItem("masterUsers", JSON.stringify(savedUsersJSON));

  readUsers();
}

const userInputForm = document.querySelector("#user-add-form");
userInputForm.addEventListener("submit", addUser);

function deleteUser(index) {
  let savedUsers = localStorage.getItem("masterUsers");
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

  localStorage.setItem("masterUsers", JSON.stringify(arrayAfterDeletion));
  console.log(arrayAfterDeletion);

  readUsers();
}

function updateUserStatus(index, newStatus) {
  const savedUsers = localStorage.getItem("masterUsers");
  const usersArray = savedUsers ? JSON.parse(savedUsers) : [];

  if (!usersArray || usersArray.length <= index) {
    return;
  }
  // Update user status
  usersArray[index].status = newStatus;

  // Saving ...
  localStorage.setItem("masterUsers", JSON.stringify(usersArray));

  console.log("Updated user at index", index, ":", usersArray[index]);
  readUsers();
}
function updateUserTemp(index, newTemp) {
  const savedUsers = localStorage.getItem("masterUsers");
  const usersArray = savedUsers ? JSON.parse(savedUsers) : [];

  if (!usersArray || usersArray.length <= index) {
    return;
  }

  usersArray[index].temp = newTemp;

  // Saving ...
  localStorage.setItem("masterUsers", JSON.stringify(usersArray));
  readUsers();
}

function prepareStatusUpdate(index) {
  currentUserIndex = index; //set global index
  openUpdateModal();
}
function prepareTempUpdate(index) {
  currentUserIndex = index; //set global index
  openUserTempModal();
}

let currentUserIndex = null;

function setUserTemp(button) {
  const newTemp = button.getAttribute("data-temp");
  updateUserTemp(currentUserIndex, newTemp);
  closeUserTempModal();
}
function setStatus(button) {
  const newStatus = button.getAttribute("data-status");
  updateUserStatus(currentUserIndex, newStatus);
  closeModalAndUpdate();
}

function openAddUserModal() {
  document.querySelector("#user-add-form").style.display = "flex";
  document.querySelector(".main-wrapper").style.display = "none";
  document.querySelector("#menu-wrapper").style.display = "none";
}
function openUserTempModal() {
  document.querySelector("#user-temp-form").style.display = "flex";
  document.querySelector(".main-wrapper").style.display = "none";
  document.querySelector("#menu-wrapper").style.display = "none";
}

function closeUserTempModal() {
  document.querySelector("#user-temp-form").style.display = "none";
  document.querySelector(".main-wrapper").style.display = "grid";
  document.querySelector("#menu-wrapper").style.display = "flex";
}
function closeAddUserModal() {
  document.querySelector("#user-add-form").style.display = "none";
  document.querySelector(".main-wrapper").style.display = "grid";
  document.querySelector("#menu-wrapper").style.display = "block";
}

function openUpdateModal() {
  document.querySelector("#update-modal").style.display = "flex";
  document.querySelector(".main-wrapper").style.display = "none";
  document.querySelector("#menu-wrapper").style.display = "none";
}

function closeModalAndUpdate() {
  document.querySelector("#update-modal").style.display = "none";
  document.querySelector(".main-wrapper").style.display = "grid";
  document.querySelector("#menu-wrapper").style.display = "flex";
}
