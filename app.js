// Application Data
const bikeData = [
    {
        "id": 1,
        "name": "Royal Enfield Himalayan 411cc",
        "category": "Adventure",
        "description": "Perfect for mountain adventures with superior performance on highways and off-road terrain",
        "image": "photos/1.png",
        "specifications": {
            "engine": "411cc, Single Cylinder",
            "fuel_capacity": "15L",
            "mileage": "30 km/l",
            "max_power": "24.3 bhp",
            "weight": "199 kg"
        },
        "pricing": {
            "hourly": 150,
            "daily": 1800,
            "weekly": 11500,
            "monthly": 45000
        },
        "available": false,
        "popular": true
    },
    {
        "id": 2,
        "name": "Royal Enfield Classic 350",
        "category": "Classic",
        "description": "Iconic classic bike perfect for city rides and highway cruising with timeless design",
        "image": "photos/classic350.png",
        "specifications": {
            "engine": "349cc, Single Cylinder",
            "fuel_capacity": "13L",
            "mileage": "35 km/l",
            "max_power": "20.2 bhp",
            "weight": "195 kg"
        },
        "pricing": {
            "hourly": 120,
            "daily": 1400,
            "weekly": 9000,
            "monthly": 35000
        },
        "available": false,
        "popular": true
    },
    {
        "id": 3,
        "name": "KTM Duke 250",
        "category": "Sports",
        "description": "High-performance sports bike with aggressive styling and excellent handling for thrill seekers",
        "image": "photos/duke250.png",
        "specifications": {
            "engine": "248.8cc, Single Cylinder",
            "fuel_capacity": "13L",
            "mileage": "32 km/l",
            "max_power": "30 bhp",
            "weight": "169 kg"
        },
        "pricing": {
            "hourly": 140,
            "daily": 1600,
            "weekly": 10200,
            "monthly": 40000
        },
        "available": false,
        "popular": false
    },
    {
        "id": 4,
        "name": "Honda Activa 6G",
        "category": "Scooter",
        "description": "Comfortable scooter perfect for local sightseeing and city commuting with excellent fuel efficiency",
        "image": "photos/activa.png",
        "specifications": {
            "engine": "109.51cc, Single Cylinder",
            "fuel_capacity": "5.3L",
            "mileage": "45 km/l",
            "max_power": "7.68 bhp",
            "weight": "109 kg"
        },
        "pricing": {
            "hourly": 80,
            "daily": 800,
            "weekly": 5000,
            "monthly": 18000
        },
        "available": false,
        "popular": true
    },
    {
        "id": 5,
        "name": "Hero XPulse 200",
        "category": "Adventure",
        "description": "Lightweight adventure bike perfect for both on-road and off-road exploration in the mountains",
        "image": "photos/xpulse.png",
        "specifications": {
            "engine": "199.6cc, Single Cylinder",
            "fuel_capacity": "13L",
            "mileage": "40 km/l",
            "max_power": "17.8 bhp",
            "weight": "154 kg"
        },
        "pricing": {
            "hourly": 130,
            "daily": 1500,
            "weekly": 9500,
            "monthly": 37000
        },
        "available": false,
        "popular": false
    },
    {
        "id": 6,
        "name": "Bajaj Pulsar NS200",
        "category": "Sports",
        "description": "Sporty commuter bike with powerful engine and modern styling for dynamic riding experience",
        "image": "photos/ns200.png",
        "specifications": {
            "engine": "199.5cc, Single Cylinder",
            "fuel_capacity": "12L",
            "mileage": "38 km/l",
            "max_power": "24.13 bhp",
            "weight": "154 kg"
        },
        "pricing": {
            "hourly": 110,
            "daily": 1200,
            "weekly": 7600,
            "monthly": 30000
        },
        "available": false,
        "popular": false
    }
];

// Application State
let currentUser = null;
let currentPage = 'home';
let selectedBike = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadBikes();
    setupEventListeners();
    checkAuthState();
});

function initializeApp() {
    // Set minimum dates for booking forms
    const today = new Date().toISOString().split('T')[0];
    const checkinDate = document.getElementById('checkin-date');
    const checkoutDate = document.getElementById('checkout-date');
    const bikePickupDate = document.getElementById('bike-pickup-date');
    const bikeReturnDate = document.getElementById('bike-return-date');
    
    if (checkinDate) checkinDate.min = today;
    if (checkoutDate) checkoutDate.min = today;
    if (bikePickupDate) bikePickupDate.min = today;
    if (bikeReturnDate) bikeReturnDate.min = today;
}

function setupEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
                alert('Admin access required');
                return;
            }
            navigateToPage(page);
        });
    });

    // Hero buttons and other navigation buttons
    document.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-page') && !e.target.classList.contains('nav-link')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            navigateToPage(page);
        }
    });

    // Authentication buttons
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('login-modal');
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('register-modal');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Modal handling
    setupModalListeners();

    // Forms
    setupFormListeners();

    // Room booking buttons
    document.querySelectorAll('.book-room-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const roomType = btn.getAttribute('data-room');
            const price = btn.getAttribute('data-price');
            navigateToPage('book-now');
            setTimeout(() => {
                const roomTypeSelect = document.getElementById('room-type');
                if (roomTypeSelect) {
                    roomTypeSelect.value = roomType;
                    updateBookingSummary();
                }
            }, 100);
        });
    });

    // Bike category filters
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterBikes(btn.getAttribute('data-category'));
        });
    });

    // Admin tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = btn.getAttribute('data-tab');
            switchAdminTab(tab);
        });
    });

    // Mobile navigation
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

function setupModalListeners() {
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(e.target.closest('.modal').id);
        });
    });

    // Click outside to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function setupFormListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Room booking form
    const roomBookingForm = document.getElementById('room-booking-form');
    if (roomBookingForm) {
        roomBookingForm.addEventListener('submit', handleRoomBooking);
    }

    // Bike booking form
    const bikeBookingForm = document.getElementById('bike-booking-form');
    if (bikeBookingForm) {
        bikeBookingForm.addEventListener('submit', handleBikeBooking);
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Quick contact forms
    document.querySelectorAll('.quick-contact-form').forEach(form => {
        form.addEventListener('submit', handleQuickContact);
    });

    // Booking form updates
    const roomType = document.getElementById('room-type');
    const checkinDate = document.getElementById('checkin-date');
    const checkoutDate = document.getElementById('checkout-date');
    const adults = document.getElementById('adults');
    const children = document.getElementById('children');

    [roomType, checkinDate, checkoutDate, adults, children].forEach(element => {
        if (element) {
            element.addEventListener('change', updateBookingSummary);
        }
    });

    // Bike booking form updates
    const bikePickupDate = document.getElementById('bike-pickup-date');
    const bikeReturnDate = document.getElementById('bike-return-date');

    [bikePickupDate, bikeReturnDate].forEach(element => {
        if (element) {
            element.addEventListener('change', updateBikeBookingSummary);
        }
    });
}

// Navigation
function navigateToPage(pageId) {
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink && activeLink.classList.contains('nav-link')) {
        activeLink.classList.add('active');
    }

    // Update pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
        
        // Scroll to top when navigating
        window.scrollTo(0, 0);
    }

    // Load page-specific content
    if (pageId === 'admin') {
        loadAdminData();
    } else if (pageId === 'bike-rentals') {
        setTimeout(loadBikes, 100); // Ensure bikes are loaded when page is visible
    }
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const passwordInput = e.target.querySelector('input[type="password"]');
    
    const email = emailInput.value;
    const password = passwordInput.value;

    // Simple authentication (in real app, this would be server-side)
    if (email === 'admin@himalayan-vista.com' && password === 'admin123') {
        currentUser = {
            id: 1,
            name: 'Admin User',
            email: email,
            role: 'admin'
        };
    } else {
        // Demo user login
        currentUser = {
            id: 2,
            name: email.split('@')[0],
            email: email,
            role: 'user'
        };
    }

    updateAuthUI();
    closeModal('login-modal');
    showNotification('Login successful!', 'success');
    
    // Clear form
    e.target.reset();
}

function handleRegister(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input');
    const firstName = inputs[0].value;
    const lastName = inputs[1].value;
    const email = inputs[2].value;
    const phone = inputs[3].value;
    const password = inputs[4].value;
    const confirmPassword = inputs[5].value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    // Demo registration
    currentUser = {
        id: Date.now(),
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        role: 'user'
    };

    updateAuthUI();
    closeModal('register-modal');
    showNotification('Registration successful!', 'success');
    
    // Clear form
    e.target.reset();
}

function logout() {
    currentUser = null;
    updateAuthUI();
    if (currentPage === 'admin') {
        navigateToPage('home');
    }
    showNotification('Logged out successfully!', 'success');
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userMenu = document.getElementById('user-menu');
    const adminLink = document.querySelector('.admin-link');
    
    if (currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = currentUser.name;
        }
        
        if (currentUser.role === 'admin' && adminLink) {
            adminLink.style.display = 'block';
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-flex';
        if (registerBtn) registerBtn.style.display = 'inline-flex';
        if (userMenu) userMenu.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }
}

