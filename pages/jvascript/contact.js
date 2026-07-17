function initContactPage() {
  const form = document.getElementById('contactForm');
  const greeting = document.getElementById('contactGreeting');
  const clock = document.getElementById('contactClock');
  const progressFill = document.getElementById('progressFill');
  const supportMessages = document.getElementById('supportMessages');
  const supportInput = document.getElementById('supportInput');
  const supportSend = document.getElementById('supportSend');
  const themeBtn = document.getElementById('themeBtn');

  function updateClock() {
    const now = new Date();
    const hour = now.getHours();
    greeting.textContent = hour < 12 ? 'Good morning, friend' : hour < 18 ? 'Good afternoon, friend' : 'Good evening, friend';
    clock.textContent = now.toLocaleTimeString();
  }
  updateClock();
  setInterval(updateClock, 1000);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const entries = JSON.parse(localStorage.getItem('pet_paradise_messages') || '[]');
    entries.push({
      name: document.getElementById('nameInput').value,
      email: document.getElementById('emailInput').value,
      message: document.getElementById('messageInput').value
    });
    localStorage.setItem('pet_paradise_messages', JSON.stringify(entries));
    form.reset();
    showToast('Message sent');
  });

  document.querySelectorAll('#nameInput, #emailInput, #messageInput').forEach((input) => {
    input.addEventListener('input', () => {
      const filled = [document.getElementById('nameInput').value, document.getElementById('emailInput').value, document.getElementById('messageInput').value].filter(Boolean).length;
      progressFill.style.width = `${(filled / 3) * 100}%`;
    });
  });

  supportSend.addEventListener('click', () => {
    const value = supportInput.value.trim();
    if (!value) return;
    supportMessages.innerHTML += `<div class="info-card"><p>You: ${value}</p></div>`;
    supportMessages.innerHTML += `<div class="info-card"><p>Support: We can help you find a pet that fits your routine.</p></div>`;
    supportInput.value = '';
  });

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('pet_paradise_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
}

initContactPage();
