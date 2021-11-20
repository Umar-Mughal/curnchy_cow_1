
 
(function ($) {
    "use strict";

    $(window).on('load', function(){
        //===== Prealoder
        $("#preloader").delay(1800).fadeOut("slow");

    });

    $(document).ready(function () {

        //03. Smooth Scroll Initialize
        function smoothScroolInit() {
            $('a').smoothScroll({
                speed: 1000
            });
        }

        smoothScroolInit();

        //05. sticky header
        function sticky_header(){
            var wind = $(window);
            var sticky = $('header');
            wind.on('scroll', function () {
                var scroll = wind.scrollTop();
                if (scroll < 2) {
                    sticky.removeClass('sticky');
                } else {
                    sticky.addClass('sticky');
                }
            });
        }
        sticky_header();
        //===== Back to top

        // Show or hide the sticky footer button
        $(window).on('scroll', function (event) {
            if ($(this).scrollTop() > 600) {
                $('.back-to-top').fadeIn(200);
            } else {
                $('.back-to-top').fadeOut(200);
            }
        });

        //Animate the scroll to yop
        $('.back-to-top').on('click', function (event) {
            event.preventDefault();

            $('html, body').animate({
                scrollTop: 0,
            }, 1500);
        });

        // Hamburger-menu
        $('.hamburger-menu, #menu li a').on('click', function () {
            $('.hamburger-menu .line-top').toggleClass('current');
            $('.hamburger-menu .line-center').toggleClass('current');
            $('.hamburger-menu .line-bottom').toggleClass('current');
            $('.mobile-menu').toggleClass('open');
        });

        // Price changes in module
        $('.mint-btn ').on('click', function (event) {
            event.preventDefault();
            let price = $(this).attr('data-value')
            let cowCount = $(this).attr('data-cow-count')
            $('#total-minted-count').text(`${cowCount} ${parseInt(cowCount) === 1 ? 'cow': 'cows'}`)
            $('#cost').text(price)
            $('#cow-count').val(cowCount)
        });

        // Minting is in progress
      

        // Minting is Done
        const mintingDone = () => {
            setTimeout(() => {
                $('#start-mint-text').text('')
                $('#mintModal').modal('hide');
                $('.modal-backdrop').remove();
                $('#mintIsDoneModal').modal('show');
            }, 2000)
        }
        //Animate the scroll to yop
        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0,1] // Will preload 0 - before current, and 1 after the current image
            },
            
        });


    });

})(jQuery);