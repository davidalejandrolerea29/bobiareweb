// PLACEHOLDER — dirección real del taller pendiente de que el cliente la
// pase. Hasta entonces esto es una dirección inventada, cualquier pieza
// enviada acá NO va a llegar a ningún lado. Reemplazar antes de que esta
// pantalla la vea un cliente real.
export const WORKSHOP_ADDRESS = {
  recipient: 'Bobiare S.A. — Taller de restauración',
  street: 'Av. Rivadavia 4850',
  city: 'Caballito, CABA',
  province: 'Ciudad Autónoma de Buenos Aires',
  postal_code: 'C1424BEJ',
};

export const PACKING_INSTRUCTIONS = [
  'Envolvé la pieza en varias capas de papel burbuja o cartón, sin dejar partes metálicas expuestas.',
  'Usá una caja rígida con relleno (papel, telgopor) para que no se mueva durante el viaje.',
  'Escribí tu número de pedido en un papel dentro de la caja, por las dudas.',
  'Mandalo por Correo Argentino y guardá el número de seguimiento — lo vas a necesitar después.',
];

export const workshopAddressAsText = () =>
  `${WORKSHOP_ADDRESS.recipient}\n${WORKSHOP_ADDRESS.street}\n${WORKSHOP_ADDRESS.city}, ${WORKSHOP_ADDRESS.province}\nCP ${WORKSHOP_ADDRESS.postal_code}`;