function checkAuthState() {
    // In a real app, check for stored auth tokens
    updateAuthUI();
}

// Bike Management
function loadBikes() {
    const bikesGrid = document.getElementById('bikes-grid');
    if (!bikesGrid) return;

    bikesGrid.innerHTML = '';
    bikeData.forEach(bike => {
        const bikeCard = createBikeCard(bike);
        bikesGrid.appendChild(bikeCard);
    });
}

function createBikeCard(bike) {
    const card = document.createElement('div');
    card.className = `bike-card ${bike.popular ? 'popular' : ''}`;
    card.setAttribute('data-category', bike.category);

    card.innerHTML = `
        <div class="bike-image">
            <img src="${bike.image}" alt="${bike.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJpa2UgSW1hZ2U8L3RleHQ+PC9zdmc+'">
        </div>
        <div class="bike-content">
            <div class="bike-header">
                <h3 class="bike-name">${bike.name}</h3>
                <span class="bike-category">${bike.category}</span>
            </div>
            <p class="bike-description">${bike.description}</p>
            <div class="bike-specs">
                <div class="spec-item">
                    <strong>Engine:</strong> ${bike.specifications.engine}
                </div>
                <div class="spec-item">
                    <strong>Mileage:</strong> ${bike.specifications.mileage}
                </div>
                <div class="spec-item">
                    <strong>Fuel:</strong> ${bike.specifications.fuel_capacity}
                </div>
                <div class="spec-item">
                    <strong>Power:</strong> ${bike.specifications.max_power}
                </div>
            </div>
            <div class="bike-pricing">
                <div class="pricing-grid">
                    <div class="price-item">
                        <span class="duration">Hourly</span>
                        <span class="amount">₹${bike.pricing.hourly}</span>
                    </div>
                    <div class="price-item">
                        <span class="duration">Daily</span>
                        <span class="amount">₹${bike.pricing.daily}</span>
                    </div>
                    <div class="price-item">
                        <span class="duration">Weekly</span>
                        <span class="amount">₹${bike.pricing.weekly}</span>
                    </div>
                    <div class="price-item">
                        <span class="duration">Monthly</span>
                        <span class="amount">₹${bike.pricing.monthly}</span>
                    </div>
                </div>
            </div>
            <div class="availability-status">
                <span class="status-dot ${bike.available ? 'available' : 'unavailable'}"></span>
                <span>${bike.available ? 'Available' : 'Not Available'}</span>
            </div>
            <button class="btn btn--primary btn--full-width bike-book-btn" 
                    data-bike-id="${bike.id}"
                    ${!bike.available ? 'disabled' : ''}>
                ${bike.available ? 'Book Now' : 'Not Available'}
            </button>
        </div>
    `;

    // Add event listener for bike booking
    const bookBtn = card.querySelector('.bike-book-btn');
    if (bookBtn) {
        bookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const bikeId = parseInt(e.target.getAttribute('data-bike-id'));
            openBikeBooking(bikeId);
        });
    }

    return card;
}

