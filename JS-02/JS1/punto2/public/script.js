// script.js
// Archivo único que consolida:
// - Proyectos 1–6 (manipulación DOM, eventos, contar hijos, enlaces, innerHTML, initForm)
// - Ejercicio push()
// - Ejercicio pop()
// Está organizado en secciones comentadas para facilitar su extensión en proyectos futuros.

/* =========================================================================
   PROYECTO 1: Manipulación básica del DOM
   ========================================================================= */
   let titulo1 = null;
   let colorIndex1 = 0;
   const colores1 = ['black', 'blue', 'red'];
   
   function agregaH1() {
     const cont = document.getElementById('contenedor1');
     if (!cont) return;
     if (!titulo1) {
       titulo1 = document.createElement('h1');
       titulo1.id = 'titulo1';
       cont.appendChild(titulo1);
     }
     titulo1.textContent = 'Hola DOM';
     colorIndex1 = 0;
     titulo1.style.color = colores1[colorIndex1];
   }
   
   function cambiaTexto() {
     if (titulo1) titulo1.textContent = 'Chau DOM';
   }
   
   function cambiaColor() {
     if (titulo1) {
       colorIndex1 = (colorIndex1 + 1) % colores1.length;
       titulo1.style.color = colores1[colorIndex1];
     }
   }
   
   let img1SrcIndex = 0;
   const img1Urls = [
     'https://i0.wp.com/automundo.com.ar/...GT-63-PRO.jpg',
     'https://www.romadridcar.com/...-ford-gt-1600x900.jpg'
   ];
   
   function agregaImagen() {
     const cont = document.getElementById('contenedor1');
     if (!cont) return;
     let img = document.getElementById('imagen1');
     if (!img) {
       img = document.createElement('img');
       img.id = 'imagen1';
       img.style.width = '150px';
       cont.appendChild(img);
     }
     img.src = img1Urls[img1SrcIndex];
   }
   
   function cambiaImagen1() {
     const img = document.getElementById('imagen1');
     if (!img) return;
     img1SrcIndex = (img1SrcIndex + 1) % img1Urls.length;
     img.src = img1Urls[img1SrcIndex];
   }
   
   function cambiaTamano1() {
     const img = document.getElementById('imagen1');
     if (!img) return;
     img.style.width = img.style.width === '300px' ? '150px' : '300px';
   }
   
   /* =========================================================================
      PROYECTO 2: Eventos visuales en botones
      ========================================================================= */
   function aplicaEventoVisual(btnId, evento, estilos, mensaje, resetAfterMs = 0) {
     const btn = document.getElementById(btnId);
     const salida = document.getElementById('salida2');
     if (!btn || !salida) return;
     btn.addEventListener(evento, () => {
       Object.assign(btn.style, estilos);
       salida.textContent = mensaje;
       if (resetAfterMs) {
         setTimeout(() => {
           for (let prop in estilos) btn.style[prop] = '';
         }, resetAfterMs);
       }
     });
   }
   
   /* =========================================================================
      PROYECTO 3: Contar hijos de un contenedor
      ========================================================================= */
   function contarHijos(contenedorId, salidaId) {
     const cont = document.getElementById(contenedorId);
     const salida = document.getElementById(salidaId);
     if (!cont || !salida) return;
     const count = cont.children.length;
     salida.textContent = `#${contenedorId} tiene ${count} hijos`;
   }
   
   /* =========================================================================
      PROYECTO 4: Creación y modificación de enlaces
      ========================================================================= */
   function crearEnlace(texto, url, contenedorId, salidaId) {
     const cont = document.getElementById(contenedorId);
     const salida = document.getElementById(salidaId);
     if (!cont || !salida) return;
     const enlace = document.createElement('a');
     enlace.href = url;
     enlace.textContent = texto;
     enlace.target = '_blank';
     cont.appendChild(enlace);
     salida.textContent = `Creado enlace: texto="${texto}", href="${url}"`;
   }
   
   function modificarAtributos(contenedorId, salidaId) {
     const mapa = {
       'google.com':'bing.com',
       'facebook.com':'instagram.com',
       'twitter.com':'linkedin.com',
       'github.com':'gitlab.com',
       'youtube.com':'vimeo.com'
     };
     const cont = document.getElementById(contenedorId);
     const salida = document.getElementById(salidaId);
     if (!cont || !salida) return;
     cont.querySelectorAll('a').forEach(el => {
       const viejo = el.href;
       let nuevo = viejo;
       for (let dom in mapa) {
         if (nuevo.includes(dom)) {
           nuevo = nuevo.replace(dom, mapa[dom]);
           break;
         }
       }
       if (nuevo === viejo) nuevo = viejo + '?mod=true';
       el.href = nuevo;
       salida.textContent = `Modificado href: "${viejo}" → "${nuevo}"`;
     });
   }
   
   /* =========================================================================
      PROYECTO 5: innerHTML dinámico
      ========================================================================= */
   function agregaParrafo(contenedorId) {
     const cont = document.getElementById(contenedorId);
     if (cont) cont.innerHTML += `<p>Nuevo párrafo dinámico.</p>`;
   }
   
   function agregaLista(contenedorId) {
     const cont = document.getElementById(contenedorId);
     if (cont) cont.innerHTML += `
       <ul>
         <li>Ítem 1</li><li>Ítem 2</li><li>Ítem 3</li>
       </ul>`;
   }
   
   function agregaImagen2(contenedorId) {
     const cont = document.getElementById(contenedorId);
     if (cont) cont.innerHTML += `<img src="https://via.placeholder.com/150" alt="Dinámico">`;
   }
   
   function agregaTarjeta(contenedorId) {
     const cont = document.getElementById(contenedorId);
     if (cont) cont.innerHTML += `
       <div style="border:1px solid #ccc;padding:10px;margin:10px 0;">
         <h3>Título</h3><p>Contenido dinámico.</p>
       </div>`;
   }
   
   function agregaFormulario2(contenedorId) {
     const cont = document.getElementById(contenedorId);
     if (cont) cont.innerHTML += `
       <form style="margin:10px 0;">
         <label>Nombre: <input type="text"></label>
         <button type="submit">OK</button>
       </form>`;
   }
   
   /* =========================================================================
      PROYECTO 6: Integración genérica de formularios
      ========================================================================= */
   function initForm(formId, listaId, endpoint) {
     const form = document.getElementById(formId);
     const ul = document.getElementById(listaId);
     if (!form || !ul) return;
     form.addEventListener('submit', e => {
       e.preventDefault();
       const datos = Object.fromEntries(new FormData(form).entries());
       fetch(endpoint, {
         method: 'POST',
         headers: {'Content-Type':'application/json'},
         body: JSON.stringify(datos)
       })
       .then(() => {
         if (datos.nombre) {
           const li = document.createElement('li');
           li.textContent = datos.nombre;
           ul.appendChild(li);
         }
         form.reset();
       })
       .catch(console.error);
     });
   }
   
   /* =========================================================================
      EJERCICIO push()
      ========================================================================= */
   function setupPushExercises() {
     let frutas = [];
     let amigos = [];
     let numeros = [5, 10, 15];
   
     const outFrutas = document.getElementById('outFrutas');
     const outAmigos = document.getElementById('outAmigos');
     const outNumeros = document.getElementById('outNumeros');
     const errAmigos = document.getElementById('err-amigos');
     const errNumero = document.getElementById('err-nuevoNumero');
   
     if (outNumeros) {
       outNumeros.innerHTML = numeros.map(n => `<div>${n}</div>`).join('');
     }
   
     document.getElementById('btnPushFrutas')?.addEventListener('click', () => {
       frutas = ['Manzana', 'Banana', 'Cereza'];
       outFrutas.innerHTML = frutas.map(f => `<div>${f}</div>`).join('');
     });
   
     document.getElementById('btnPushAmigos')?.addEventListener('click', () => {
       errAmigos.textContent = '';
       const a1 = document.getElementById('amigo1')?.value.trim() || '';
       const a2 = document.getElementById('amigo2')?.value.trim() || '';
       const a3 = document.getElementById('amigo3')?.value.trim() || '';
       if (!a1 || !a2 || !a3) {
         errAmigos.textContent = 'Rellena los tres amigos.';
         return;
       }
       amigos.push(a1, a2, a3);
       outAmigos.innerHTML = amigos.map(a => `<div>${a}</div>`).join('');
     });
   
     document.getElementById('btnPushNumero')?.addEventListener('click', () => {
       errNumero.textContent = '';
       const v = parseFloat(document.getElementById('nuevoNumero')?.value);
       if (isNaN(v)) {
         errNumero.textContent = 'Ingresa número válido.';
         return;
       }
       const ultimo = numeros[numeros.length - 1];
       if (v > ultimo) {
         numeros.push(v);
         outNumeros.innerHTML = numeros.map(n => `<div>${n}</div>`).join('');
       } else {
         errNumero.textContent = `Debe ser > ${ultimo}`;
       }
     });
   }
   
   /* =========================================================================
      EJERCICIO pop()
      ========================================================================= */
