chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === "sendCardData") {
    const cardData = message.data;

    fetch("http://localhost:5173/add-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardData),
    })
      .then((response) => response.json())
      .then(() => {
        sendResponse({ status: "success" });
      })
      .catch(() => {
        sendResponse({ status: "error" });
      });

    return true; // Required for async sendResponse
  }
});
