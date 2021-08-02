import { log } from "./utils.mjs";

let logoutBtn = document.getElementById("logout-btn");
let inputTxt = document.getElementById("input-text");

logoutBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  log(
    "inside logoutBtnClickListener: ",
    (inputTxt.value = "updated value")
  );

  // chrome.storage.local.get(["users"], users => {
  //   chrome.action.setPopup({ tabId: tab.id, popup: 'login.html' }, () => {
  //     window.location.href = "/login.html";
  //   });
  // });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      console.log("CS -> Logout btn clicked!: ");
    }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      console.log("Running in context of actual page!");

      const emailSelector = document.querySelectorAll(
        "input[name='email']"
      )?.[0];

      chrome.runtime.sendMessage(
        { email: emailSelector?.value },
        function (response) {
          console.log(response.msg);
        }
      );
    }
  });

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log(
      sender.tab
        ? "from a content script:" + sender.tab.url
        : "from the extension"
    );

    const email = request.email;

    if (email) {
      sendResponse({ msg: `Email found to be: ${email}` });
    } else {
      sendResponse({ msg: "Email not found!" });
    }

    const pTag = document.createElement("p");
    pTag.innerHTML = `<b>Email:</b> ${email}`;

    document.body.prepend(pTag);
  });
});
