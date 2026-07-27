document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('loginScreen');
  const registerScreen = document.getElementById('registerScreen');
  const forgotScreen = document.getElementById('forgotScreen');
  const mainAppScreen = document.getElementById('mainAppScreen');

  const toRegisterBtn = document.getElementById('toRegisterBtn');
  const toForgotBtn = document.getElementById('toForgotBtn');
  const backToLoginFromReg = document.getElementById('backToLoginFromReg');
  const backToLoginFromForgot = document.getElementById('backToLoginFromForgot');
  const logoutBtn = document.getElementById('logoutBtn');
  const settingsBtn = document.getElementById('settingsBtn');

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const forgotForm = document.getElementById('forgotForm');

  function showScreen(screen) {
    loginScreen.classList.add('hidden');
    registerScreen.classList.add('hidden');
    forgotScreen.classList.add('hidden');
    mainAppScreen.classList.add('hidden');

    screen.classList.remove('hidden');
  }

  // Navigation
  toRegisterBtn.addEventListener('click', () => showScreen(registerScreen));
  toForgotBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen(forgotScreen);
  });
  backToLoginFromReg.addEventListener('click', () => showScreen(loginScreen));
  backToLoginFromForgot.addEventListener('click', () => showScreen(loginScreen));

  // Connexion -> Affiche l'application complète
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showScreen(mainAppScreen);
  });

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Compte créé avec succès !');
    showScreen(mainAppScreen);
  });

  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Code envoyé par SMS.');
    showScreen(loginScreen);
  });

  logoutBtn.addEventListener('click', () => showScreen(loginScreen));
  settingsBtn.addEventListener('click', () => alert('Paramètres de l\'application'));
});
