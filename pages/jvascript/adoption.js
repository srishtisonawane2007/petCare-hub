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
  favorites: JSON.parse(localStorage.getItem('pet_paradise_favorites') || '[]')
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

function initAdoptionPage() {
  const grid = document.getElementById('adoptGrid');
  const searchBox = document.getElementById('adoptSearch');
  const filterBox = document.getElementById('adoptFilter');
  const sortBox = document.getElementById('sortSelect');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const voiceBtn = document.getElementById('voiceBtn');
  const speakBtn = document.getElementById('speakBtn');
  const compareBtn = document.getElementById('compareBtn');
  const compareBox = document.getElementById('compareBox');
  const stepper = document.getElementById('stepper');
  const formPanel = document.getElementById('formPanel');
  const uploadInput = document.getElementById('uploadInput');
  const dropZone = document.getElementById('dropZone');
  const previewImg = document.getElementById('previewImg');
  const qrCard = document.getElementById('qrCard');
  const qrBtn = document.getElementById('qrBtn');
  const modalBox = document.getElementById('modalBox');
  const modalContent = document.getElementById('modalContent');
  const closeModal = document.getElementById('closeModal');

  let visibleCount = 4;
  let compareList = [];
  let step = 0;
  let recognition;

  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      searchBox.value = event.results[0][0].transcript;
      renderPets();
      showToast('Voice search applied');
    };
  }

  function renderPets() {
    const query = searchBox.value.toLowerCase();
    const filter = filterBox.value;
    let list = pets.filter((pet) => {
      const matchQuery = pet.name.toLowerCase().includes(query) || pet.breed.toLowerCase().includes(query);
      const matchFilter = filter === 'all' || pet.category === filter;
      return matchQuery && matchFilter;
    });
    if (sortBox.value === 'age') list.sort((a, b) => a.age - b.age);
    if (sortBox.value === 'za') list.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBox.value === 'az') list.sort((a, b) => a.name.localeCompare(b.name));

    const visible = list.slice(0, visibleCount);
    grid.innerHTML = visible.map((pet) => `
      <article class="pet-card">
        <img src="${pet.image}" alt="${pet.name}" loading="lazy" />
        <div class="meta"><strong>${pet.name}</strong><span>${pet.category}</span></div>
        <p>${pet.breed} • ${pet.age} years</p>
        <p>${pet.info}</p>
        <div class="hero-actions">
          <button class="btn secondary" data-fav="${pet.id}">${state.favorites.includes(pet.id) ? '♥ Saved' : '♡ Save'}</button>
          <button class="btn primary" data-adopt="${pet.id}">Adopt</button>
          <button class="btn secondary" data-compare="${pet.id}">Compare</button>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('[data-fav]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.fav);
        state.favorites = state.favorites.includes(id) ? state.favorites.filter((item) => item !== id) : [...state.favorites, id];
        localStorage.setItem('pet_paradise_favorites', JSON.stringify(state.favorites));
        renderPets();
        showToast('Favorite updated');
      });
    });
    grid.querySelectorAll('[data-adopt]').forEach((button) => {
      button.addEventListener('click', () => openModal(Number(button.dataset.adopt)));
    });
    grid.querySelectorAll('[data-compare]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.compare);
        if (!compareList.includes(id)) compareList = [...compareList, id].slice(-2);
        renderCompare();
        showToast('Added to compare list');
      });
    });
  }

  function renderCompare() {
    if (!compareList.length) {
      compareBox.innerHTML = '<div class="info-card">Select up to two pets to compare.</div>';
      return;
    }
    compareBox.innerHTML = compareList.map((id) => {
      const pet = pets.find((item) => item.id === id);
      return `<div class="info-card"><h3>${pet.name}</h3><p>${pet.breed}</p><p>${pet.info}</p></div>`;
    }).join('');
  }

  function openModal(petId) {
    const pet = pets.find((item) => item.id === petId);
    modalContent.innerHTML = `<h3>${pet.name} adoption request</h3><p>${pet.info}</p>`;
    modalBox.classList.add('open');
    renderForm(0);
  }

  function renderForm(nextStep) {
    step = nextStep;
    const steps = ['Details', 'Address', 'Review'];
    stepper.innerHTML = steps.map((label, index) => `<span class="step-dot ${index === step ? 'active' : ''}"></span>`).join('');
    formPanel.innerHTML = `
      <h3>${steps[step]}</h3>
      ${step === 0 ? '<input placeholder="Your name" /><input placeholder="Email" />' : step === 1 ? '<input placeholder="Address" /><input placeholder="Preferred visit" />' : '<p>Thanks! We will contact you soon.</p>'}
      <div class="hero-actions">
        ${step > 0 ? '<button class="btn secondary" id="prevBtn">Back</button>' : ''}
        ${step < steps.length - 1 ? '<button class="btn primary" id="nextBtn">Next</button>' : '<button class="btn primary" id="submitBtn">Submit</button>'}
      </div>
    `;
    document.getElementById('nextBtn')?.addEventListener('click', () => renderForm(step + 1));
    document.getElementById('prevBtn')?.addEventListener('click', () => renderForm(step - 1));
    document.getElementById('submitBtn')?.addEventListener('click', () => {
      modalBox.classList.remove('open');
      showToast('Adoption request sent');
    });
  }

  searchBox.addEventListener('input', renderPets);
  filterBox.addEventListener('change', renderPets);
  sortBox.addEventListener('change', renderPets);
  loadMoreBtn.addEventListener('click', () => {
    visibleCount += 2;
    renderPets();
  });
  voiceBtn.addEventListener('click', () => recognition?.start());
  speakBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance('Buddy is vaccinated and ready for adoption.');
    window.speechSynthesis.speak(utterance);
  });
  compareBtn.addEventListener('click', () => showToast('Comparison ready'));
  closeModal.addEventListener('click', () => modalBox.classList.remove('open'));
  modalBox.addEventListener('click', (event) => {
    if (event.target === modalBox) modalBox.classList.remove('open');
  });

  uploadInput.addEventListener('change', (event) => previewImage(event.target.files[0]));
  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('active');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));
  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('active');
    previewImage(event.dataTransfer.files[0]);
  });
  function previewImage(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => previewImg.src = reader.result;
    reader.readAsDataURL(file);
  }
  qrBtn.addEventListener('click', () => {
    const qrText = encodeURIComponent('Pet Paradise Adoption Profile');
    qrCard.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrText}" alt="QR code" />`;
    showToast('QR ready');
  });

  renderPets();
  renderCompare();
}

initAdoptionPage();
