const API_KEY = "154f52ad"; // Replace with your OMDb API key

document.querySelector("button").onclick = () => {
  const title = document.getElementById("movieTitle").value.trim();
  const year = document.getElementById("year").value.trim();
  const rating = parseFloat(document.getElementById("rating").value.trim());

  if (!title) {
    alert("Please enter a movie title.");
    return;
  }

  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        const imdbRating = parseFloat(data.imdbRating);
        if (year && data.Year !== year) {
          alert(`Found "${title}" but it doesn't match year ${year}.`);
          return;
        }
        if (!isNaN(rating) && imdbRating < rating) {
          alert(`Found "${title}" but its rating ${imdbRating} is below ${rating}.`);
          return;
        }

        document.getElementById("results").innerHTML = `
          <h3>${data.Title} (${data.Year})</h3>
          <p><strong>Genre:</strong> ${data.Genre}</p>
          <p><strong>Director:</strong> ${data.Director}</p>
          <p><strong>Rating:</strong> ${data.imdbRating}</p>
          <p>${data.Plot}</p>
        `;

        // Save to local storage
        const history = JSON.parse(localStorage.getItem("movieHistory") || "[]");
        history.push([data.Title, data.Year, data.Genre, data.Director, data.imdbRating]);
        localStorage.setItem("movieHistory", JSON.stringify(history));
        renderHistory();
      } else {
        document.getElementById("results").innerText = "❌ Movie not found!";
      }
    });
};

document.getElementById("genre").onchange = () => {
  const genre = document.getElementById("genre").value;
  const genres = {
    "Action": ["John Wick", "Mad Max: Fury Road", "Die Hard"],
    "Sci-Fi": ["Interstellar", "Inception", "Blade Runner 2049"],
    "Drama": ["Forrest Gump", "The Godfather", "Shawshank Redemption"],
    "Comedy": ["Superbad", "The Hangover", "The Grand Budapest Hotel"]
  };
  if (genres[genre]) {
    const randomTitle = genres[genre][Math.floor(Math.random() * genres[genre].length)];
    document.getElementById("movieTitle").value = randomTitle;
  }
};

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("movieHistory") || "[]");
  const ul = document.getElementById("history");
  ul.innerHTML = "";
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry.join(" | ");
    ul.appendChild(li);
  });
}

document.getElementById("downloadCsv").onclick = () => {
  const history = JSON.parse(localStorage.getItem("movieHistory") || "[]");
  if (history.length === 0) {
    alert("No search history to download.");
    return;
  }

  let csvContent = "Title,Year,Genre,Director,Rating\n" + history.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "movie_search_history.csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.onload = renderHistory;
