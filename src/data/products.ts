import { Product, ColorOption, DeliveryOption } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Arenado y Pintura de Cuadro de Moto',
    category: 'Motos',
    description: 'Servicio completo de arenado y pintura para cuadros de motocicletas. Incluye remoción de pintura vieja, eliminación de óxido, preparación de superficie, primer y pintura de alta calidad con acabado duradero.',
    imageUrl: 'https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg',
    basePrice: 25000,
    available: true,
  },
  {
    id: '2',
    name: 'Tratamiento Anticorrosivo Industrial',
    category: 'Industrial',
    description: 'Tratamiento especializado para piezas y estructuras industriales. Incluye limpieza química, aplicación de productos anticorrosivos y sellado final para máxima protección en ambientes agresivos.',
    imageUrl: 'https://images.pexels.com/photos/3888151/pexels-photo-3888151.jpeg',
    basePrice: 35000,
    available: true,
  },
  {
    id: '3',
    name: 'Restauración de Muebles Metálicos',
    category: 'Hogar',
    description: 'Servicio completo de restauración para muebles metálicos del hogar. Incluye limpieza, tratamiento de óxido, reparaciones menores y acabado con pintura según especificaciones del cliente.',
    imageUrl: 'https://images.pexels.com/photos/4846097/pexels-photo-4846097.jpeg',
    basePrice: 18000,
    available: true,
  },
  {
    id: '4',
    name: 'Pulido de Superficies de Acero Inoxidable',
    category: 'Industrial',
    description: 'Servicio de pulido profesional para superficies de acero inoxidable. Ideal para equipamiento de cocina industrial, barandas, y elementos decorativos que requieren un acabado brillante y duradero.',
    imageUrl: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
    basePrice: 12000,
    available: true,
  },
  {
    id: '5',
    name: 'Arenado de Piezas de Automóvil',
    category: 'Automóviles',
    description: 'Servicio de arenado para componentes de automóviles. Perfecto para llantas, carcasas, piezas del motor y otros componentes que requieren una limpieza profunda antes de ser restaurados.',
    imageUrl: 'https://images.pexels.com/photos/3807329/pexels-photo-3807329.jpeg',
    basePrice: 15000,
    available: true,
  },
  {
    id: '6',
    name: 'Acabado Powercoating para Bicicletas',
    category: 'Bicicletas',
    description: 'Tratamiento completo de powdercoating para cuadros y componentes de bicicletas. Incluye preparación, aplicación electrostática y horneado para un acabado duradero y resistente a los elementos.',
    imageUrl: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg',
    basePrice: 22000,
    available: true,
  },
];

export const colorOptions: ColorOption[] = [
  { id: 'c1', name: 'Negro Mate', colorCode: '#1a1a1a', price: 0 },
  { id: 'c2', name: 'Negro Brillante', colorCode: '#0f0f0f', price: 500 },
  { id: 'c3', name: 'Blanco', colorCode: '#ffffff', price: 0 },
  { id: 'c4', name: 'Rojo Ferrari', colorCode: '#ff2800', price: 1500 },
  { id: 'c5', name: 'Azul Metálico', colorCode: '#0047ab', price: 1200 },
  { id: 'c6', name: 'Verde Militar', colorCode: '#4b5320', price: 800 },
  { id: 'c7', name: 'Plata', colorCode: '#c0c0c0', price: 1000 },
  { id: 'c8', name: 'Dorado', colorCode: '#ffd700', price: 2000 },
  { id: 'c9', name: 'Naranja', colorCode: '#ff7f00', price: 800 },
  { id: 'c10', name: 'Personalizado', colorCode: '#cccccc', price: 2500 },
];

export const deliveryOptions: DeliveryOption[] = [
  { days: 10, price: 0, description: 'Estándar (10 días hábiles)' },
  { days: 7, price: 3000, description: 'Rápido (7 días hábiles)' },
  { days: 5, price: 5000, description: 'Express (5 días hábiles)' },
  { days: 3, price: 8000, description: 'Urgente (3 días hábiles)' },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (currentId: string, category: string): Product[] => {
  return products
    .filter(product => product.id !== currentId && product.category === category)
    .slice(0, 3);
};