let logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.storage.local.set({ token: null }, () => {
    console.log("Secret token removed from local storage!");
  });

  chrome.storage.local.get(["token"], (result) => {
    console.log("Secret token: ", result);
    chrome.action.setPopup({ tabId: tab.id, popup: 'login.html' }, () => {
      window.location.href = "/login.html";
    });
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      console.log("CS -> Logout btn clicked!: ");
    }
  });
});
