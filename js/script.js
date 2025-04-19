var myCarousel = document.querySelector('#carouselHome');
var carousel = new bootstrap.Carousel(myCarousel, {
    interval: true,  // Disables auto-cycling
    interval: 4000,
})


// Add Slider for Fast and Track Service
$(document).ready(function(){

    // nav-link active
    document.querySelectorAll("li[data-nav-link]").forEach(listOfLinks => {
        let pathName = listOfLinks.dataset.navLink;
        if (pathName === window.location.pathname) {
            listOfLinks.classList.add('active');
            return;
        }
    });

    $('.fast-track-slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        draggable: true,
        speed: 1000,
        arrows: true,
        prevArrow: '<button class="slick-slide-btn slick-slide-btn-left fas fa-caret-left"></button>',
        nextArrow: '<button class="slick-slide-btn slick-slide-btn-right fas fa-caret-right"></button>',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    // fast track filter
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-service-filter]');
    const cards = document.querySelectorAll('.service-card-track .col-lg-4');

    function filterCards() {
        // Get all checked filters
        const activeFilters = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.dataset.serviceFilter);

        // Show all cards if no filter is selected
        if (activeFilters.length === 0) {
            cards.forEach(card => card.style.display = 'block');
            return;
        }

        // Otherwise, show cards matching the selected filters
        cards.forEach(card => {
            const matches = activeFilters.some(filter => card.classList.contains(filter));
            card.style.display = matches ? 'block' : 'none';
        });
    }

    // Attach event listeners to checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterCards);
    });

    // Initial state: show all
    filterCards();

    // slide the card images
    $('.card .card-slider').slick({
        dots: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        infinite: true,
        speed: 500,
        fade: false,
        cssEase: 'linear'
    });    

    // Open/Close the Popup
    const bookNowButtons = document.querySelectorAll('.book-now-btn');
    const popupForm = document.getElementById('popup-form');
    const closeBtn = document.getElementById('close-btn');
    const serviceTypeInput = document.getElementById('service-type');
    const ticketingFields = document.getElementById('ticketing-fields');
    const typePlanSelect = document.getElementById('type-plan');
    const returnDateGroup = document.getElementById('return-date-group');

    bookNowButtons.forEach(button => {
        button.addEventListener('click', function () {
            const card = button.closest('.card');
            const title = card.querySelector('.card-title').textContent.trim();

            serviceTypeInput.value = title;
            popupForm.style.display = 'flex';

            // Show ticketing-specific fields only when applicable
            if (title.toLowerCase() === 'ticketing') {
                ticketingFields.style.display = 'block';
            } else {
                ticketingFields.style.display = 'none';
            }

            // Reset fields when reopening
            if (typePlanSelect) {
                typePlanSelect.value = "";
                returnDateGroup.style.display = 'none';
            }
        });
    });


    // Close popup
    closeBtn.addEventListener('click', function () {
        popupForm.style.display = 'none';
    });

    // Close when clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === popupForm) {
            popupForm.style.display = 'none';
        }
    });

    // Example popup open logic from your button
    bookNowButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const serviceType = this.closest('.card').querySelector('h5').textContent.trim();
            document.getElementById('popup-form').style.display = 'block';
            document.getElementById('service-type').value = serviceType;

            // Show/hide "area" field only if Cairo is selected
            const areaGroup = document.getElementById('area-group');
            if (serviceType.toLowerCase().includes('cairo')) {
                areaGroup.style.display = 'block';
            } else {
                areaGroup.style.display = 'none';
            }
        });
    });

    // Handle showing "Return Date" only when "Two Way" is selected
    if (typePlanSelect) {
        typePlanSelect.addEventListener('change', function () {
            if (this.value === 'two way') {
                returnDateGroup.style.display = 'block';
            } else {
                returnDateGroup.style.display = 'none';
            }
        });
    }

    // Close popup
    document.getElementById('close-btn').addEventListener('click', function () {
        document.getElementById('popup-form').style.display = 'none';
    });

    // Load nationalities
    fetch('/api/nationalities')
        .then(res => res.json())
        .then(nationalities => {
            const select = document.getElementById('nationality');
            nationalities.forEach(nat => {
                const option = document.createElement('option');
                option.value = nat;
                option.textContent = nat;
                select.appendChild(option);
            });
        });

        const checkInInput = document.getElementById("check-in");
        const checkOutInput = document.getElementById("check-out");
    
        function showError(input, message) {
            alert(message); // or show under input with custom element
            input.value = "";
            input.focus();
        }
    
        checkInInput.addEventListener("change", function () {
            const today = new Date();
            const selectedDate = new Date(checkInInput.value);
            
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
    
            if (selectedDate < tomorrow) {
                showError(checkInInput, "Check-in date must be at least from tomorrow.");
            }
    
            // Reset check-out if it no longer makes sense
            if (checkOutInput.value) {
                const checkOutDate = new Date(checkOutInput.value);
                if (checkOutDate <= selectedDate) {
                    showError(checkOutInput, "Check-out must be after the check-in date.");
                }
            }
        });
    
        checkOutInput.addEventListener("change", function () {
            const checkInDate = new Date(checkInInput.value);
            const checkOutDate = new Date(checkOutInput.value);
    
            if (!checkInInput.value) {
                showError(checkOutInput, "Please select a check-in date first.");
                return;
            }
    
            if (checkOutDate <= checkInDate) {
                showError(checkOutInput, "Check-out must be after the check-in date.");
            }
        });
});    

