(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });


    // Car Categories
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    $(".categories-carousel").owlCarousel({
        autoplay: !reducedMotion,
        autoplayTimeout: 6000,
        autoplayHoverPause: true,
        smartSpeed: reducedMotion ? 0 : 600,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fas fa-chevron-left" aria-hidden="true"></i><span class="visually-hidden">Previous vehicle</span>',
            '<i class="fas fa-chevron-right" aria-hidden="true"></i><span class="visually-hidden">Next vehicle</span>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });

    // Keep a vehicle still while a visitor uses its details or booking link.
    $('.categories-carousel').on('focusin', function () {
        $(this).trigger('stop.owl.autoplay');
    }).on('focusout', function (event) {
        if (!reducedMotion && !this.contains(event.relatedTarget)) {
            $(this).trigger('play.owl.autoplay', [6000]);
        }
    });


    // Send the filled reservation to Una's existing WhatsApp contact.
    document.querySelectorAll('.reservation-form').forEach(function (form) {
        var pickupDate = form.elements.pickupDate;
        var returnDate = form.elements.returnDate;
        var returnTime = form.elements.returnTime;
        var today = new Date();
        var todayValue = today.getFullYear() + '-' +
            String(today.getMonth() + 1).padStart(2, '0') + '-' +
            String(today.getDate()).padStart(2, '0');
        pickupDate.min = todayValue;
        returnDate.min = todayValue;

        function validateDates() {
            returnDate.min = pickupDate.value || todayValue;
            returnDate.setCustomValidity('');
            returnTime.setCustomValidity('');
            if (!pickupDate.value || !returnDate.value) return;
            if (returnDate.value < pickupDate.value) {
                returnDate.setCustomValidity('Choose a return date on or after pickup.');
            } else if (returnDate.value === pickupDate.value &&
                returnTime.value <= form.elements.pickupTime.value) {
                returnTime.setCustomValidity('Return time must be after pickup time.');
            }
        }

        form.addEventListener('input', validateDates);
        form.addEventListener('change', validateDates);
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            validateDates();
            if (!form.reportValidity()) return;
            var fields = new FormData(form);
            var message = [
                'Hi Una Bike Rental, I would like to request a rental.',
                'Vehicle: ' + fields.get('vehicle'),
                'Pickup location: ' + fields.get('pickup').trim(),
                'Return location: ' + (fields.get('dropoff').trim() || fields.get('pickup').trim()),
                'Pickup: ' + fields.get('pickupDate') + ' at ' + fields.get('pickupTime'),
                'Return: ' + fields.get('returnDate') + ' at ' + fields.get('returnTime'),
                'Please confirm availability, the total quote, and any delivery charges.'
            ].join('\n');
            window.location.assign('https://wa.me/94773132168?text=' + encodeURIComponent(message));
        });
    });


   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


})(jQuery);

