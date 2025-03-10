// Select the container for the stars
const starsContainer = document.querySelector('.stars');

// Function to generate random values within a range
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

// Function to create and animate stars
function createStars(count) {
    for (let i = 0; i < count; i++) {
        // Create a star element
        const star = document.createElement('div');
        star.classList.add('star');

        // Set random properties for the star
        const topOffset = getRandom(0, window.innerHeight);
        const tailLength = getRandom(5, 7) + 'em'; // Random tail length
        const fallDuration = getRandom(6, 12) + 's'; // Random fall duration
        const fallDelay = getRandom(0, 10) + 's'; // Random animation delay

        // Apply styles to the star
        star.style.setProperty('--top-offset', `${topOffset}px`);
        star.style.setProperty('--star-tail-length', tailLength);
        star.style.setProperty('--fall-duration', fallDuration);
        star.style.setProperty('--fall-delay', fallDelay);

        // Add the star to the container
        starsContainer.appendChild(star);
    }
}

// Call the function to generate stars
createStars(50);
