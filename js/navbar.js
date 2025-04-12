document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");

    function test() {
        let activeItem = document.querySelector("#navbarSupportedContent .active");
        if (activeItem) {
            let horiSelector = document.querySelector(".hori-selector");
            horiSelector.style.top = activeItem.offsetTop + "px";
            horiSelector.style.left = activeItem.offsetLeft + "px";
            horiSelector.style.height = activeItem.offsetHeight + "px";
            horiSelector.style.width = activeItem.offsetWidth + "px";
        }
    }

    // scrolling up/down
    window.addEventListener("scroll", function () {
        if (window.scrollY > 0) {
            navbar.style.paddingTop = "8px";
            navbar.style.backgroundColor = "rgba(0, 0, 0, .9)"
        } else {
            navbar.style.paddingTop = "0";
            navbar.style.backgroundColor = "rgba(0, 0, 0, .3)"
        }
    });

    test();
    window.addEventListener("resize", function () {
        setTimeout(test, 500);
    });

    // Toggle dropdown menu
    let dropdownItems = document.querySelectorAll(".nav-item.dropdown");
    dropdownItems.forEach((item) => {
        item.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent automatic closing
            const dropdownMenu = this.querySelector(".dropdown-menu");
            const isShown = dropdownMenu.classList.contains("d-block");
            dropdownMenu.classList.toggle("d-block");
            this.querySelector(".dropdown-toggle").setAttribute("aria-expanded", !isShown);
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        dropdownItems.forEach((item) => {
            if (!item.contains(event.target)) {
                item.querySelector(".dropdown-menu").classList.remove("d-block");
                item.classList.remove("active");
            }
        });
    });

    // Navbar Toggler for Mobile
    let navbarToggler = document.querySelector(".navbar-toggler");
	navbarToggler.addEventListener("click", function () {
		document.querySelector("#navbarSupportedContent").classList.toggle("show");
		setTimeout(test, 300);
	});

    // **Fix: Update Active Class When Clicking Links**  test again
    let navLinks = document.querySelectorAll("#navbarSupportedContent .nav-link");
    navLinks.forEach((link) => {
        link.addEventListener("click", function () {
            // Remove active class from all items
            navLinks.forEach((nav) => nav.parentElement.classList.remove("active"));
            // Add active class to clicked item
            this.parentElement.classList.add("active");
            test(); // Update selector position
        });
    });

    // **Fix: Keep Active Class on Page Load**
    let path = window.location.pathname.split("/").pop();
    if (path === "") path = "index.html"; // Default to home page
    let targetLink = document.querySelector(`#navbarSupportedContent a[href="${path}"]`);
    if (targetLink) {
        navLinks.forEach((nav) => nav.parentElement.classList.remove("active"));
        targetLink.parentElement.classList.add("active");
        test(); // Update selector position
    }

    // Fix activated navbar based on current route
    let navItems = document.querySelectorAll(".nav-item");

    navItems.forEach((elem, key) => {
        const path = window.location.pathname;
        if (path === "/") {
            // elem
        }
    })
});
