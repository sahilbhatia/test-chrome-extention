let loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  console.log("Fetching list of users!")

  const usersData = await fetch("https://jsonplaceholder.typicode.com/users");
  const usersJson = await usersData?.json();

  chrome.storage.local.set({ users: usersJson }, () => {
    console.log("Users stored in local storage!", usersJson);

    // chrome.action.setPopup({ tabId: tab.id, popup: 'popup.html' }, () => {
      window.location.href = "/popup.html";
    // });
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      console.log("CS -> Login btn clicked!: ");
    }
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getContentScript
  });
});

const getContentScript = function() {
  console.log("inside content script!");

  const emailSelector = document.querySelectorAll("input[name='email']")?.[0];
  // const pwdSelector = document.querySelectorAll("input[name='password']")?.[0];

  console.log("Email: ", emailSelector?.value);
  // console.log("Password: ", pwdSelector?.value);
};
