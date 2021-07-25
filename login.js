let loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.storage.local.set({ token: "secret-token" }, () => {
    console.log("Secret token stored in local storage!");
  });

  chrome.storage.local.get(["token"], (result) => {
    console.log("Secret token: ", result);
    chrome.action.setPopup({ tabId: tab.id, popup: 'popup.html' }, () => {
      window.location.href = "/popup.html";
    });
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
  const pwdSelector = document.querySelectorAll("input[name='password']")?.[0];

  console.log("Email: ", emailSelector?.value);
  console.log("Password: ", pwdSelector?.value);
};
