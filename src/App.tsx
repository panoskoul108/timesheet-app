import { useState, useEffect } from 'react';
import { supabase } from './supabase';

const dict = {
  el: {
    loading: 'Φόρτωση...', hello: 'Γεια σου', wrongPin: 'Λάθος PIN.', back: 'Πίσω', login: 'Είσοδος', logout: 'Έξοδος', store: 'Κατάστημα', date: 'Ημερομηνία', hoursWorked: 'Ώρες', hoursCol: 'Ώρες', egHours: 'π.χ. 6 ή 6.5', save: 'Αποθήκευση', myHoursBtn: '⏱️ Οι Ώρες Μου', adminBtn: '📊 Στατιστικά (Admin)', statsTitle: 'Στατιστικά Πληρωμών', myHoursTitle: 'Οι Ώρες Μου', employee: 'Υπάλληλος', all: '-- Όλοι --', week: 'Εβδομάδα', month: 'Μήνας', year: 'Χρονιά', range: 'Εύρος', from: 'Από:', to: 'Έως:', allStores: 'Όλα', export: '📥 Εξαγωγή', totals: 'Σύνολα', noShifts: 'Δεν βρέθηκαν βάρδιες.', hoursText: 'ώρες', totalMyHours: 'Συνολικές Ώρες:', details: 'Αναλυτικά', noRecords: 'Δεν υπάρχουν καταχωρήσεις.', shortDate: 'Ημ/νία', shortStore: 'Μαγαζί', unknown: 'Άγνωστος', errInvalidHours: 'Παρακαλώ βάλε σωστό αριθμό.', errSave: 'Σφάλμα.', successSave: 'Επιτυχής αποθήκευση!', promptPin: 'Εισάγετε Admin PIN για διαγραφή:', errPin: 'Λάθος PIN.', errDel: 'Σφάλμα διαγραφής.', successDel: 'Διαγράφηκε.', noDataExp: 'Δεν υπάρχουν δεδομένα.', scheduleAdminBtn: '📅 Πρόγραμμα (Admin)', scheduleStaffBtn: '📅 Πρόγραμμα Εβδομάδας', scheduleAdminTitle: 'ΠΡΟΓΡΑΜΜΑ ΒΑΡΔΙΑΣ', scheduleStaffTitle: 'ΠΡΟΓΡΑΜΜΑ ΒΑΡΔΙΑΣ', startTime: 'Έναρξη (π.χ. 18:00)', endTime: 'Λήξη (π.χ. 02:00)', saveSchedule: 'Προσθήκη Βάρδιας', copyPrevWeek: '📋 Αντιγραφή προηγ. εβδομάδας', confirmCopy: 'Αντιγραφή προγράμματος προηγούμενης εβδομάδας;', copySuccess: 'Αντιγράφηκε!', copyEmpty: 'Δεν βρέθηκε πρόγραμμα.', dayCol: 'ΗΜΕΡΑ', repoCol: 'ΡΕΠΟ', addBtn: '+ Προσθήκη', cancel: 'Ακύρωση'
  },
  da: {
    loading: 'Indlæser...', hello: 'Hej', wrongPin: 'Forkert PIN.', back: 'Tilbage', login: 'Log ind', logout: 'Log ud', store: 'Butik', date: 'Dato', hoursWorked: 'Timer', hoursCol: 'Timer', egHours: 'f.eks. 6', save: 'Gem', myHoursBtn: '⏱️ Mine Timer', adminBtn: '📊 Statistik (Admin)', statsTitle: 'Statistik', myHoursTitle: 'Mine Timer', employee: 'Medarbejder', all: '-- Alle --', week: 'Uge', month: 'Måned', year: 'År', range: 'Periode', from: 'Fra:', to: 'Til:', allStores: 'Alle', export: '📥 Eksporter', totals: 'Totaler', noShifts: 'Ingen vagter.', hoursText: 'timer', totalMyHours: 'Totale timer:', details: 'Detaljer', noRecords: 'Ingen registreringer.', shortDate: 'Dato', shortStore: 'Butik', unknown: 'Ukendt', errInvalidHours: 'Ugyldigt antal.', errSave: 'Fejl.', successSave: 'Gemt!', promptPin: 'Admin PIN for at slette:', errPin: 'Forkert PIN.', errDel: 'Fejl sletning.', successDel: 'Slettet.', noDataExp: 'Ingen data.', scheduleAdminBtn: '📅 Skema (Admin)', scheduleStaffBtn: '📅 Ugeskema', scheduleAdminTitle: 'VAGTSKEMA', scheduleStaffTitle: 'VAGTSKEMA', startTime: 'Start (18:00)', endTime: 'Slut (02:00)', saveSchedule: 'Tilføj Vagt', copyPrevWeek: '📋 Kopier forrige uge', confirmCopy: 'Kopier forrige uge?', copySuccess: 'Kopieret!', copyEmpty: 'Ingen vagter fundet.', dayCol: 'DAG', repoCol: 'FRI', addBtn: '+ Tilføj', cancel: 'Annuller'
  },
  uk: {
    loading: 'Завантаження...', hello: 'Привіт', wrongPin: 'Невірний PIN.', back: 'Назад', login: 'Увійти', logout: 'Вийти', store: 'Магазин', date: 'Дата', hoursWorked: 'Години', hoursCol: 'Год', egHours: 'напр. 6', save: 'Зберегти', myHoursBtn: '⏱️ Мої години', adminBtn: '📊 Статистика (Admin)', statsTitle: 'Статистика', myHoursTitle: 'Мої години', employee: 'Співробітник', all: '-- Всі --', week: 'Тиждень', month: 'Місяць', year: 'Рік', range: 'Період', from: 'Від:', to: 'До:', allStores: 'Всі', export: '📥 Експорт', totals: 'Всього', noShifts: 'Зміни не знайдені.', hoursText: 'год', totalMyHours: 'Всього годин:', details: 'Детально', noRecords: 'Немає записів.', shortDate: 'Дата', shortStore: 'Магазин', unknown: 'Невідомий', errInvalidHours: 'Недійсна кількість.', errSave: 'Помилка.', successSave: 'Збережено!', promptPin: 'Admin PIN для видалення:', errPin: 'Невірний PIN.', errDel: 'Помилка видалення.', successDel: 'Видалено.', noDataExp: 'Немає даних.', scheduleAdminBtn: '📅 Розклад (Admin)', scheduleStaffBtn: '📅 Розклад на тиждень', scheduleAdminTitle: 'РОЗКЛАД ЗМІН', scheduleStaffTitle: 'РОЗКЛАД ЗМІН', startTime: 'З (18:00)', endTime: 'До (02:00)', saveSchedule: 'Додати зміну', copyPrevWeek: '📋 Копіювати мин. тиж.', confirmCopy: 'Копіювати минулий тиждень?', copySuccess: 'Скопійовано!', copyEmpty: 'Порожньо.', dayCol: 'ДЕНЬ', repoCol: 'ВИХІДНИЙ', addBtn: '+ Додати', cancel: 'Скасувати'
  }
};

