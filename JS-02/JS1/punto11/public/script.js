document.getElementById("formulario").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const numerosInput = document.getElementById("numeros").value.trim();
    const palabrasInput = document.getElementById("palabras").value.trim();
    const usuariosInput = document.getElementById("usuarios").value.trim();
  
    const errorNumeros = document.getElementById("errorNumeros");
    const errorPalabras = document.getElementById("errorPalabras");
    const errorUsuarios = document.getElementById("errorUsuarios");
    const tablaResultados = document.getElementById("tablaResultados");
  
    errorNumeros.textContent = "";
    errorPalabras.textContent = "";
    errorUsuarios.textContent = "";
    tablaResultados.innerHTML = "";
  
    let error = false;
  
    // Validar números
    const numeros = numerosInput.split(",").map(n => n.trim());
    const numerosValidos = [];
  
    for (const n of numeros) {
      const num = parseFloat(n);
      if (isNaN(num)) {
        errorNumeros.textContent = `"${n}" no es un número válido.`;
        error = true;
        break;
      }
      if (num <= 10) {
        errorNumeros.textContent = `El número "${num}" es menor o igual a 10.`;
        error = true;
        break;
      }
      numerosValidos.push(num);
    }
  
    // Validar palabras
    const palabras = palabrasInput.split(",").map(p => p.trim());
    const palabrasValidas = [];
  
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;
  
    for (const p of palabras) {
      if (!regexLetras.test(p)) {
        errorPalabras.textContent = `"${p}" contiene caracteres no válidos.`;
        error = true;
        break;
      }
      if (p.length < 5) {
        errorPalabras.textContent = `"${p}" tiene menos de 5 letras.`;
        error = true;
        break;
      }
      palabrasValidas.push(p);
    }
  
    // Validar y parsear usuarios
    const usuariosText = usuariosInput.split(",").map(u => u.trim());
    const usuarios = [];
  
    for (const u of usuariosText) {
      const [nombre, estado] = u.split(":");
      const estadoNormalizado = estado?.trim().toLowerCase();
  
      if (!nombre || !estado || !["activo", "desactivo"].includes(estadoNormalizado)) {
        errorUsuarios.textContent = `"${u}" no tiene un formato válido (nombre:activo/desactivo).`;
        error = true;
        break;
      }
  
      usuarios.push({
        nombre: nombre.trim(),
        activo: estadoNormalizado === "activo",
      });
    }
  
    if (error) return;
  
    const usuariosActivos = usuarios.filter(u => u.activo);
  
    // Crear tabla
    let html = "<table border='1' cellpadding='8' cellspacing='0'><thead><tr><th>Números > 10</th><th>Palabras (≥ 5 letras)</th><th>Usuarios Activos</th></tr></thead><tbody>";
  
    const filas = Math.max(numerosValidos.length, palabrasValidas.length, usuariosActivos.length);
    for (let i = 0; i < filas; i++) {
      html += "<tr>";
      html += `<td>${numerosValidos[i] !== undefined ? numerosValidos[i] : ""}</td>`;
      html += `<td>${palabrasValidas[i] !== undefined ? palabrasValidas[i] : ""}</td>`;
      html += `<td>${usuariosActivos[i] !== undefined ? usuariosActivos[i].nombre : ""}</td>`;
      html += "</tr>";
    }
  
    html += "</tbody></table>";
    tablaResultados.innerHTML = html;
  });