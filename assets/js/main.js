/**
* Template Name: Personal - v2.1.0
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

/*--------------------------------------------------------------
# Theme System & Neural Network Background
--------------------------------------------------------------*/
(function() {
  "use strict";

  // Detect OS theme preference and set initial theme
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  // Set theme on document
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Update neural network colors if already initialized
    if (window.neuralNetwork) {
      window.neuralNetwork.updateTheme();
    }
  }

  // Initialize theme on page load
  setTheme(getPreferredTheme());

  // Theme toggle functionality
  document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('theme-toggle');
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        
        this.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
          this.style.transform = '';
        }, 300);
      });
    }

    // Initialize Neural Network Background
    initNeuralNetwork();
  });

  // Listen for OS theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Neural Network Background Implementation
  function initNeuralNetwork() {
    const canvas = document.getElementById('neural-network-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let nodes = [];
    let mouse = { x: null, y: null, radius: 150 };
    let currentSection = '';
    let animationId;

    // Node class
    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.originalVx = this.vx;
        this.originalVy = this.vy;
      }

      update() {
        // Mouse interaction - attract nodes
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * 0.2;
            this.vy += Math.sin(angle) * force * 0.2;
          }
        }

        // Gradually return to original velocity
        this.vx += (this.originalVx - this.vx) * 0.01;
        this.vy += (this.originalVy - this.vy) * 0.01;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) {
          this.vx *= -1;
          this.originalVx *= -1;
        }
        if (this.y < 0 || this.y > height) {
          this.vy *= -1;
          this.originalVy *= -1;
        }

        // Keep within bounds
        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
      }

      draw() {
        const theme = document.documentElement.getAttribute('data-theme');
        const colors = getThemeColors(theme);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.node;
        ctx.fill();
      }
    }

    // Get theme-appropriate colors
    function getThemeColors(theme) {
      if (theme === 'light') {
        return {
          node: 'rgba(5, 150, 105, 0.8)',
          connection: 'rgba(5, 150, 105, 0.25)',
          activeConnection: 'rgba(5, 150, 105, 0.6)'
        };
      } else {
        return {
          node: 'rgba(18, 214, 64, 0.6)',
          connection: 'rgba(18, 214, 64, 0.15)',
          activeConnection: 'rgba(18, 214, 64, 0.4)'
        };
      }
    }

    // Draw connections between nodes
    function drawConnections() {
      const theme = document.documentElement.getAttribute('data-theme');
      const colors = getThemeColors(theme);
      const maxDistance = 150;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            
            // Check if connection is near mouse
            let isNearMouse = false;
            if (mouse.x !== null && mouse.y !== null) {
              const distToMouse1 = Math.sqrt(Math.pow(mouse.x - nodes[i].x, 2) + Math.pow(mouse.y - nodes[i].y, 2));
              const distToMouse2 = Math.sqrt(Math.pow(mouse.x - nodes[j].x, 2) + Math.pow(mouse.y - nodes[j].y, 2));
              isNearMouse = distToMouse1 < mouse.radius || distToMouse2 < mouse.radius;
            }

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = isNearMouse ? colors.activeConnection : colors.connection;
            ctx.lineWidth = isNearMouse ? 2 : 1;
            ctx.globalAlpha = opacity * (isNearMouse ? 1.5 : 1);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    }

    // Animation loop
    function animate() {
      const theme = document.documentElement.getAttribute('data-theme');
      const bgColor = theme === 'light' ? '#f8fafc' : '#010e1b';
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      drawConnections();

      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      animationId = requestAnimationFrame(animate);
    }

    // Initialize nodes
    function createNodes() {
      nodes = [];
      const nodeCount = Math.floor((width * height) / 15000);
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node());
      }
    }

    // Mouse move handler
    window.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // Mouse leave handler
    window.addEventListener('mouseout', function() {
      mouse.x = null;
      mouse.y = null;
    });

    // Resize handler
    window.addEventListener('resize', function() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createNodes();
    });

    // Section change detection for pulse effect
    function detectSectionChange() {
      const sections = document.querySelectorAll('section[id], #header');
      const scrollPos = window.scrollY + window.innerHeight / 3;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          if (currentSection !== sectionId) {
            currentSection = sectionId;
            triggerPulseEffect();
          }
        }
      });
    }

    // Pulse effect on section change
    function triggerPulseEffect() {
      nodes.forEach(node => {
        node.vx *= 1.5;
        node.vy *= 1.5;
      });
    }

    // Scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(detectSectionChange, 100);
    }, { passive: true });

    // Public API for theme updates
    window.neuralNetwork = {
      updateTheme: function() {
        // Colors will update automatically in next frame
      }
    };

    // Initialize
    createNodes();
    animate();
  }

})();

/*--------------------------------------------------------------
# jQuery Navigation & Interactions
--------------------------------------------------------------*/
!(function ($) {
  "use strict";

  // Nav Menu
  $(document).on('click', '.nav-menu a, .mobile-nav a', function (e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var hash = this.hash;
      var target = $(hash);
      if (target.length) {
        e.preventDefault();

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if (hash == '#header') {
          $('#header').removeClass('header-top');
          $("section").removeClass('section-show');
          return;
        }

        if (!$('#header').hasClass('header-top')) {
          $('#header').addClass('header-top');
          setTimeout(function () {
            $("section").removeClass('section-show');
            $(hash).addClass('section-show');
          }, 350);
        } else {
          $("section").removeClass('section-show');
          $(hash).addClass('section-show');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }

        return false;

      }
    }
  });

  // Activate/show sections on load with hash links
  if (window.location.hash) {
    var initial_nav = window.location.hash;
    if ($(initial_nav).length) {
      $('#header').addClass('header-top');
      $('.nav-menu .active, .mobile-nav .active').removeClass('active');
      $('.nav-menu, .mobile-nav').find('a[href="' + initial_nav + '"]').parent('li').addClass('active');
      setTimeout(function () {
        $("section").removeClass('section-show');
        $(initial_nav).addClass('section-show');
      }, 350);
    }
  }

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function (e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).click(function (e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Skills section
  $('.skills-content').waypoint(function () {
    $('.progress .progress-bar').each(function () {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });

  // Porfolio isotope and filter
  $(window).on('load', function () {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function () {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });

  });

  // Diploma new ----------------------------------------------------------------------------------------

  // Diplomas isotope and filter
  $(window).on('load', function () {
    var diplomasIsotope = $('.diplomas-container').isotope({
      itemSelector: '.diplomas-item',
      layoutMode: 'fitRows'
    });

    $('#diplomas-flters li').on('click', function () {
      $("#diplomas-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      diplomasIsotope.isotope({
        filter: $(this).data('filter')
      });
    });

  });


  // Initiate venobox (lightbox feature used in portofilo)
  $(document).ready(function () {
    $('.venobox').venobox();
  });

})(jQuery);