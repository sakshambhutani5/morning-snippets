async function fetchLatestSnippet() {
    try {
        const response = await fetch(`https://gnews.io/api/v4/search?q=Artificial+Intelligence&lang=en&token=${API_KEY}`);
        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            throw new Error("No news articles found.");
        }

        // Pick a random article
        const randomIndex = Math.floor(Math.random() * data.articles.length);
        const article = data.articles[randomIndex];

        // Summarize content
        const summary = summarizeText(article.description || article.content, 50);

        // Display the snippet
        document.getElementById("snippet-text").textContent = summary;
        document.getElementById("snippet-source").innerHTML = 
            `Source: <a href="${article.url}" target="_blank">${article.source.name}</a>`;
    } catch (error) {
        console.error("Error fetching news:", error);
        document.getElementById("snippet-text").textContent = "Failed to load snippets.";
    }
}

// Update date and greeting
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById("current-date").textContent = now.toLocaleDateString('en-US', options);

    const hour = now.getHours();
    const greetingElement = document.getElementById("greeting");
    if (hour < 12) {
        greetingElement.textContent = "Good morning";
    } else if (hour < 18) {
        greetingElement.textContent = "Good afternoon";
    } else {
        greetingElement.textContent = "Good evening";
    }
}

// Initialize
updateDateTime();
fetchLatestSnippet();

// Event listener for "Next Snippet"
document.getElementById("next-btn").addEventListener("click", fetchLatestSnippet);
