
const KEY = 'campus_reservations_v1';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}
function write(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function getDayBookings(roomId, dateStr) {
  const db = read();
  return db?.[roomId]?.[dateStr] || [];
}

export function saveBooking({ roomId, date, start, end, name }) {
  const db = read();
  db[roomId] = db[roomId] || {};
  db[roomId][date] = db[roomId][date] || [];
  db[roomId][date].push({ start, end, name });
  write(db);
}

export function clearAll() {
  localStorage.removeItem(KEY);
}
