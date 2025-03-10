const API_KEY = "94da927230e54e5ca7800dfc16bd2190"; // Updated API Key
const url = "https://newsapi.org/v2/everything?q=";

// Load default news on page load
window.addEventListener("load", () => fetchNews("Technology"));

async function fetchNews(query) {
    const fullUrl = `${url}${encodeURIComponent(query)}&apiKey=${API_KEY}`;
    console.log(`Fetching: ${fullUrl}`);
    try {
        const res = await fetch(fullUrl);

        // Check for HTTP errors
        if (!res.ok) {
            console.error(`HTTP Error: ${res.status} - ${res.statusText}`);
            displayError(`Failed to fetch news: ${res.statusText}`);
            return;
        }

        const data = await res.json();
        console.log("Fetched Data:", data);

        // Handle API response status
        if (data.status === "ok") {
            bindData(data.articles);
        } else {
            console.error("API Error:", data.message);
            displayError(data.message || "Unknown API error.");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        displayError("An error occurred while fetching news.");
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
    const newsCardTemplate = document.getElementById("template-news-card");

    if (!cardsContainer || !newsCardTemplate) {
        console.error("Required elements not found in the DOM.");
        return;
    }

    cardsContainer.innerHTML = "";

    if (articles.length === 0) {
        displayError("No articles found for this category or search.");
        return;
    }

    articles.forEach((article) => {
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    if (!newsImg || !newsTitle || !newsSource || !newsDesc) {
        console.error("Card elements are missing.");
        return;
    }

    newsImg.src = article.urlToImage;
    newsTitle.textContent = article.title.length > 60 ? `${article.title.slice(0, 60)}...` : article.title;
    newsDesc.textContent = article.description ? `${article.description.slice(0, 150)}...` : "Description not available.";

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    newsSource.textContent = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(category) {
    fetchNews(category);
    const navItem = document.getElementById(category);

    if (curSelectedNav) {
        curSelectedNav.classList.remove("active");
    }
    curSelectedNav = navItem;
    curSelectedNav?.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) {
        displayError("Please enter a search term.");
        return;
    }
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

function displayError(message) {
    const cardsContainer = document.getElementById("cardscontainer");
    if (cardsContainer) {
        cardsContainer.innerHTML = `<p class="error-message">${message}</p>`;
    } else {
        console.error("cardscontainer not found.");
    }
}
