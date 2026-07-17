const petImages = {
  buddy: 'images/image1.jpg',
  mittens: 'images/bb.jpg',
  charlie: 'images/image_beagle.jpg',
  luna: 'images/ss.jpg',
  polly: 'images/image_beagle.jpg',
  max: 'images/bb.jpg'
};

const pets = [
  { id: 1, name: 'Buddy', breed: 'Golden Retriever', age: 2, category: 'dog', image: petImages.buddy, info: 'Friendly and energetic.' },
  { id: 2, name: 'Mittens', breed: 'Persian', age: 3, category: 'cat', image: petImages.mittens, info: 'Calm and cuddly.' },
  { id: 3, name: 'Charlie', breed: 'Beagle', age: 1, category: 'dog', image: petImages.charlie, info: 'Playful and curious.' },
  { id: 4, name: 'Luna', breed: 'Siamese', age: 4, category: 'cat', image: petImages.luna, info: 'Bright and affectionate.' },
  { id: 5, name: 'Polly', breed: 'Cockatiel', age: 1, category: 'bird', image: petImages.polly, info: 'Cheerful and social.' },
  { id: 6, name: 'Max', breed: 'Labrador', age: 5, category: 'dog', image: petImages.max, info: 'Loyal and dependable.' }
];

const state = {
  favorites: JSON.parse(localStorage.getItem('pet_paradise_favorites') || '[]'),
  recent: JSON.parse(localStorage.getItem('pet_paradise_recent') || '[]')
};

function showToast(message) {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  stack.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

function initHomePage() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const searchBtn = document.getElementById('searchBtn');
  const resultCount = document.getElementById('resultCount');
  const liveStatus = document.getElementById('liveStatus');
  const featuredPets = document.getElementById('featuredPets');
  const timelineList = document.getElementById('timelineList');
  const faqList = document.getElementById('faqList');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const weatherCity = document.getElementById('weatherCity');
  const weatherInfo = document.getElementById('weatherInfo');
  const weatherIcon = document.getElementById('weatherIcon');
  const typingText = document.getElementById('typingText');
  const counters = document.querySelectorAll('[data-count]');
  const randomPetBtn = document.getElementById('randomPetBtn');
  const themeBtn = document.getElementById('themeBtn');

  function renderFeaturedPets(filter = '') {
    const filtered = pets.filter((pet) => {
      const query = filter.toLowerCase();
      return pet.name.toLowerCase().includes(query) || pet.breed.toLowerCase().includes(query);
    });
    featuredPets.innerHTML = filtered.slice(0, 3).map((pet) => `
      <article class="pet-card">
        <img src="${pet.image}" alt="${pet.name}" loading="lazy" />
        <div class="meta"><strong>${pet.name}</strong><span>${pet.category}</span></div>
        <p>${pet.breed} • ${pet.age} years</p>
        <p>${pet.info}</p>
        <div class="hero-actions">
          <button class="btn secondary" data-fav="${pet.id}">${state.favorites.includes(pet.id) ? '♥ Saved' : '♡ Save'}</button>
          <a class="btn primary" href="pet_details.html?pet=${pet.id}">View</a>
        </div>
      </article>
    `).join('');
    featuredPets.querySelectorAll('[data-fav]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.fav);
        state.favorites = state.favorites.includes(id) ? state.favorites.filter((item) => item !== id) : [...state.favorites, id];
        localStorage.setItem('pet_paradise_favorites', JSON.stringify(state.favorites));
        renderFeaturedPets(searchInput.value);
        showToast('Favorite updated');
      });
    });
  }

  function renderTimeline() {
    const items = [
      'Reminder set for vaccination day',
      'New pet profile created',
      'Favorites saved for later review'
    ];
    timelineList.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
  }

  function renderFaq() {
    const faqs = [
      { question: 'How does adoption work?', answer: 'Choose a pet, contact the shelter, and complete the simple form.' },
      { question: 'Are pets vaccinated?', answer: 'Most featured pets are vaccinated and ready for a loving home.' },
      { question: 'Can I save favorites?', answer: 'Yes, favorites stay saved in your browser.' }
    ];
    faqList.innerHTML = faqs.map((item) => `
      <details class="info-card">
        <summary>${item.question}</summary>
        <p>${item.answer}</p>
      </details>
    `).join('');
  }

  function animateCounters() {
    counters.forEach((counter, index) => {
      const target = Number(counter.dataset.count);
      let value = 0;
      const timer = setInterval(() => {
        value += Math.max(1, Math.floor(target / 20));
        counter.textContent = value >= target ? target : value;
        if (value >= target) clearInterval(timer);
      }, 60 + index * 25);
    });
  }

  function updateWeather() {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=19.09&longitude=74.74&current_weather=true')
      .then((response) => response.json())
      .then((data) => {
        const temp = data.current_weather?.temperature ?? '29';
        weatherCity.textContent = 'Ahmednagar';
        weatherInfo.textContent = `${temp}°C • Great day for a walk.`;
        weatherIcon.textContent = '☀️';
      })
      .catch(() => {
        weatherCity.textContent = 'Ahmednagar';
        weatherInfo.textContent = '29°C • Perfect day for a stroll.';
        weatherIcon.textContent = '🌤️';
      });
  }

  function initChat() {
    chatMessages.innerHTML = '<div class="info-card"><p>Hi! I can help you choose the perfect pet.</p></div>';
    chatSend.addEventListener('click', () => {
      const text = chatInput.value.trim();
      if (!text) return;
      chatMessages.innerHTML += `<div class="info-card"><p>You: ${text}</p></div>`;
      const reply = text.includes('dog') ? 'A lively Labrador can be a great match.' : 'A calm cat or a friendly bird may suit your home.';
      chatMessages.innerHTML += `<div class="info-card"><p>Bot: ${reply}</p></div>`;
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  function typeLoop() {
    const words = ['perfect companion', 'best friend', 'forever family'];
    let index = 0;
    let char = 0;
    let deleteMode = false;
    const tick = () => {
      const word = words[index];
      typingText.textContent = deleteMode ? word.substring(0, char--) : word.substring(0, char++);
      if (!deleteMode && char > word.length) {
        deleteMode = true;
        setTimeout(tick, 1200);
        return;
      }
      if (deleteMode && char < 0) {
        deleteMode = false;
        index = (index + 1) % words.length;
      }
      setTimeout(tick, deleteMode ? 80 : 120);
    };
    tick();
  }

  searchInput.addEventListener('input', () => {
    const value = searchInput.value.trim().toLowerCase();
    liveStatus.textContent = value ? `Showing pets matching “${value}”` : 'Type away to find a match';
    resultCount.textContent = `${pets.filter((pet) => pet.name.toLowerCase().includes(value) || pet.breed.toLowerCase().includes(value)).length} pets`;
    renderFeaturedPets(value);
  });
  searchBtn.addEventListener('click', () => showToast('Search updated'));
  categoryFilter.addEventListener('change', () => showToast('Category filter applied'));
  randomPetBtn.addEventListener('click', () => {
    const random = pets[Math.floor(Math.random() * pets.length)];
    showToast(`Surprise pick: ${random.name}`);
  });
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('pet_paradise_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'f' && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      searchInput.focus();
    }
  });

  renderFeaturedPets('');
  renderTimeline();
  renderFaq();
  animateCounters();
  updateWeather();
  initChat();
  typeLoop();
}

initHomePage();
