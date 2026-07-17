const petImages = {
  buddy: 'images/image1.jpg',
  mittens: 'images/bb.jpg',
  charlie: 'images/image_beagle.jpg',
  luna: 'images/ss.jpg',
  polly: 'images/image_beagle.jpg',
  max: 'images/bb.jpg'
};

const pets = [
  { id: 1, name: 'Buddy', breed: 'Golden Retriever', age: 2, category: 'dog', image: petImages.buddy, info: 'Friendly and energetic.', traits: ['Loves walks', 'Great with kids', 'Vaccinated'] },
  { id: 2, name: 'Mittens', breed: 'Persian', age: 3, category: 'cat', image: petImages.mittens, info: 'Calm and cuddly.', traits: ['Indoor only', 'Calm', 'Affectionate'] },
  { id: 3, name: 'Charlie', breed: 'Beagle', age: 1, category: 'dog', image: petImages.charlie, info: 'Playful and curious.', traits: ['Small space friendly', 'Easy to train', 'Healthy'] },
  { id: 4, name: 'Luna', breed: 'Siamese', age: 4, category: 'cat', image: petImages.luna, info: 'Bright and affectionate.', traits: ['Talkative', 'Gentle', 'Vaccinated'] },
  { id: 5, name: 'Polly', breed: 'Cockatiel', age: 1, category: 'bird', image: petImages.polly, info: 'Cheerful and social.', traits: ['Social', 'Small space friendly', 'Fun companion'] },
  { id: 6, name: 'Max', breed: 'Labrador', age: 5, category: 'dog', image: petImages.max, info: 'Loyal and dependable.', traits: ['Trusted', 'Very gentle', 'Well trained'] }
];

const state = {
  bookmarks: JSON.parse(localStorage.getItem('pet_paradise_bookmarks') || '[]')
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

function initPetDetailsPage() {
  const title = document.getElementById('detailTitle');
  const image = document.getElementById('detailImage');
  const text = document.getElementById('detailText');
  const ratingBox = document.getElementById('ratingBox');
  const bookmarkBtn = document.getElementById('bookmarkBtn');
  const checklist = document.getElementById('checklist');
  const timeline = document.getElementById('detailTimeline');
  const themeBtn = document.getElementById('themeBtn');
  const params = new URLSearchParams(window.location.search);
  const petId = Number(params.get('pet')) || 1;
  const pet = pets.find((item) => item.id === petId) || pets[0];

  title.textContent = `${pet.name} • ${pet.breed}`;
  image.innerHTML = `<img src="${pet.image}" alt="${pet.name}" />`;
  text.innerHTML = `<strong>${pet.name}</strong><br>${pet.info}<br><br>Traits: ${pet.traits.join(', ')}`;
  ratingBox.innerHTML = '⭐'.repeat(4) + '☆';
  checklist.innerHTML = pet.traits.map((trait) => `<li>${trait}</li>`).join('');
  timeline.innerHTML = `<div class="info-card"><p>Morning walk completed</p><p>Feeding schedule updated</p><p>Health note reviewed</p></div>`;

  bookmarkBtn.addEventListener('click', () => {
    if (state.bookmarks.includes(pet.id)) {
      state.bookmarks = state.bookmarks.filter((id) => id !== pet.id);
      showToast('Bookmark removed');
    } else {
      state.bookmarks.push(pet.id);
      showToast('Bookmark saved');
    }
    localStorage.setItem('pet_paradise_bookmarks', JSON.stringify(state.bookmarks));
  });

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('pet_paradise_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
}

initPetDetailsPage();
