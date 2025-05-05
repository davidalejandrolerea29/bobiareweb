import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  User
} from 'lucide-react';

// Mock deliveries data
const mockDeliveries = [
  {
    id: '1',
    title: 'Entrega #12345 - Juan Pérez',
    date: '2023-08-22',
    time: '10:00',
    address: 'Av. Rivadavia 1234, CABA',
    product: 'Arenado de Cuadro',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Entrega #12340 - Roberto Silva',
    date: '2023-08-22',
    time: '15:00',
    address: 'Calle Corrientes 5678, CABA',
    product: 'Powdercoating Bicicleta',
    status: 'scheduled'
  },
  {
    id: '3',
    title: 'Retiro #12348 - Ana López',
    date: '2023-08-22',
    time: '12:30',
    address: 'Av. Santa Fe 2468, CABA',
    product: 'Pintura de Moto',
    status: 'pickup'
  },
  {
    id: '4',
    title: 'Entrega #12338 - Ana Martínez',
    date: '2023-08-23',
    time: '11:30',
    address: 'Calle Callao 9876, CABA',
    product: 'Tratamiento Anticorrosivo',
    status: 'scheduled'
  },
  {
    id: '5',
    title: 'Retiro #12350 - Carlos González',
    date: '2023-08-23',
    time: '14:00',
    address: 'Av. Córdoba 3456, CABA',
    product: 'Restauración de Muebles',
    status: 'pickup'
  },
  {
    id: '6',
    title: 'Entrega #12332 - Pedro López',
    date: '2023-08-24',
    time: '14:00',
    address: 'Calle Florida 7890, CABA',
    product: 'Arenado de Llantas',
    status: 'scheduled'
  },
  {
    id: '7',
    title: 'Retiro #12352 - María Sánchez',
    date: '2023-08-24',
    time: '09:30',
    address: 'Av. Pueyrredón 1357, CABA',
    product: 'Pintura Industrial',
    status: 'pickup'
  },
  {
    id: '8',
    title: 'Entrega #12330 - Javier Rodríguez',
    date: '2023-08-25',
    time: '16:00',
    address: 'Calle Lavalle 2468, CABA',
    product: 'Pulido de Acero',
    status: 'scheduled'
  },
];

const AdminCalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  
  // Generate days for the month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate array of days for the month view
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ 
        day: i, 
        date: date,
        dateString: date.toISOString().split('T')[0]
      });
    }
    
    return days;
  };
  
  // Generate array of days for the week view
  const generateWeekDays = () => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day;
    
    const weekStart = new Date(date.setDate(diff));
    
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + i);
      
      days.push({
        day: currentDay.getDate(),
        date: currentDay,
        dateString: currentDay.toISOString().split('T')[0],
        dayName: currentDay.toLocaleDateString('es-AR', { weekday: 'short' })
      });
    }
    
    return days;
  };
  
  // Navigate to previous/next month or week
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    
    setCurrentDate(newDate);
  };
  
  // Helper to check if a delivery is on a specific date
  const getDeliveriesForDate = (dateString: string) => {
    return mockDeliveries.filter(delivery => delivery.date === dateString);
  };
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/admin"
            className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-500 transition-colors mb-4"
          >
            <ArrowLeft size={16} className="mr-1" /> Volver al Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-4 md:mb-0">
              Calendario de Entregas
            </h1>
            
            <button
              className="inline-flex items-center px-4 py-2 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Nueva Entrega
            </button>
          </div>
        </div>
        
        {/* Calendar Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
              >
                Hoy
              </button>
              
              <button
                onClick={navigatePrevious}
                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-md transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <button
                onClick={navigateNext}
                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-md transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              
              <h2 className="text-xl font-semibold text-neutral-800">
                {currentView === 'month' ? (
                  currentDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
                ) : currentView === 'week' ? (
                  `${new Date(currentDate).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })} - ${
                    new Date(new Date(currentDate).setDate(currentDate.getDate() + 6))
                      .toLocaleDateString('es-AR', { month: 'short', day: 'numeric', year: 'numeric' })
                  }`
                ) : (
                  currentDate.toLocaleDateString('es-AR', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                )}
              </h2>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('day')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'day' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Día
              </button>
              
              <button
                onClick={() => setCurrentView('week')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'week' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Semana
              </button>
              
              <button
                onClick={() => setCurrentView('month')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'month' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Mes
              </button>
            </div>
            
            {/* Mobile View Selector */}
            <div className="md:hidden">
              <select
                value={currentView}
                onChange={(e) => setCurrentView(e.target.value as 'day' | 'week' | 'month')}
                className="p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="day">Día</option>
                <option value="week">Semana</option>
                <option value="month">Mes</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Calendar View */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {currentView === 'month' && (
            <div>
              {/* Day Names Header */}
              <div className="grid grid-cols-7 border-b border-neutral-200">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
                  <div key={index} className="py-2 text-center text-sm font-medium text-neutral-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Month Grid */}
              <div className="grid grid-cols-7 auto-rows-fr">
                {generateMonthDays().map((dayObj, index) => (
                  <div 
                    key={index} 
                    className={`min-h-[100px] border border-neutral-200 p-2 ${
                      !dayObj.day ? 'bg-neutral-50' : ''
                    } ${
                      dayObj.dateString === new Date().toISOString().split('T')[0]
                        ? 'bg-primary-50'
                        : ''
                    }`}
                  >
                    {dayObj.day && (
                      <>
                        <div className="font-medium text-neutral-700 mb-2">
                          {dayObj.day}
                        </div>
                        
                        {/* Deliveries for this day */}
                        <div className="space-y-1">
                          {dayObj.dateString && getDeliveriesForDate(dayObj.dateString)
                            .slice(0, 2)
                            .map((delivery, idx) => (
                              <div 
                                key={idx} 
                                className={`text-xs p-1 rounded truncate ${
                                  delivery.status === 'pickup'
                                    ? 'bg-warning-100 text-warning-800'
                                    : 'bg-primary-100 text-primary-800'
                                }`}
                              >
                                {delivery.time} - {delivery.title}
                              </div>
                            ))}
                          
                          {dayObj.dateString && getDeliveriesForDate(dayObj.dateString).length > 2 && (
                            <div className="text-xs text-neutral-500 pl-1">
                              +{getDeliveriesForDate(dayObj.dateString).length - 2} más
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {currentView === 'week' && (
            <div>
              {/* Week Header */}
              <div className="grid grid-cols-7 border-b border-neutral-200">
                {generateWeekDays().map((dayObj, index) => (
                  <div 
                    key={index} 
                    className={`py-4 text-center ${
                      dayObj.dateString === new Date().toISOString().split('T')[0]
                        ? 'bg-primary-50'
                        : ''
                    }`}
                  >
                    <div className="text-sm font-medium text-neutral-500">
                      {dayObj.dayName}
                    </div>
                    <div className="text-lg font-semibold text-neutral-800">
                      {dayObj.day}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Week Schedule */}
              <div className="grid grid-cols-7 min-h-[600px]">
                {generateWeekDays().map((dayObj, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={`border-r border-neutral-200 last:border-r-0 ${
                      dayObj.dateString === new Date().toISOString().split('T')[0]
                        ? 'bg-primary-50'
                        : ''
                    }`}
                  >
                    {dayObj.dateString && getDeliveriesForDate(dayObj.dateString).map((delivery, idx) => (
                      <div
                        key={idx}
                        className={`mx-1 my-2 p-2 rounded-md shadow-sm ${
                          delivery.status === 'pickup'
                            ? 'bg-warning-100 border-l-4 border-warning-500'
                            : 'bg-primary-100 border-l-4 border-primary-500'
                        }`}
                      >
                        <div className="font-medium text-sm mb-1">
                          {delivery.time} - {delivery.title.split(' - ')[0]}
                        </div>
                        <div className="text-xs text-neutral-600 flex items-center">
                          <User size={12} className="mr-1" />
                          {delivery.title.split(' - ')[1]}
                        </div>
                        <div className="text-xs text-neutral-600 flex items-center">
                          <MapPin size={12} className="mr-1" />
                          {delivery.address}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {currentView === 'day' && (
            <div className="p-4">
              <h3 className="font-semibold text-xl mb-4">
                {currentDate.toLocaleDateString('es-AR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h3>
              
              <div className="space-y-4">
                {getDeliveriesForDate(currentDate.toISOString().split('T')[0]).length > 0 ? (
                  getDeliveriesForDate(currentDate.toISOString().split('T')[0])
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((delivery, idx) => (
                      <div 
                        key={idx} 
                        className={`border-l-4 p-4 rounded-md shadow-sm ${
                          delivery.status === 'pickup'
                            ? 'border-warning-500 bg-warning-50'
                            : 'border-primary-500 bg-primary-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="w-16 flex-shrink-0 font-semibold text-neutral-800">
                            {delivery.time}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-lg mb-2">{delivery.title}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="flex items-center text-sm text-neutral-600 mb-1">
                                  <CalendarIcon size={16} className="mr-2" />
                                  {new Date(delivery.date).toLocaleDateString('es-AR')}
                                </p>
                                <p className="flex items-center text-sm text-neutral-600 mb-1">
                                  <Clock size={16} className="mr-2" />
                                  {delivery.time}
                                </p>
                              </div>
                              <div>
                                <p className="flex items-center text-sm text-neutral-600 mb-1">
                                  <MapPin size={16} className="mr-2" />
                                  {delivery.address}
                                </p>
                                <p className="flex items-center text-sm text-neutral-600">
                                  <Package size={16} className="mr-2" />
                                  {delivery.product}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center space-x-3">
                              <button className="px-3 py-1 text-xs font-medium bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
                                Editar
                              </button>
                              <button className="px-3 py-1 text-xs font-medium bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 transition-colors">
                                Completado
                              </button>
                              {delivery.status === 'pickup' ? (
                                <span className="px-2 py-1 text-xs font-medium bg-warning-100 text-warning-700 rounded">
                                  Retiro
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                                  Entrega
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    <CalendarIcon size={40} className="mx-auto mb-4 text-neutral-300" />
                    <p>No hay entregas programadas para este día.</p>
                    <button className="mt-4 px-4 py-2 text-sm font-medium bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors inline-flex items-center">
                      <Plus size={16} className="mr-2" />
                      Programar Entrega
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCalendarPage;