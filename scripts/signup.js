import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('user signed up:', user);
      // TODO: redirect or update UI
      window.location.href = '/';
    })
    .catch((error) => {
      const errorMessage = error.message;
      document.getElementById('signup-error').textContent = errorMessage;
    });
});