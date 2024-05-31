document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById("overlay");
    const welcomeMessage = document.getElementById("welcome-message");

    // Esperar a que la animación termine
    welcomeMessage.addEventListener("animationend", function() {
        overlay.style.opacity = '0';

        
        setTimeout(function() {
            overlay.style.display = 'none';
        }, 800); // Duración de la transición en milisegundos
    });

    const togglePassword = document.querySelector("#togglePassword");
    const password = document.querySelector("#password");

    togglePassword.addEventListener("click", function () {
        
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type);

        
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });
   
});



