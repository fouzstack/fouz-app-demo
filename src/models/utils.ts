// src/utils/product.utils.ts

//this is Okkkkkkkkkkkkk.
export const normalizeNames = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, '');
};

export function formatDateAndTime(somedate?: Date | string | number): {
  date: string;
  time: string;
} {
  const date = somedate ? new Date(somedate) : new Date();

  // Obtiene el día y asegura que tenga 2 dígitos
  const day = String(date.getDate()).padStart(2, '0');
  // Obtiene el mes (0-11) y lo ajusta para que sea (1-12)
  const month = String(date.getMonth() + 1).padStart(2, '0');
  // Obtiene el año
  const year = date.getFullYear();

  // Obtiene la hora y los minutos
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Determina si es AM o PM
  const amPm = hours >= 12 ? 'PM' : 'AM';
  // Convierte la hora a formato de 12 horas
  hours = hours % 12 || 12; // convierte 0 a 12 para formato en 12 horas

  // Formato final de la hora
  const time = `${String(hours).padStart(2, '0')}:${minutes} ${amPm}`;
  const dateAndTime = {
    date: `${day}-${month}-${year}`,
    time: time,
  };

  return dateAndTime;
}
//this failed................s
export const normalizeString = (str: string): string =>
  str
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const InternationalDateFormater = (
  date: string | number | Date,
): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('es-CU', options).format(new Date(date));
};

export function dateFormatter(date: string | number | Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat('es-ES', options);

  const localDate = new Date( //@ts-expect-error
    date.toLocaleString('en-US', { timeZone: 'America/Havana' }),
  );
  return formatter.format(localDate);
}

export function formatearFecha(_fecha: string | number | Date) {
  const fecha = new Date(_fecha);
  const diasSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const diaSemana = diasSemana[fecha.getDay()]; // Obtener el día de la semana
  const dia = fecha.getDate(); // Obtener el día del mes
  const mes = meses[fecha.getMonth()]; // Obtener el mes
  const año = fecha.getFullYear(); // Obtener el año

  return `${diaSemana} ${dia} de ${mes} de ${año}`;
}

// Función para formato 'día-mes-año' ******** works so excelent! ***********
export function formatDateToDMY(somedate: Date | string | number): string {
  const date = new Date(somedate);
  const day = String(date.getDate()).padStart(2, '0'); // Obtiene el día y asegura que tenga 2 dígitos
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (0-11) y lo ajusta para que sea (1-12)
  const year = date.getFullYear(); // Obtiene el año
  return `${day}-${month}-${year}`; // Retorna la cadena en el formato deseado
}

export function formatDate(date: Date | string | number | undefined) {
  const _date = date === undefined ? new Date().toISOString() : date;
  return `${new Date(_date.toLocaleString())}`;
}

export function formatDateAndWeek(_fecha: string | number | Date) {
  const fecha = new Date(_fecha);
  const diasSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const diaSemana = diasSemana[fecha.getDay()]; // Obtener el día de la semana
  const dia = fecha.getDate(); // Obtener el día del mes
  const mes = meses[fecha.getMonth()]; // Obtener el mes
  const año = fecha.getFullYear(); // Obtener el año

  return `${diaSemana} ${dia} de ${mes} de ${año}`;
}
