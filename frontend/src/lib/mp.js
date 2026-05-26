/**
 * Utilidades para redirección e interacción con Mercado Pago.
 */
export const redirectToMercadoPago = (initPoint) => {
  if (initPoint) {
    // Redirige al cliente a la pasarela oficial de pago de Mercado Pago Checkout Pro
    window.location.href = initPoint;
  } else {
    console.error("No se provino un punto de inicio (init_point) válido para Mercado Pago.");
  }
};
