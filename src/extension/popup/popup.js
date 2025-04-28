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
      } else {
        alert("Error saving card.");
      }
    } catch (err) {
      alert("Network or server error.", err);
    }
  })();
});
