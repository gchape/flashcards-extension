document.getElementById("add-card-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const cardData = {
    front: document.getElementById("front").value,
    back: document.getElementById("back").value,
    hint: document.getElementById("hint").value,
    tags: document
      .getElementById("tags")
      .value.split(",")
      .map((tag) => tag.trim()),
  };

  chrome.runtime.sendMessage(
    {
      action: "sendCardData",
      data: cardData,
    },
    (response) => {
      if (response.status === "success") {
        alert("Card added!");
        document.getElementById("add-card-form").reset();
      } else {
        alert("Failed to add card!");
      }
    }
  );
});
