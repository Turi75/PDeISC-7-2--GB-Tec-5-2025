/**
 * Validar formato de email
 */
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validar formato de DNI (solo números)
 */
const validarDNI = (dni) => {
  const regex = /^\d+$/;
  return regex.test(dni);
};

/**
 * Formatear fecha a YYYY-MM-DD
 */
const formatearFecha = (fecha) => {
  const d = new Date(fecha);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
};

/**
 * Obtener día de la semana en español
 */
const obtenerDiaSemana = (fecha) => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[new Date(fecha).getDay()];
};

/**
 * Calcular fecha de fin (sumar días)
 */
const sumarDias = (fecha, dias) => {
  const resultado = new Date(fecha);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
};

module.exports = {
  validarEmail,
  validarDNI,
  formatearFecha,
  obtenerDiaSemana,
  sumarDias
};