// Set up the extension's popup page
document.getElementById("add-card-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const cardData = {
    front: document.getElementById("front").value,
    back: document.getElementById("back").value,
    hint: document.getElementById("hint")?.value,
    tags: document
      .getElementById("tags")
      ?.value.split(",")
      .map((tag) => tag.trim()),
  };

  (async () => {
    try {
      const response = await fetch("http://localhost:4000/add-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
      });

      const data = await response.json();

      if (data.status === "ok") {
        alert("Card saved successfully.");

        document.getElementById("add-card-form").reset();
      } else {
        alert("Error saving card.");
      }
    } catch (err) {
      alert("Network or server error.", err);
    }
  })();
});

document
  .getElementById("start-flashcards-btn")
  .addEventListener("click", () => {
    // If in development mode, open localhost for always-fresh build
    const devUrl = "http://localhost:5173/";
    
    fetch(devUrl, { method: "HEAD" })
      .then(() => {
        // Localhost is running → use it
        chrome.tabs.create({ url: devUrl });
      })
      .catch(() => {
        // Localhost not running → fallback to packaged flashcards.html
        const packagedUrl = chrome.runtime.getURL("flashcards/flashcards.html");
        chrome.tabs.create({ url: packagedUrl });
      });
  });