const getMonday = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

export default function App() {
  const [lang, setLang] = useState<'el' | 'da' | 'uk'>('el');
  const t = dict[lang];

  // Auth States
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  // Form States
  const [storeLocation, setStoreLocation] = useState('Hellas');
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');

  // View & Filters
  const [viewMode, setViewMode] = useState<'form' | 'dashboard' | 'my_hours' | 'schedule_admin' | 'schedule_staff'>('form');
  const [shifts, setShifts] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year' | 'custom'>('month');
  const [storeFilter, setStoreFilter] = useState<'All' | 'Hellas' | 'Nordic'>('All');
  const [employeeFilter, setEmployeeFilter] = useState<string>('All');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Schedule States
  const [schedules, setSchedules] = useState<any[]>([]);
  const [scheduleWeekStart, setScheduleWeekStart] = useState(getMonday(new Date()).toISOString().split('T')[0]);
  
  // Modal (Popup) States για το Κινητό
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedEmpId, setSchedEmpId] = useState('');
  const [schedStore, setSchedStore] = useState('Hellas');
  const [schedDate, setSchedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedStart, setSchedStart] = useState('');
  const [schedEnd, setSchedEnd] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('shiftSheetsUser');
    if (savedUser) {
      try { setLoggedInUser(JSON.parse(savedUser)); setViewMode('form'); } catch (e) { console.error(e); }
    }
    const fetchEmployees = async () => {
      const { data, error: fetchError } = await supabase.from('employees').select('*');
      if (data) setEmployees(data);
      if (fetchError) console.error(fetchError);
    };
    fetchEmployees();
  }, []);

  const handleLogin = () => {
    if (selectedUser.pin === pin) {
      setLoggedInUser(selectedUser);
      localStorage.setItem('shiftSheetsUser', JSON.stringify(selectedUser));
      setError(''); setPin(''); setViewMode('form');
    } else { setError(t.wrongPin); setPin(''); }
  };

  const handleLogout = () => {
    setLoggedInUser(null); setSelectedUser(null);
    localStorage.removeItem('shiftSheetsUser');
    setViewMode('form'); setSubmitMsg(''); setHours('');
  };

  const handleSaveShift = async () => {
    if (!hours || isNaN(Number(hours))) return setSubmitMsg(t.errInvalidHours);
    const { error: insertErr } = await supabase.from('shifts').insert([{
      employee_id: loggedInUser.id, store_location: storeLocation, shift_date: shiftDate, hours_worked: Number(hours)
    }]);
    if (insertErr) setSubmitMsg(t.errSave);
    else { setSubmitMsg(t.successSave); setHours(''); setTimeout(() => setSubmitMsg(''), 3000); }
  };

  const loadDashboard = async () => {
    const { data } = await supabase.from('shifts').select('*');
    if (data) setShifts(data.filter(s => s.is_deleted !== true));
    setViewMode('dashboard');
  };

  const handleLoadMyHours = async () => {
    const { data } = await supabase.from('shifts').select('*').eq('employee_id', loggedInUser.id);
    if (data) setShifts(data.filter(s => s.is_deleted !== true));
    setViewMode('my_hours');
  };

  const handleDeleteShift = async (shiftId: string) => {
    const enteredPin = window.prompt(t.promptPin);
    if (!enteredPin) return;
    const isAdmin = employees.some(emp => emp.pin === enteredPin && emp.role?.toLowerCase() === 'admin');
    if (!isAdmin) return alert(t.errPin);
    const { error: updateErr } = await supabase.from('shifts').update({ is_deleted: true }).eq('id', shiftId);
    if (updateErr) alert(t.errDel); else { setShifts(shifts.filter(s => s.id !== shiftId)); alert(t.successDel); }
  };

  const handleExportCSV = (filteredShifts: any[]) => {
    if (filteredShifts.length === 0) return alert(t.noDataExp);
    let csvContent = `\uFEFF${t.employee};${t.store};${t.date};${t.hoursCol}\n`;
    filteredShifts.forEach(shift => {
      const empName = employees.find(e => e.id === shift.employee_id)?.name || t.unknown;
      const [year, month, day] = shift.shift_date.split('-');
      csvContent += `${empName};${shift.store_location};="${day}/${month}/${year}";${shift.hours_worked}\n`;
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
    link.setAttribute("download", `shiftsheets_export.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const getFilteredShifts = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return shifts.filter(shift => {
      const sDate = new Date(shift.shift_date); sDate.setHours(0,0,0,0);
      let dateMatch = true;
      if (dateFilter === 'year') dateMatch = sDate.getFullYear() === currentYear;
      else if (dateFilter === 'month') dateMatch = sDate.getFullYear() === currentYear && sDate.getMonth() === currentMonth;
      else if (dateFilter === 'week') {
        const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); startOfWeek.setHours(0,0,0,0);
        dateMatch = sDate >= startOfWeek;
      } else if (dateFilter === 'custom') {
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate); start.setHours(0,0,0,0);
          const end = new Date(customEndDate); end.setHours(23,59,59,999);
          dateMatch = sDate >= start && sDate <= end;
        } else if (customStartDate) {
          const start = new Date(customStartDate); start.setHours(0,0,0,0); dateMatch = sDate >= start;
        } else if (customEndDate) {
          const end = new Date(customEndDate); end.setHours(23,59,59,999); dateMatch = sDate <= end;
        }
      }
      const storeMatch = storeFilter === 'All' || shift.store_location === storeFilter;
      const employeeMatch = viewMode !== 'dashboard' || employeeFilter === 'All' || shift.employee_id === employeeFilter;
      return dateMatch && storeMatch && employeeMatch;
    });
  };

  const loadSchedules = async (startDate: string) => {
    const start = new Date(startDate);
    const end = new Date(start); end.setDate(end.getDate() + 6);
    const { data } = await supabase.from('schedules').select('*')
      .gte('schedule_date', start.toISOString().split('T')[0])
      .lte('schedule_date', end.toISOString().split('T')[0]);
    if (data) setSchedules(data);
  };

  const openAdminSchedule = () => { loadSchedules(scheduleWeekStart); setViewMode('schedule_admin'); };
  const openStaffSchedule = () => { loadSchedules(scheduleWeekStart); setViewMode('schedule_staff'); };

  useEffect(() => {
    if (viewMode === 'schedule_admin' || viewMode === 'schedule_staff') loadSchedules(scheduleWeekStart);
  }, [scheduleWeekStart, viewMode]);

  const saveScheduleEntry = async () => {
    if (!schedEmpId) return alert("Παρακαλώ επίλεξε υπάλληλο!");
    if (!schedStart || !schedEnd) return alert("Παρακαλώ συμπλήρωσε Έναρξη και Λήξη!");

    const payload = {
      employee_id: schedEmpId, 
      store_location: schedStore, 
      schedule_date: schedDate, 
      start_time: schedStart, 
      end_time: schedEnd
    };

    const { error: insertErr } = await supabase.from('schedules').insert([payload]);
    if (insertErr) {
      console.error(insertErr); alert("Αποτυχία: " + insertErr.message);
    } else {
      setIsScheduleModalOpen(false); setSchedStart(''); setSchedEnd(''); setSchedEmpId('');
      loadSchedules(scheduleWeekStart);
    }
  };

  const deleteSchedule = async (id: string) => {
    if(!window.confirm("Διαγραφή βάρδιας;")) return;
    await supabase.from('schedules').delete().eq('id', id);
    loadSchedules(scheduleWeekStart);
  };

  const copyPreviousWeek = async () => {
    if (!window.confirm(t.confirmCopy)) return;
    const currStart = new Date(scheduleWeekStart);
    const prevStart = new Date(currStart); prevStart.setDate(prevStart.getDate() - 7);
    const prevEnd = new Date(prevStart); prevEnd.setDate(prevEnd.getDate() + 6);

    const { data } = await supabase.from('schedules').select('*')
      .gte('schedule_date', prevStart.toISOString().split('T')[0])
      .lte('schedule_date', prevEnd.toISOString().split('T')[0]);

    if (!data || data.length === 0) return alert(t.copyEmpty);

    const newEntries = data.map(s => {
      const oldDate = new Date(s.schedule_date); oldDate.setDate(oldDate.getDate() + 7);
      return { employee_id: s.employee_id, store_location: s.store_location, schedule_date: oldDate.toISOString().split('T')[0], start_time: s.start_time, end_time: s.end_time };
    });
    await supabase.from('schedules').insert(newEntries);
    loadSchedules(scheduleWeekStart);
    alert(t.copySuccess);
  };

  const renderLangButtons = () => (
    <div className="w-full flex justify-end gap-2 mb-3">
      <button onClick={() => setLang('el')} className={`px-3 py-1 text-sm font-bold rounded-lg border-2 transition-colors ${lang === 'el' ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]' : 'bg-white text-gray-600 border-gray-200'}`}>🇬🇷 ΕΛ</button>
      <button onClick={() => setLang('da')} className={`px-3 py-1 text-sm font-bold rounded-lg border-2 transition-colors ${lang === 'da' ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]' : 'bg-white text-gray-600 border-gray-200'}`}>🇩🇰 DA</button>
      <button onClick={() => setLang('uk')} className={`px-3 py-1 text-sm font-bold rounded-lg border-2 transition-colors ${lang === 'uk' ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]' : 'bg-white text-gray-600 border-gray-200'}`}>🇺🇦 UK</button>
    </div>
  );

  // ---------------- UI: SCHEDULE (RESPONSIVE GRID / CARDS) ----------------
  if (loggedInUser && (viewMode === 'schedule_admin' || viewMode === 'schedule_staff')) {
    const isSchedAdmin = viewMode === 'schedule_admin';
    const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(scheduleWeekStart); d.setDate(d.getDate() + i); return d;
    });
    const formatDayName = (d: Date) => d.toLocaleDateString(lang === 'el' ? 'el-GR' : lang === 'da' ? 'da-DK' : 'uk-UA', { weekday: 'long' }).toUpperCase();
    const formatDateObj = (d: Date) => d.toLocaleDateString('el-GR', { day: 'numeric', month: 'numeric' });

    return (
      <div className="min-h-screen bg-gray-100 p-2 sm:p-4 flex flex-col items-center pt-6 relative">
        <div className="max-w-5xl w-full">{renderLangButtons()}</div>
        
        {/* ΑΝΑΔΥΟΜΕΝΟ ΠΑΡΑΘΥΡΟ (MODAL) ΠΡΟΣΘΗΚΗΣ */}
        {isScheduleModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-xl font-black mb-4 text-[#1a365d] border-b pb-2">
                {schedStore} - {new Date(schedDate).toLocaleDateString('el-GR', { weekday: 'short', day: 'numeric', month: 'numeric' })}
              </h3>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t.employee}</label>
              <select value={schedEmpId} onChange={e => setSchedEmpId(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 text-base font-bold bg-gray-50">
                <option value="" disabled>-- Επίλεξε --</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
              <div className="flex gap-3 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">{t.startTime}</label>
                  <input type="time" value={schedStart} onChange={e => setSchedStart(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg font-bold bg-gray-50" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">{t.endTime}</label>
                  <input type="time" value={schedEnd} onChange={e => setSchedEnd(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg font-bold bg-gray-50" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsScheduleModalOpen(false)} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg">{t.cancel}</button>
                <button onClick={saveScheduleEntry} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md">{t.saveSchedule}</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-3 sm:p-6 rounded-lg shadow-xl border-t-4 border-blue-600 max-w-5xl w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b-2 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#1a365d] text-center sm:text-left">{isSchedAdmin ? t.scheduleAdminTitle : t.scheduleStaffTitle}</h2>
            <div className="mt-4 sm:mt-0 flex flex-wrap justify-center gap-2">
              <input type="date" value={scheduleWeekStart} onChange={(e) => setScheduleWeekStart(getMonday(new Date(e.target.value)).toISOString().split('T')[0])} className="p-2 border-2 rounded font-bold text-gray-700 bg-gray-50" />
              {isSchedAdmin && <button onClick={copyPreviousWeek} className="bg-[#1a365d] text-white px-3 py-2 rounded text-sm font-bold">{t.copyPrevWeek}</button>}
              <button onClick={() => setViewMode('form')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-bold">{t.back}</button>
            </div>
          </div>

          {/* ----- ΠΡΟΒΟΛΗ ΚΙΝΗΤΟΥ (ΚΑΡΤΕΛΕΣ) ----- */}
          <div className="flex flex-col gap-5 md:hidden">
            {daysOfWeek.map((d) => {
              const dateStr = d.toISOString().split('T')[0];
              const hellasShifts = schedules.filter(s => s.schedule_date === dateStr && s.store_location === 'Hellas');
              const nordicShifts = schedules.filter(s => s.schedule_date === dateStr && s.store_location === 'Nordic');
              const workingIds = [...hellasShifts, ...nordicShifts].map(s => s.employee_id);
              const repoEmployees = employees.filter(e => !workingIds.includes(e.id)).map(e => e.name).join(', ');

              return (
                <div key={dateStr} className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                  <div className="bg-[#1a365d] text-white p-3 flex justify-between items-center">
                    <span className="font-black text-lg">📅 {formatDayName(d)}</span>
                    <span className="font-bold text-blue-200">{formatDateObj(d)}</span>
                  </div>
                  
                  {/* Καρτέλα Hellas */}
                  <div className="p-3 border-b border-gray-100">
                    <h4 className="font-black text-[#2b6cb0] mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#2b6cb0]"></span> HELLAS</h4>
                    {hellasShifts.map(s => (
                      <div key={s.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                        <div className="text-gray-800 font-bold text-sm">
                          {s.start_time && <span className="text-gray-500 font-mono mr-2 bg-gray-100 px-1 rounded">{s.start_time} - {s.end_time}</span>}
                          {employees.find(e => e.id === s.employee_id)?.name || t.unknown}
                        </div>
                        {isSchedAdmin && <button onClick={() => deleteSchedule(s.id)} className="text-red-500 font-black px-3 py-1 bg-red-50 rounded">✕</button>}
                      </div>
                    ))}
                    {isSchedAdmin && <button onClick={() => { setSchedDate(dateStr); setSchedStore('Hellas'); setSchedStart(''); setSchedEnd(''); setSchedEmpId(''); setIsScheduleModalOpen(true); }} className="mt-2 w-full text-sm font-bold text-[#2b6cb0] bg-blue-50 py-3 rounded-lg border border-blue-200 uppercase">{t.addBtn}</button>}
                  </div>

                  {/* Καρτέλα Nordic */}
                  <div className="p-3 border-b border-gray-100">
                    <h4 className="font-black text-[#319795] mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#319795]"></span> NORDIC MYTHOS</h4>
                    {nordicShifts.map(s => (
                      <div key={s.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                        <div className="text-gray-800 font-bold text-sm">
                          {s.start_time && <span className="text-gray-500 font-mono mr-2 bg-gray-100 px-1 rounded">{s.start_time} - {s.end_time}</span>}
                          {employees.find(e => e.id === s.employee_id)?.name || t.unknown}
                        </div>
                        {isSchedAdmin && <button onClick={() => deleteSchedule(s.id)} className="text-red-500 font-black px-3 py-1 bg-red-50 rounded">✕</button>}
                      </div>
                    ))}
                    {isSchedAdmin && <button onClick={() => { setSchedDate(dateStr); setSchedStore('Nordic'); setSchedStart(''); setSchedEnd(''); setSchedEmpId(''); setIsScheduleModalOpen(true); }} className="mt-2 w-full text-sm font-bold text-[#319795] bg-teal-50 py-3 rounded-lg border border-teal-200 uppercase">{t.addBtn}</button>}
                  </div>

                  {/* Καρτέλα Ρεπό */}
                  <div className="p-3 bg-gray-50">
                    <h4 className="font-black text-gray-500 mb-1 text-sm">{t.repoCol}</h4>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{repoEmployees || '-'}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ----- ΠΡΟΒΟΛΗ ΥΠΟΛΟΓΙΣΤΗ / TABLET (GRID) ----- */}
          <div className="hidden md:block overflow-x-auto border-2 border-gray-300 rounded-lg">
            <table className="w-full min-w-[700px] border-collapse bg-white">
              <thead>
                <tr>
                  <th className="bg-[#1a365d] text-white p-3 border-r w-[18%] font-black">{t.dayCol}</th>
                  <th className="bg-[#2b6cb0] text-white p-3 border-r w-[27%] font-black">HELLAS</th>
                  <th className="bg-[#319795] text-white p-3 border-r w-[27%] font-black">NORDIC MYTHOS</th>
                  <th className="bg-[#a0aec0] text-gray-800 p-3 w-[28%] font-black">{t.repoCol}</th>
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map((d, index) => {
                  const dateStr = d.toISOString().split('T')[0];
                  const hellasShifts = schedules.filter(s => s.schedule_date === dateStr && s.store_location === 'Hellas');
                  const nordicShifts = schedules.filter(s => s.schedule_date === dateStr && s.store_location === 'Nordic');
                  const workingIds = [...hellasShifts, ...nordicShifts].map(s => s.employee_id);
                  const repoEmployees = employees.filter(e => !workingIds.includes(e.id)).map(e => e.name).join(', ');

                  return (
                    <tr key={dateStr} className={`border-t border-gray-300 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="p-3 border-r align-middle">
                        <div className="flex flex-col text-[#1a365d]">
                          <span className="font-black text-lg flex items-center gap-1"><span className="text-xl">📅</span> {formatDayName(d)}</span>
                          <span className="font-bold text-gray-500 pl-7">{formatDateObj(d)}</span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 border-r align-top relative">
                        {hellasShifts.map(s => (
                          <div key={s.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                            <div className="text-gray-800 font-semibold">{s.start_time && <span className="text-gray-500 font-mono text-sm mr-2">🕒 {s.start_time}</span>}{employees.find(e => e.id === s.employee_id)?.name || t.unknown}</div>
                            {isSchedAdmin && <button onClick={() => deleteSchedule(s.id)} className="text-red-500 hover:text-red-700 font-black px-2 py-1 bg-red-50 rounded">✕</button>}
                          </div>
                        ))}
                        {isSchedAdmin && <button onClick={() => { setSchedDate(dateStr); setSchedStore('Hellas'); setSchedStart(''); setSchedEnd(''); setSchedEmpId(''); setIsScheduleModalOpen(true); }} className="mt-3 w-full text-xs font-bold text-[#2b6cb0] bg-blue-50 py-2 rounded-lg border border-blue-200 uppercase tracking-wider">{t.addBtn}</button>}
                      </td>
                      <td className="p-2 sm:p-3 border-r align-top relative">
                        {nordicShifts.map(s => (
                          <div key={s.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                            <div className="text-gray-800 font-semibold">{s.start_time && <span className="text-gray-500 font-mono text-sm mr-2">🕒 {s.start_time}</span>}{employees.find(e => e.id === s.employee_id)?.name || t.unknown}</div>
                            {isSchedAdmin && <button onClick={() => deleteSchedule(s.id)} className="text-red-500 hover:text-red-700 font-black px-2 py-1 bg-red-50 rounded">✕</button>}
                          </div>
                        ))}
                        {isSchedAdmin && <button onClick={() => { setSchedDate(dateStr); setSchedStore('Nordic'); setSchedStart(''); setSchedEnd(''); setSchedEmpId(''); setIsScheduleModalOpen(true); }} className="mt-3 w-full text-xs font-bold text-[#319795] bg-teal-50 py-2 rounded-lg border border-teal-200 uppercase tracking-wider">{t.addBtn}</button>}
                      </td>
                      <td className="p-3 align-middle text-gray-600 font-medium leading-relaxed">{repoEmployees || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- UI: DASHBOARD & MY HOURS ----------------
  if (loggedInUser && (viewMode === 'dashboard' || viewMode === 'my_hours')) {
    const isDash = viewMode === 'dashboard';
    const filteredShifts = getFilteredShifts();
    const totals: Record<string, number> = {};
    let totalMyHours = 0;

    filteredShifts.forEach(shift => {
      const empName = employees.find(e => e.id === shift.employee_id)?.name || t.unknown;
      totals[empName] = (totals[empName] || 0) + shift.hours_worked;
      if (!isDash) totalMyHours += shift.hours_worked;
    });

    const sortedShifts = [...filteredShifts].sort((a, b) => new Date(b.shift_date).getTime() - new Date(a.shift_date).getTime());
    
    return (
      <div className="min-h-screen bg-gray-100 p-3 flex flex-col items-center pt-6">
        <div className="max-w-2xl w-full">{renderLangButtons()}</div>
        <div className={`bg-white p-4 sm:p-8 rounded-lg shadow-md border-t-4 max-w-2xl w-full ${isDash ? 'border-orange-500' : 'border-blue-500'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">{isDash ? t.statsTitle : t.myHoursTitle}</h2>
            <div className="space-x-2">
              <button onClick={() => setViewMode('form')} className="text-sm text-gray-600 font-semibold p-2">{t.back}</button>
              <button onClick={handleLogout} className={`text-sm font-semibold p-2 ${isDash ? 'text-[#8B5A2B]' : 'text-blue-600'}`}>{t.logout}</button>
            </div>
          </div>

          {isDash && (
            <div className="mb-4 bg-orange-50 p-3 rounded border border-orange-200">
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.employee}:</label>
              <select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)} className="w-full p-2 border border-orange-300 rounded bg-white">
                <option value="All">{t.all}</option>
                {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <button onClick={() => setDateFilter('week')} className={`py-2 rounded text-sm font-bold ${dateFilter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{t.week}</button>
            <button onClick={() => setDateFilter('month')} className={`py-2 rounded text-sm font-bold ${dateFilter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{t.month}</button>
            <button onClick={() => setDateFilter('year')} className={`py-2 rounded text-sm font-bold ${dateFilter === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{t.year}</button>
            <button onClick={() => setDateFilter('custom')} className={`py-2 rounded text-sm font-bold ${dateFilter === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{t.range}</button>
          </div>

          {dateFilter === 'custom' && (
            <div className="flex gap-3 mb-4 p-4 rounded border shadow-sm bg-gray-50">
              <div className="flex-1">
                <label className="block text-xs font-bold mb-1">{t.from}</label>
                <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold mb-1">{t.to}</label>
                <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="w-full p-2 border rounded" />
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-6 mt-2">
            <button onClick={() => setStoreFilter('All')} className={`flex-1 py-2 rounded border-2 text-sm font-bold ${storeFilter === 'All' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200'}`}>{t.allStores}</button>
            <button onClick={() => setStoreFilter('Hellas')} className={`flex-1 py-2 rounded border-2 text-sm font-bold ${storeFilter === 'Hellas' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200'}`}>Hellas</button>
            <button onClick={() => setStoreFilter('Nordic')} className={`flex-1 py-2 rounded border-2 text-sm font-bold ${storeFilter === 'Nordic' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200'}`}>Nordic</button>
          </div>

          <div className="flex justify-end mb-4"><button onClick={() => handleExportCSV(filteredShifts)} className="bg-green-600 text-white font-bold py-2 px-4 rounded">{t.export}</button></div>

          <div className="bg-gray-50 border rounded p-4 mb-6">
            <h3 className="font-bold mb-3 border-b pb-2">{t.totals}</h3>
            {Object.keys(totals).length === 0 && <p className="text-center text-gray-500 py-2">{t.noShifts}</p>}
            {Object.keys(totals).length > 0 && isDash && (
              <table className="w-full text-left">
                <tbody>{Object.entries(totals).map(([name, totalHours]) => <tr key={name} className="border-b last:border-0"><td className="py-2">{name}</td><td className="py-2 text-right font-bold text-orange-600">{totalHours} {t.hoursText}</td></tr>)}</tbody>
              </table>
            )}
            {Object.keys(totals).length > 0 && !isDash && (
              <div className="py-3 text-center"><span className="text-gray-600 font-medium text-lg">{t.totalMyHours} </span><span className="text-blue-600 font-bold text-2xl ml-2">{totalMyHours}</span></div>
            )}
          </div>

          <div className="bg-white border rounded p-4 shadow-sm">
            <h3 className="font-bold mb-3 border-b pb-2">{t.details}</h3>
            {sortedShifts.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead><tr className="text-gray-500 border-b"><th>{t.shortDate}</th>{isDash && <th>{t.employee}</th>}<th>{t.shortStore}</th><th className="text-center">{t.hoursCol}</th><th></th></tr></thead>
                <tbody>
                  {sortedShifts.map((shift) => (
                    <tr key={shift.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{new Date(shift.shift_date).toLocaleDateString('el-GR').slice(0, 5)}</td>
                      {isDash && <td className="py-2">{employees.find(e => e.id === shift.employee_id)?.name || t.unknown}</td>}
                      <td className="py-2">{shift.store_location}</td>
                      <td className="py-2 text-center font-bold">{shift.hours_worked}</td>
                      <td className="py-2 text-center"><button onClick={() => handleDeleteShift(shift.id)} className="text-red-500 font-bold">✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="text-center text-gray-500">{t.noRecords}</p>}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- UI: MAIN MENU ----------------
  if (loggedInUser && viewMode === 'form') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">{renderLangButtons()}</div>
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border-t-4 border-orange-500 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{t.hello}, {loggedInUser.name}!</h2>
            <button onClick={handleLogout} className="text-sm text-[#8B5A2B] font-semibold p-2">{t.logout}</button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 mb-2">
               <button onClick={openStaffSchedule} className="bg-[#1a365d] text-white font-bold py-3 rounded text-sm shadow-sm hover:bg-[#12284c]">{t.scheduleStaffBtn}</button>
               <button onClick={handleLoadMyHours} className="bg-blue-50 text-blue-700 font-bold py-3 rounded border border-blue-200 text-sm shadow-sm hover:bg-blue-100">{t.myHoursBtn}</button>
            </div>
            <div className="border-t pt-4 mt-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">{t.store}</label>
              <select value={storeLocation} onChange={(e) => setStoreLocation(e.target.value)} className="w-full p-3 border rounded bg-white mb-3"><option value="Hellas">Hellas</option><option value="Nordic">Nordic</option></select>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t.date}</label>
              <input type="date" value={shiftDate} onChange={(e) => setShiftDate(e.target.value)} className="w-full p-3 border rounded mb-3" />
              <label className="block text-sm font-bold text-gray-700 mb-1">{t.hoursWorked}</label>
              <input type="number" step="0.5" placeholder={t.egHours} value={hours} onChange={(e) => setHours(e.target.value)} className="w-full p-3 border rounded mb-3" />
              <button onClick={handleSaveShift} className="w-full bg-orange-500 text-white font-bold py-4 rounded shadow-sm text-lg hover:bg-orange-600">{t.save}</button>
            </div>
            {submitMsg && <p className="text-center text-sm font-medium mt-2 text-green-600">{submitMsg}</p>}
            {loggedInUser.role?.toLowerCase() === 'admin' && (
              <div className="border-t pt-4 mt-4 grid grid-cols-1 gap-2">
                <button onClick={openAdminSchedule} className="w-full bg-blue-100 text-blue-800 font-bold py-3 rounded border border-blue-300 shadow-sm hover:bg-blue-200">{t.scheduleAdminBtn}</button>
                <button onClick={loadDashboard} className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded border border-gray-300 shadow-sm hover:bg-gray-200">{t.adminBtn}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- UI: LOGIN ----------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">{renderLangButtons()}</div>
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border-b-4 border-[#8B5A2B] max-w-md w-full">
        <h1 className="text-3xl font-black text-gray-800 text-center mb-8 tracking-wide">ShiftSheets</h1>
        {!selectedUser ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {employees.length === 0 && <p className="col-span-2 text-center text-gray-500 text-sm">{t.loading}</p>}
            {employees.map((emp) => (
              <button key={emp.id} onClick={() => setSelectedUser(emp)} className="bg-gray-50 text-gray-800 font-semibold py-5 rounded-lg border-2 border-gray-200 hover:border-orange-500 text-lg">{emp.name}</button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-xl text-gray-700 mb-6">{t.hello}, <span className="font-bold text-orange-600">{selectedUser.name}</span></h2>
            <input type="password" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)} placeholder="****" className="w-40 text-center text-4xl tracking-[0.5em] p-4 border-2 rounded-lg mb-6 bg-gray-50" autoFocus />
            {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}
            <div className="flex w-full gap-3">
              <button onClick={() => { setSelectedUser(null); setPin(''); setError(''); }} className="flex-1 bg-gray-200 text-gray-800 font-bold py-4 rounded-lg text-lg hover:bg-gray-300">{t.back}</button>
              <button onClick={handleLogin} className="flex-1 bg-orange-500 text-white font-bold py-4 rounded-lg text-lg shadow-sm hover:bg-orange-600">{t.login}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}