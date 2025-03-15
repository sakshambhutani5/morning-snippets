const API_KEY = window.API_KEY;
const RAPIDAPI_KEY = window.RAPIDAPI_KEY;

const SOURCES = "venturebeat.com,techcrunch.com,wired.com,arxiv.org,towardsdatascience.com,syncedreview.com,ai.googleblog.com,nytimes.com,bbc.com,forbes.com,bloomberg.com,reuters.com";
const TLDR_API_URL = "https://tldrthis.p.rapidapi.com/v1/model/abstractive/summarize-url"; // Removed extra "/"

async function fetchLatestSnippet() {
    try {
        const response = await fetch(`https://gnews.io/api/v4/search?q=Artificial+Intelligence&lang=en&token=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`GNews API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched GNews data:", data);

        if (!data.articles || data.articles.length === 0) {
            throw new Error("No news articles found.");
        }

        // Sort by latest article
        const sortedArticles = data.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        const latestArticle = sortedArticles[0];
        const articleUrl = latestArticle.url;

        console.log("Fetching summary for:", articleUrl);

        // Fetch summary from TLDRThis
        const summary = await summarizeWithTldrThis(articleUrl);

        // Display summary
        document.getElementById("snippet-text").textContent = summary;
        document.getElementById("snippet-source").innerHTML = 
            `Source: <a href="${articleUrl}" target="_blank">${latestArticle.source.name}</a>`;
    } catch (error) {
        console.error("Error fetching news:", error);
        document.getElementById("snippet-text").textContent = "Failed to load snippets.";
    }
}

// Function to fetch summarized content from TLDRThis API
async function summarizeWithTldrThis(url) {
    try {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": RAPIDAPI_KEY,  // ✅ Ensuring correct key name
                "X-RapidAPI-Host": "tldrthis.p.rapidapi.com" // ✅ Fixed case issue
            },
            body: JSON.stringify({
                url: url,
                min_length: 100,
                max_length: 300,
                is_detailed: false
            })
        };

        const response = await fetch(TLDR_API_URL, options);
        
        if (!response.ok) {
            throw new Error(`TLDR API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("TLDR API Response:", data);

        return data.summary || "Summary not available.";
    } catch (error) {
        console.error("Error fetching summary:", error);
        return "Summary not available.";
    }
}

// Function to update the date and greeting
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById("current-date").textContent = now.toLocaleDateString('en-US', options);

    const hour = now.getHours();
    const greetingElement = document.getElementById("greeting");
    greetingElement.textContent = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

// Initiali
