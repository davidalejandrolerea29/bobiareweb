import React, { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';

type CalendarCell = {
  date: Date;
  isCurrentMonth: boolean;
};

const sameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const buildCalendar = (visibleMonth: Date): CalendarCell[] => {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return { date, isCurrentMonth: date.getMonth() === month };
  });
};

const AdminCalendarPage: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const cells = useMemo(() => buildCalendar(visibleMonth), [visibleMonth]);

  const navigateMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const goToday = () => {
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const chooseDate = (date: Date) => {
    setSelectedDate(date);
    if (date.getMonth() !== visibleMonth.getMonth()) {
      setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Planificación de entregas</h2>
        <p className="mt-1 text-sm text-neutral-500">Consultá fechas y organizá la agenda del taller.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToday}
                className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => navigateMonth(-1)}
                className="grid h-9 w-9 place-items-center rounded-md border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                aria-label="Mes anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => navigateMonth(1)}
                className="grid h-9 w-9 place-items-center rounded-md border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                aria-label="Mes siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <h3 className="text-lg font-semibold capitalize text-neutral-900">
              {visibleMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
            </h3>
          </div>

          <div className="min-w-[640px] overflow-x-auto">
            <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                <div key={day} className="px-2 py-3 text-center text-xs font-semibold uppercase text-neutral-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {cells.map(({ date, isCurrentMonth }) => {
                const isToday = sameDay(date, today);
                const isSelected = sameDay(date, selectedDate);
                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => chooseDate(date)}
                    className={`relative min-h-24 border-b border-r border-neutral-100 p-2 text-left transition-colors hover:bg-neutral-50 ${
                      isSelected ? 'bg-primary-50' : 'bg-white'
                    }`}
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${
                        isToday
                          ? 'bg-primary-600 text-white'
                          : isCurrentMonth
                            ? 'text-neutral-700'
                            : 'text-neutral-300'
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {isSelected && (
                      <span className="absolute bottom-2 left-2 right-2 h-1 rounded-full bg-primary-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-primary-600">Agenda del día</p>
          <h3 className="mt-1 text-lg font-bold capitalize text-neutral-900">
            {selectedDate.toLocaleDateString('es-AR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </h3>
          <div className="mt-6 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white text-neutral-400 shadow-sm">
              <CalendarDays size={21} />
            </span>
            <p className="mt-4 text-sm font-semibold text-neutral-700">Sin entregas programadas</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">La agenda está libre para esta fecha.</p>
          </div>
          <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-5 text-xs text-neutral-500">
            <Clock3 size={15} />
            Horario del taller: 8:00 a 18:00
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminCalendarPage;
