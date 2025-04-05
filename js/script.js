var myCarousel = document.querySelector('#carouselHome');
var carousel = new bootstrap.Carousel(myCarousel, {
    interval: false,  // Disables auto-cycling
})


// Add Slider for Fast and Track Service
$(document).ready(function(){
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
    const cards = document.querySelectorAll('.service-card-track .col-4');

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

    bookNowButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Get the closest card title
            const card = button.closest('.card');
            const title = card.querySelector('.card-title').textContent.trim();

            // Set the service type dynamically
            serviceTypeInput.value = title;

            // Show the popup
            popupForm.style.display = 'flex';
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
});    