// script.js
// Consolidado de todos los ejercicios anteriores y el nuevo pop(), listo para funcionar.

// Espera a que el DOM cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    /* =========================================================================
       EJERCICIO POP()
       ========================================================================= */
  
    // 1) Array de animales inicial
    let animales = ['Perro', 'Gato', 'Elefante', 'Tigre'];
    // 2) Lista de compras inicial
    let compras = ['Pan', 'Leche', 'Huevos', 'Fruta'];
    // 3) Array para vaciar con while()+pop()
    let aVaciar = ['A', 'B', 'C', 'D', 'E'];
  
    // Referencias a los elementos donde mostraremos los datos
    const outAnimales = document.getElementById('outAnimales');
    const outCompras  = document.getElementById('outCompras');
    const outVaciado  = document.getElementById('outVaciado');
    const errCompra   = document.getElementById('err-compra');
  
    // Función utilitaria para renderizar un array en un contenedor con <div>
    function renderArray(arr, container) {
      if (!container) return;
      container.innerHTML = arr.map(item => `<div>${item}</div>`).join('');
    }
  
    // Mostrar los valores iniciales
    renderArray(animales, outAnimales);
    renderArray(compras,  outCompras);
    renderArray(aVaciar,  outVaciado);
  
    // 1) Botón Pop Animales: elimina el último elemento y vuelve a renderizar
    document.getElementById('btnPopAnimales')?.addEventListener('click', () => {
      if (animales.length) {
        animales.pop();
        renderArray(animales, outAnimales);
      }
    });
  
    // 2) Botón Pop Compras: elimina el último, renderiza y muestra mensaje inline
    document.getElementById('btnPopCompras')?.addEventListener('click', () => {
      errCompra.textContent = '';      // limpia mensaje previo
      if (compras.length) {
        const eliminado = compras.pop();
        renderArray(compras, outCompras);
        errCompra.textContent = `Producto eliminado: ${eliminado}`;
      } else {
        errCompra.textContent = 'La lista de compras está vacía.';
      }
    });
  
    // 3) Botón Vaciar Array: usa un while para vaciar aVaciar y luego renderiza estado final
    document.getElementById('btnVacia')?.addEventListener('click', () => {
      while (aVaciar.length) {
        aVaciar.pop();
      }
      // Una vez vacío, mostramos un mensaje de confirmación
      if (outVaciado) {
        outVaciado.innerHTML = `<div>Array vaciado ✅</div>`;
      }
    });
  
    /* =========================================================================
       (Aquí podrías volver a inicializar otros ejercicios previos, por ejemplo)
       setupPushExercises();
       setupPopExercises(); // si mantienes modularizado
       etc.
    ========================================================================= */
  });
   
   /* =========================================================================
      INICIALIZACIÓN GENERAL
      ========================================================================= */
   document.addEventListener('DOMContentLoaded', () => {
     // Inicializa Proyectos 2–6 si tus elementos existen:
     // aplicaEventoVisual('btnClick','click',{...},'Evento click');
     // contarHijos('contenedor2','salida3');
     // crearEnlace(...);
     // modificarAtributos(...);
     // agregaParrafo('contenedor5');
     // initForm('formRegistro','listaCampos','/registro');
     // etc.
   
     // Inicializa ejercicios push() y pop()
     setupPushExercises();
     setupPopExercises();
   });