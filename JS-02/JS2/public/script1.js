document.addEventListener('DOMContentLoaded', function() {
    const nombreUsuarioInput = document.getElementById('nombreUsuarioInput');
    const guardarNombreBtn = document.getElementById('guardarNombreBtn');
    const mensajeError = document.getElementById('mensajeError');
    const entradaNombreContainer = document.getElementById('entradaNombreContainer');
    const seleccionJuegosContainer = document.getElementById('seleccionJuegosContainer');
    const nombreUsuarioDisplay = document.getElementById('nombreUsuarioDisplay');
    const saludoUsuarioNav = document.getElementById('saludoUsuarioNav');
    
    const logoutDesktopBtn = document.getElementById('logoutDesktopBtn');
    const logoutMenuLink = document.getElementById('logoutMenuLink');
    const logoutMenuItem = document.querySelector('.logout-menu-item');

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    const NOMBRE_STORAGE_KEY = 'nombreUsuarioGlobalJuegos';

    function handleLogout() {
        localStorage.removeItem(NOMBRE_STORAGE_KEY);
        cargarEstadoNombre();
        if (navLinks && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('open');
            const isExpanded = navLinks.classList.contains('open');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    function cargarEstadoNombre() {
        const nombreGuardado = localStorage.getItem(NOMBRE_STORAGE_KEY);
        if (nombreGuardado) {
            if (nombreUsuarioDisplay) nombreUsuarioDisplay.textContent = nombreGuardado;
            if (saludoUsuarioNav) saludoUsuarioNav.textContent = `Hola, ${nombreGuardado}`;
            
            if (logoutDesktopBtn) logoutDesktopBtn.classList.remove('hidden');
            if (logoutMenuItem) logoutMenuItem.classList.remove('hidden');
            
            if (entradaNombreContainer) entradaNombreContainer.classList.add('hidden');
            if (seleccionJuegosContainer) seleccionJuegosContainer.classList.remove('hidden');
        } else {
            if (saludoUsuarioNav) saludoUsuarioNav.textContent = "";
            
            if (logoutDesktopBtn) logoutDesktopBtn.classList.add('hidden');
            if (logoutMenuItem) logoutMenuItem.classList.add('hidden');
            
            if (entradaNombreContainer) entradaNombreContainer.classList.remove('hidden');
            if (seleccionJuegosContainer) seleccionJuegosContainer.classList.add('hidden');
            if (nombreUsuarioInput) {
                nombreUsuarioInput.value = '';
                nombreUsuarioInput.focus();
            }
        }
    }

    if (guardarNombreBtn) {
        guardarNombreBtn.addEventListener('click', function() {
            const nombre = nombreUsuarioInput.value.trim();
            if (nombre === "") {
                mensajeError.textContent = "Por favor, ingresa tu nombre.";
                if (nombreUsuarioInput) nombreUsuarioInput.focus();
            } else if (nombre.length < 2) {
                mensajeError.textContent = "El nombre debe tener al menos 2 caracteres.";
                if (nombreUsuarioInput) nombreUsuarioInput.focus();
            }
            else {
                localStorage.setItem(NOMBRE_STORAGE_KEY, nombre);
                mensajeError.textContent = "";
                cargarEstadoNombre();
            }
        });
    }

    if (logoutDesktopBtn) {
        logoutDesktopBtn.addEventListener('click', handleLogout);
    }
    if (logoutMenuLink) {
        logoutMenuLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    if (document.body.contains(entradaNombreContainer) || document.body.contains(seleccionJuegosContainer)) {
        cargarEstadoNombre();
    }
});

function verificarNombreUsuario(paginaActual) {
    const nombreGuardado = localStorage.getItem('nombreUsuarioGlobalJuegos');
    const saludoUsuarioNav = document.getElementById('saludoUsuarioNav');
    const nombreUsuarioDisplayPage = document.getElementById('nombreUsuarioDisplayPage');
    
    const logoutDesktopBtn = document.getElementById('logoutDesktopBtn');
    const logoutMenuItem = document.querySelector('.logout-menu-item');


    if (nombreGuardado) {
        if (saludoUsuarioNav) saludoUsuarioNav.textContent = `Hola, ${nombreGuardado}`;
        if (logoutDesktopBtn) logoutDesktopBtn.classList.remove('hidden');
        if (logoutMenuItem) logoutMenuItem.classList.remove('hidden');
        if (nombreUsuarioDisplayPage) nombreUsuarioDisplayPage.textContent = nombreGuardado;
        return nombreGuardado;
    } else {
        if (saludoUsuarioNav) saludoUsuarioNav.textContent = "";
        if (logoutDesktopBtn) logoutDesktopBtn.classList.add('hidden');
        if (logoutMenuItem) logoutMenuItem.classList.add('hidden');

        const esPaginaInicio = window.location.pathname.endsWith('index1.html') || 
                               window.location.pathname === '/' || 
                               window.location.pathname.endsWith('/index.html');
        
        if (!esPaginaInicio) {
            alert("No se encontró un nombre de usuario. Serás redirigido a la página principal para ingresarlo.");
            window.location.href = 'index1.html';
        }
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const esPaginaDeJuegoOIndex = !document.getElementById('entradaNombreContainer') || 
                                 (document.getElementById('entradaNombreContainer') && !document.getElementById('entradaNombreContainer').classList.contains('hidden'));

    if (!document.getElementById('guardarNombreBtn')) { // Asumimos que si no está el botón guardar, no es la página de login activa
        verificarNombreUsuario(window.location.pathname);
        
        const logoutDesktopBtnGlobal = document.getElementById('logoutDesktopBtn');
        const logoutMenuLinkGlobal = document.getElementById('logoutMenuLink');
        
        function handleGlobalLogout(e) {
            if(e) e.preventDefault();
            localStorage.removeItem('nombreUsuarioGlobalJuegos');
            window.location.href = 'index1.html';
        }

        if (logoutDesktopBtnGlobal && localStorage.getItem('nombreUsuarioGlobalJuegos')) {
            logoutDesktopBtnGlobal.addEventListener('click', handleGlobalLogout);
        }
        if (logoutMenuLinkGlobal && localStorage.getItem('nombreUsuarioGlobalJuegos')) {
            logoutMenuLinkGlobal.addEventListener('click', handleGlobalLogout);
        }
    }
});