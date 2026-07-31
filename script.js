document.addEventListener('DOMContentLoaded', () => {

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    setInterval(nextSlide, 4000);
    const searchInput = document.getElementById('searchInput');
    const menuCards = document.querySelectorAll('.menu-card');
    const noResults = document.getElementById('noResults');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let matchesCount = 0;

        menuCards.forEach(card => {
            const cardName = card.getAttribute('data-name').toLowerCase();
            if (cardName.includes(query)) {
                card.style.display = 'block';
                matchesCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (matchesCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    });

    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');
    const successMsg = document.getElementById('successMsg');

    const savedSubmissionsList = document.getElementById('savedSubmissionsList');
    const clearStorageBtn = document.getElementById('clearStorageBtn');

    displayStoredSubmissions();

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        resetErrors();

        let isValid = true;

        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Full name is required.';
            isValid = false;
        }

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Email address is required.';
            isValid = false;
        } else if (!emailInput.value.match(emailPattern)) {
            emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        }

        const phonePattern = /^[0-9]{10}$/;
        if (phoneInput.value.trim() === '') {
            phoneError.textContent = 'Phone number is required.';
            isValid = false;
        } else if (!phoneInput.value.match(phonePattern)) {
            phoneError.textContent = 'Please enter a valid 10-digit phone number.';
            isValid = false;
        }

        if (messageInput.value.trim() === '') {
            messageError.textContent = 'Message field cannot be empty.';
            isValid = false;
        }

        if (isValid) {
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                message: messageInput.value.trim(),
                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            saveToLocalStorage(formData);
            displayStoredSubmissions();

            successMsg.textContent = 'Thank you! Your message/booking has been submitted.';
            contactForm.reset();

            setTimeout(() => {
                successMsg.textContent = '';
            }, 4000);
        }
    });

    function resetErrors() {
        nameError.textContent = '';
        emailError.textContent = '';
        phoneError.textContent = '';
        messageError.textContent = '';
        successMsg.textContent = '';
    }

    function saveToLocalStorage(data) {
        let submissions = JSON.parse(localStorage.getItem('cafeSubmissions')) || [];
        submissions.push(data);
        localStorage.setItem('cafeSubmissions', JSON.stringify(submissions));
    }

    function displayStoredSubmissions() {
        savedSubmissionsList.innerHTML = '';
        let submissions = JSON.parse(localStorage.getItem('cafeSubmissions')) || [];

        if (submissions.length === 0) {
            savedSubmissionsList.innerHTML = '<li>No submissions stored yet.</li>';
            return;
        }

        submissions.forEach((sub, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${sub.name}</strong> (${sub.date})<br>
                            <em>${sub.email}</em> - ${sub.phone}<br>
                            "${sub.message}"`;
            savedSubmissionsList.appendChild(li);
        });
    }

    clearStorageBtn.addEventListener('click', () => {
        localStorage.removeItem('cafeSubmissions');
        displayStoredSubmissions();
    });
});