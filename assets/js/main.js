/**
 * Sam Kafai - Portfolio
 * Clean, modern JavaScript for portfolio functionality
 */

(function() {
  'use strict';

  // ============================================
  // Theme System
  // ============================================
  const ThemeManager = {
    init() {
      this.toggle = document.getElementById('theme-toggle');
      this.setInitialTheme();
      this.bindEvents();
    },

    getPreferredTheme() {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    },

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    },

    setInitialTheme() {
      this.setTheme(this.getPreferredTheme());
    },

    bindEvents() {
      if (this.toggle) {
        this.toggle.addEventListener('click', () => {
          const current = document.documentElement.getAttribute('data-theme');
          this.setTheme(current === 'dark' ? 'light' : 'dark');
        });
      }

      // Listen for OS theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  };

  // ============================================
  // Navigation
  // ============================================
  const Navigation = {
    init() {
      this.nav = document.querySelector('.nav');
      this.toggle = document.querySelector('.nav-toggle');
      this.menu = document.querySelector('.nav-menu');
      this.links = document.querySelectorAll('.nav-link');
      
      this.bindEvents();
    },

    bindEvents() {
      // Scroll effect
      window.addEventListener('scroll', () => this.handleScroll());
      
      // Mobile toggle
      if (this.toggle) {
        this.toggle.addEventListener('click', () => this.toggleMobile());
      }

      // Close mobile menu on link click
      this.links.forEach(link => {
        link.addEventListener('click', () => {
          document.body.classList.remove('mobile-nav-active');
        });
      });

      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) {
            const offset = 80;
            const top = target.offsetTop - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        });
      });
    },

    handleScroll() {
      if (window.scrollY > 50) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    },

    toggleMobile() {
      document.body.classList.toggle('mobile-nav-active');
    }
  };

  // ============================================
  // Neural Network Background
  // ============================================
  const NeuralNetwork = {
    init() {
      this.canvas = document.getElementById('neural-network-bg');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.nodes = [];
      this.time = 0;
      
      this.resize();
      this.createNodes();
      this.animate();
      
      window.addEventListener('resize', () => this.resize());
    },

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
      this.createNodes();
    },

    createNodes() {
      this.nodes = [];
      const count = Math.min(50, Math.floor((this.width * this.height) / 25000));
      
      for (let i = 0; i < count; i++) {
        this.nodes.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          radius: Math.random() * 1.5 + 1,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          ampX: Math.random() * 0.25 + 0.1,
          ampY: Math.random() * 0.25 + 0.1,
          freqX: Math.random() * 0.0006 + 0.0003,
          freqY: Math.random() * 0.0006 + 0.0003
        });
      }
    },

    getColors() {
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'light') {
        return {
          bg: '#dfe2e6',
          node: 'rgba(74, 158, 181, 0.4)',
          line: 'rgba(74, 158, 181, 0.06)'
        };
      }
      return {
        bg: '#141824',
        node: 'rgba(110, 200, 217, 0.4)',
        line: 'rgba(110, 200, 217, 0.06)'
      };
    },

    update() {
      this.time += 16;
      
      this.nodes.forEach(node => {
        // Organic drift
        const driftX = Math.sin(this.time * node.freqX + node.phaseX) * node.ampX;
        const driftY = Math.cos(this.time * node.freqY + node.phaseY) * node.ampY;
        
        node.x += node.vx + driftX;
        node.y += node.vy + driftY;
        
        // Soft boundaries
        if (node.x < 0 || node.x > this.width) node.vx *= -0.8;
        if (node.y < 0 || node.y > this.height) node.vy *= -0.8;
        
        node.x = Math.max(0, Math.min(this.width, node.x));
        node.y = Math.max(0, Math.min(this.height, node.y));
      });
    },

    draw() {
      const colors = this.getColors();
      
      this.ctx.fillStyle = colors.bg;
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      // Draw connections
      const maxDist = 130;
      this.ctx.strokeStyle = colors.line;
      this.ctx.lineWidth = 1;
      
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const dx = this.nodes[i].x - this.nodes[j].x;
          const dy = this.nodes[i].y - this.nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < maxDist) {
            this.ctx.globalAlpha = (1 - dist / maxDist) * 0.6;
            this.ctx.beginPath();
            this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
            this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
            this.ctx.stroke();
          }
        }
      }
      
      this.ctx.globalAlpha = 1;
      
      // Draw nodes
      this.ctx.fillStyle = colors.node;
      this.nodes.forEach(node => {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fill();
      });
    },

    animate() {
      this.update();
      this.draw();
      requestAnimationFrame(() => this.animate());
    }
  };

  // ============================================
  // Footer Year
  // ============================================
  const Footer = {
    init() {
      const yearEl = document.querySelector('.footer-year');
      if (yearEl) {
        yearEl.textContent = `© ${new Date().getFullYear()}`;
      }
    }
  };

  // ============================================
  // Initialize
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    Navigation.init();
    NeuralNetwork.init();
    Footer.init();
  });

})();