function filterBikes(category) {
    const bikeCards = document.querySelectorAll('.bike-card');
    bikeCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Booking Management
function handleRoomBooking(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login to make a booking', 'error');
        openModal('login-modal');
        return;
    }

    const booking = {
        id: Date.now(),
        type: 'room',
        userId: currentUser.id,
        roomType: document.getElementById('room-type').value,
        checkinDate: document.getElementById('checkin-date').value,
        checkoutDate: document.getElementById('checkout-date').value,
        adults: document.getElementById('adults').value,
        children: document.getElementById('children').value,
        guestName: `${document.getElementById('first-name').value} ${document.getElementById('last-name').value}`,
        email: document.getElementById('guest-email').value,
        phone: document.getElementById('guest-phone').value,
        total: calculateRoomTotal(),
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    // Save booking
    saveBooking(booking);
    
    showNotification('Room booking confirmed!', 'success');
    e.target.reset();
    updateBookingSummary();
}

function openBikeBooking(bikeId) {
    if (!currentUser) {
        showNotification('Please login to rent a bike', 'error');
        openModal('login-modal');
        return;
    }

    selectedBike = bikeData.find(bike => bike.id === bikeId);
    if (!selectedBike) return;

    // Update modal content
    document.getElementById('selected-bike-image').src = selectedBike.image;
    document.getElementById('selected-bike-name').textContent = selectedBike.name;
    document.getElementById('selected-bike-description').textContent = selectedBike.description;
    document.getElementById('daily-rate').textContent = `₹${selectedBike.pricing.daily}`;
    
    // Pre-fill user info
    if (currentUser) {
        document.getElementById('renter-name').value = currentUser.name;
        document.getElementById('renter-email').value = currentUser.email;
    }

    openModal('bike-booking-modal');
}

function handleBikeBooking(e) {
    e.preventDefault();
    
    const booking = {
        id: Date.now(),
        type: 'bike',
        userId: currentUser.id,
        bikeId: selectedBike.id,
        bikeName: selectedBike.name,
        pickupDate: document.getElementById('bike-pickup-date').value,
        returnDate: document.getElementById('bike-return-date').value,
        pickupTime: document.getElementById('bike-pickup-time').value,
        returnTime: document.getElementById('bike-return-time').value,
        renterName: document.getElementById('renter-name').value,
        licenseNumber: document.getElementById('license-number').value,
        email: document.getElementById('renter-email').value,
        phone: document.getElementById('renter-phone').value,
        total: calculateBikeTotal(),
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    // Save booking
    saveBooking(booking);
    
    showNotification('Bike rental confirmed!', 'success');
    closeModal('bike-booking-modal');
    e.target.reset();
}

function updateBookingSummary() {
    const roomType = document.getElementById('room-type');
    const checkinDate = document.getElementById('checkin-date');
    const checkoutDate = document.getElementById('checkout-date');
    const adults = document.getElementById('adults');
    const children = document.getElementById('children');

    if (!roomType) return;

    // Update summary display
    document.getElementById('summary-room').textContent = roomType.value || '-';
    
    if (checkinDate && checkoutDate && checkinDate.value && checkoutDate.value) {
        document.getElementById('summary-dates').textContent = `${checkinDate.value} to ${checkoutDate.value}`;
        
        const nights = Math.ceil((new Date(checkoutDate.value) - new Date(checkinDate.value)) / (1000 * 60 * 60 * 24));
        document.getElementById('summary-nights').textContent = nights > 0 ? nights : '-';
    } else {
        document.getElementById('summary-dates').textContent = '-';
        document.getElementById('summary-nights').textContent = '-';
    }
    
    if (adults && children) {
        document.getElementById('summary-guests').textContent = adults.value ? `${adults.value} adults${children.value !== '0' ? `, ${children.value} children` : ''}` : '-';
    }
    
    const total = calculateRoomTotal();
    document.getElementById('summary-total').textContent = total > 0 ? `₹${total}` : '₹0';
}

function updateBikeBookingSummary() {
    const pickupDate = document.getElementById('bike-pickup-date');
    const returnDate = document.getElementById('bike-return-date');

    if (pickupDate && returnDate && pickupDate.value && returnDate.value && selectedBike) {
        const days = Math.ceil((new Date(returnDate.value) - new Date(pickupDate.value)) / (1000 * 60 * 60 * 24));
        document.getElementById('rental-duration').textContent = days > 0 ? `${days} days` : '-';
        
        const total = calculateBikeTotal();
        document.getElementById('bike-total-amount').textContent = total > 0 ? `₹${total}` : '₹0';
    }
}

function calculateRoomTotal() {
    const roomSelect = document.getElementById('room-type');
    const checkinDate = document.getElementById('checkin-date');
    const checkoutDate = document.getElementById('checkout-date');

    if (!roomSelect || !roomSelect.value || !checkinDate || !checkoutDate || !checkinDate.value || !checkoutDate.value) return 0;

    const selectedOption = roomSelect.selectedOptions[0];
    const pricePerNight = parseInt(selectedOption.getAttribute('data-price'));
    const nights = Math.ceil((new Date(checkoutDate.value) - new Date(checkinDate.value)) / (1000 * 60 * 60 * 24));

    return nights > 0 ? nights * pricePerNight : 0;
}

function calculateBikeTotal() {
    const pickupDate = document.getElementById('bike-pickup-date');
    const returnDate = document.getElementById('bike-return-date');

    if (!pickupDate || !returnDate || !pickupDate.value || !returnDate.value || !selectedBike) return 0;

    const days = Math.ceil((new Date(returnDate.value) - new Date(pickupDate.value)) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * selectedBike.pricing.daily + 3000 : 0; // +3000 for security deposit
}
let bookingsStorage = [];
// Data Management
function saveBooking(booking) {
    // Add booking to our storage array
    bookingsStorage.push(booking);
    console.log('Booking saved:', booking);
}

function getBookings() {
    // Return actual bookings from storage instead of empty array
    return bookingsStorage;
}

// Admin Functions
function loadAdminData() {
    loadRoomBookings();
    loadBikeBookings();
    loadBikeInventory();
}

function loadRoomBookings() {
    const container = document.getElementById('room-bookings-table');
    if (!container) return;

    const bookings = getBookings().filter(b => b.type === 'room');
    
    container.innerHTML = `
        <div class="table-header">
            <div>Guest</div>
            <div>Room</div>
            <div>Dates</div>
            <div>Total</div>
            <div>Status</div>
        </div>
        ${bookings.map(booking => `
            <div class="table-row">
                <div>${booking.guestName}</div>
                <div>${booking.roomType}</div>
                <div>${booking.checkinDate} to ${booking.checkoutDate}</div>
                <div>₹${booking.total}</div>
                <div><span class="status status--success">${booking.status}</span></div>
            </div>
        `).join('')}
    `;

    if (bookings.length === 0) {
        container.innerHTML += '<div class="table-row"><div style="text-align: center; grid-column: 1 / -1; padding: 20px; color: var(--color-text-secondary);">No room bookings found</div></div>';
    }
}

function loadBikeBookings() {
    const container = document.getElementById('bike-bookings-table');
    if (!container) return;

    const bookings = getBookings().filter(b => b.type === 'bike');
    
    container.innerHTML = `
        <div class="table-header">
            <div>Renter</div>
            <div>Bike</div>
            <div>Dates</div>
            <div>Total</div>
            <div>Status</div>
        </div>
        ${bookings.map(booking => `
            <div class="table-row">
                <div>${booking.renterName}</div>
                <div>${booking.bikeName}</div>
                <div>${booking.pickupDate} to ${booking.returnDate}</div>
                <div>₹${booking.total}</div>
                <div><span class="status status--success">${booking.status}</span></div>
            </div>
        `).join('')}
    `;

    if (bookings.length === 0) {
        container.innerHTML += '<div class="table-row"><div style="text-align: center; grid-column: 1 / -1; padding: 20px; color: var(--color-text-secondary);">No bike bookings found</div></div>';
    }
}

function loadBikeInventory() {
    const container = document.getElementById('bike-inventory-grid');
    if (!container) return;

    container.innerHTML = bikeData.map(bike => `
        <div class="inventory-item">
            <div class="inventory-header">
                <h4>${bike.name}</h4>
                <button class="availability-toggle ${bike.available ? 'available' : 'unavailable'}" 
                        onclick="toggleBikeAvailability(${bike.id})">
                    ${bike.available ? 'Available' : 'Unavailable'}
                </button>
            </div>
            <div class="spec-item"><strong>Category:</strong> ${bike.category}</div>
            <div class="spec-item"><strong>Daily Rate:</strong> ₹${bike.pricing.daily}</div>
            <div class="spec-item"><strong>Engine:</strong> ${bike.specifications.engine}</div>
            <div class="spec-item"><strong>Mileage:</strong> ${bike.specifications.mileage}</div>
        </div>
    `).join('');
}

function switchAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) activeTab.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    const activeContent = document.getElementById(tabName);
    if (activeContent) activeContent.classList.add('active');

    // Load specific data
    switch(tabName) {
        case 'room-bookings':
            loadRoomBookings();
            break;
        case 'bike-bookings':
            loadBikeBookings();
            break;
        case 'bike-inventory':
            loadBikeInventory();
            break;
    }
}

function toggleBikeAvailability(bikeId) {
    const bike = bikeData.find(b => b.id === bikeId);
    if (bike) {
        bike.available = !bike.available;
        loadBikeInventory();
        loadBikes(); // Refresh main bikes display
        showNotification(`${bike.name} marked as ${bike.available ? 'available' : 'unavailable'}`, 'success');
    }
}

// Contact Forms
function handleContactForm(e) {
    e.preventDefault();
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    e.target.reset();
}

function handleQuickContact(e) {
    e.preventDefault();
    showNotification('Thank you for your message! We will contact you soon.', 'success');
    e.target.reset();
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 12px 16px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        max-width: 300px;
        font-size: 14px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set color based on type
    if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.color = 'var(--color-success)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.color = 'var(--color-error)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}