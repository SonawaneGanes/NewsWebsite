document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form submission

    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        state: document.getElementById('state').value,
        city: document.getElementById('city').value,
        password: document.getElementById('password').value,
    };

    try {
        // Send data to the backend using Fetch API
        const response = await fetch('http://127.0.0.1:5501/signup.html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Signup successful!');
        } else {
            alert(`Signup failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred during signup.');
    }
});
