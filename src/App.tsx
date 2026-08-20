import { useState, useEffect } from 'react';
import { supabase } from './supabase';

const dict = {
  el: {
    loading: 'Φόρτωση υπαλλήλων...',
    hello: 'Γεια σου',
    wrongPin: 'Λάθος PIN. Προσπάθησε ξανά.',
    back: 'Πίσω',
    login: 'Είσοδος',
    logout: 'Έξοδος',
    store: 'Κατάστημα',
    date: 'Ημερομηνία',
    hoursWorked: 'Ώρες που δούλεψες',
    hoursCol: 'Ώρες',
    egHours: 'π.χ. 6 ή 6.5',
    save: 'Καταχώρηση Ωρών',
    myHoursBtn: '⏱️ Οι Ώρες Μου',
    adminBtn: '📊 Πίνακας Ωρών (Admin)',
    statsTitle: 'Στατιστικά (Admin)',
    myHoursTitle: 'Οι Ώρες Μου',
    employee: 'Υπάλληλος',
    all: '-- Όλοι --',
    week: 'Εβδομάδα',
    month: 'Μήνας',
    year: 'Χρονιά',
    range: 'Εύρος',
    from: 'Από:',
    to: 'Έως:',
    allStores: 'Όλα',
    export: '📥 Εξαγωγή',
    totals: 'Σύνολα',
    noShifts: 'Δεν βρέθηκαν βάρδιες.',
    hoursText: 'ώρες',
    totalMyHours: 'Συνολικές Ώρες:',
    details: 'Αναλυτικά',
    noRecords: 'Δεν υπάρχουν καταχωρήσεις.',
    shortDate: 'Ημ/νία',
    shortStore: 'Μαγαζί',
    unknown: 'Άγνωστος',
    errInvalidHours: 'Παρακαλώ βάλε σωστό αριθμό ωρών.',
    errSave: 'Σφάλμα κατά την αποθήκευση.',
    successSave: 'Επιτυχής αποθήκευση!',
    promptPin: 'Απαιτείται έγκριση Διαχειριστή.\nΕισάγετε Admin PIN για διαγραφή:',
    errPin: 'Αποτυχία: Λάθος PIN Διαχειριστή.',
    errDel: 'Σφάλμα κατά τη διαγραφή.',
    successDel: 'Διαγράφηκε επιτυχώς.',
    noDataExp: 'Δεν υπάρχουν δεδομένα.',
    scheduleAdminBtn: '📅 Διαχείριση Προγράμματος',
    scheduleStaffBtn: '📅 Το Πρόγραμμά Μου',
    scheduleAdminTitle: 'Πρόγραμμα Εβδομάδας (Admin)',
    scheduleStaffTitle: 'Το Πρόγραμμά Μου',
    startTime: 'Από (π.χ. 18:00)',
    endTime: 'Έως (π.χ. 02:00)',
    saveSchedule: 'Αποθήκευση Βάρδιας',
    updateSchedule: 'Ενημέρωση Βάρδιας',
    copyPrevWeek: '📋 Αντιγραφή προηγ. εβδομάδας',
    confirmCopy: 'Αντιγραφή προγράμματος προηγούμενης εβδομάδας σε αυτήν;',
    copySuccess: 'Το πρόγραμμα αντιγράφηκε!',
    copyEmpty: 'Δεν βρέθηκε πρόγραμμα την προηγούμενη εβδομάδα.',
    cancelEdit: 'Ακύρωση Επεξεργασίας',
    colleagues: 'Συνάδελφοι: '
  },
  da: {
    loading: 'Indlæser medarbejdere...',
    hello: 'Hej',
    wrongPin: 'Forkert PIN. Prøv igen.',
    back: 'Tilbage',
    login: 'Log ind',
    logout: 'Log ud',
    store: 'Butik',
    date: 'Dato',
    hoursWorked: 'Arbejdstimer',
    hoursCol: 'Timer',
    egHours: 'f.eks. 6 eller 6.5',
    save: 'Gem Timer',
    myHoursBtn: '⏱️ Mine Timer',
    adminBtn: '📊 Timeplan (Admin)',
    statsTitle: 'Statistikker (Admin)',
    myHoursTitle: 'Mine Timer',
    employee: 'Medarbejder',
    all: '-- Alle --',
    week: 'Uge',
    month: 'Måned',
    year: 'År',
    range: 'Periode',
    from: 'Fra:',
    to: 'Til:',
    allStores: 'Alle',
    export: '📥 Eksporter',
    totals: 'Totaler',
    noShifts: 'Ingen vagter fundet.',
    hoursText: 'timer',
    totalMyHours: 'Totale timer:',
    details: 'Detaljer',
    noRecords: 'Ingen registreringer.',
    shortDate: 'Dato',
    shortStore: 'Butik',
    unknown: 'Ukendt',
    errInvalidHours: 'Indtast venligst et gyldigt antal.',
    errSave: 'Der opstod en fejl.',
    successSave: 'Gemt med succes!',
    promptPin: 'Admin PIN kræves for at slette:',
    errPin: 'Fejl: PIN er forkert.',
    errDel: 'Der opstod en fejl under sletning.',
    successDel: 'Slettet med succes.',
    noDataExp: 'Ingen data at eksportere.',
    scheduleAdminBtn: '📅 Administrer Skema',
    scheduleStaffBtn: '📅 Mit Skema',
    scheduleAdminTitle: 'Ugeskema (Admin)',
    scheduleStaffTitle: 'Mit Skema',
    startTime: 'Fra (f.eks. 18:00)',
    endTime: 'Til (f.eks. 02:00)',
    saveSchedule: 'Gem Vagt',
    updateSchedule: 'Opdater Vagt',
    copyPrevWeek: '📋 Kopier forrige uge',
    confirmCopy: 'Kopier forrige uges skema til denne?',
    copySuccess: 'Skema kopieret!',
    copyEmpty: 'Ingen vagter fundet i forrige uge.',
    cancelEdit: 'Annuller',
    colleagues: 'Kollegaer: '
  },
  uk: {
    loading: 'Завантаження...',
    hello: 'Привіт',
    wrongPin: 'Невірний PIN.',
    back: 'Назад',
    login: 'Увійти',
    logout: 'Вийти',
    store: 'Магазин',
    date: 'Дата',
    hoursWorked: 'Години',
    hoursCol: 'Год',
    egHours: 'напр. 6 або 6.5',
    save: 'Зберегти',
    myHoursBtn: '⏱️ Мої години',
    adminBtn: '📊 Статистика (Admin)',
    statsTitle: 'Статистика',
    myHoursTitle: 'Мої години',
    employee: 'Співробітник',
    all: '-- Всі --',
    week: 'Тиждень',
    month: 'Місяць',
    year: 'Рік',
    range: 'Період',
    from: 'Від:',
    to: 'До:',
    allStores: 'Всі',
    export: '📥 Експорт',
    totals: 'Всього',
    noShifts: 'Зміни не знайдені.',
    hoursText: 'год',
    totalMyHours: 'Всього годин:',
    details: 'Детально',
    noRecords: 'Немає записів.',
    shortDate: 'Дата',
    shortStore: 'Магазин',
    unknown: 'Невідомий',
    errInvalidHours: 'Недійсна кількість годин.',
    errSave: 'Помилка збереження.',
    successSave: 'Успішно збережено!',
    promptPin: 'Введіть Admin PIN для видалення:',
    errPin: 'Помилка: невірний PIN.',
    errDel: 'Помилка видалення.',
    successDel: 'Успішно видалено.',
    noDataExp: 'Немає даних.',
    scheduleAdminBtn: '📅 Розклад (Admin)',
    scheduleStaffBtn: '📅 Мій розклад',
    scheduleAdminTitle: 'Розклад на тиждень',
    scheduleStaffTitle: 'Мій розклад',
    startTime: 'З (напр. 18:00)',
    endTime: 'До (напр. 02:00)',
    saveSchedule: 'Зберегти зміну',
    updateSchedule: 'Оновити зміну',
    copyPrevWeek: '📋 Копіювати мин. тиждень',
    confirmCopy: 'Копіювати розклад з минулого тижня?',
    copySuccess: 'Розклад скопійовано!',
    copyEmpty: 'Минулого тижня розкладу немає.',
    cancelEdit: 'Скасувати',
    colleagues: 'Колеги: '
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

  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const [storeLocation, setStoreLocation] = useState('Hellas');
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');

  const [viewMode, setViewMode] = useState<'form' | 'dashboard' | 'my_hours' | 'schedule_admin' | 'schedule_staff'>('form');
  const [shifts, setShifts] = useState<any[]>([]);
  
  const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year' | 'custom'>('month');
  const [storeFilter, setStoreFilter] = useState<'All' | 'Hellas' | 'Nordic'>('All');
  const [employeeFilter, setEmployeeFilter] = useState<string>('All');
  
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const [schedules, setSchedules] = useState<any[]>([]);
  const [scheduleWeekStart, setScheduleWeekStart] = useState(getMonday(new Date()).toISOString().split('T')[0]);
  
  const [editSchedId, setEditSchedId] = useState<string | null>(null);
  const [schedEmpId, setSchedEmpId] = useState('');
  const [schedStore, setSchedStore] = useState('Hellas');
  const [schedDate, setSchedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedStart, setSchedStart] = useState('');
  const [schedEnd, setSchedEnd] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('shiftSheetsUser');
    if (savedUser) {
      try {
        setLoggedInUser(JSON.parse(savedUser));
        setViewMode('form');
      } catch (e) {
        console.error("Σφάλμα ανάγνωσης.");
      }
    }

    const fetchEmployees = async () => {
      const { data, error: fetchError } = await supabase.from('employees').select('*');
      if (data) {
        setEmployees(data);
        if (data.length > 0) setSchedEmpId(data[0].id);
      }
      if (fetchError) console.error(fetchError);
    };
    fetchEmployees();
  }, []);

  const handleLogin = () => {
    if (selectedUser.pin === pin) {
      setLoggedInUser(selectedUser);
      localStorage.setItem('shiftSheetsUser', JSON.stringify(selectedUser));
      setError('');
      setPin('');
      setViewMode('form');
    } else {
      setError(t.wrongPin);
      setPin('');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setSelectedUser(null);
    localStorage.removeItem('shiftSheetsUser');
    setViewMode('form');
    setSubmitMsg('');
    setHours('');
  };

  const handleSaveShift = async () => {
    if (!hours || isNaN(Number(hours))) {
      setSubmitMsg(t.errInvalidHours);
      return;
    }
    const { error: insertErr } = await supabase.from('shifts').insert([{
      employee_id: loggedInUser.id, store_location: storeLocation, shift_date: shiftDate, hours_worked: Number(hours)
    }]);
    if (insertErr) {
      setSubmitMsg(t.errSave);
    } else {
      setSubmitMsg(t.successSave);
      setHours('');
      setTimeout(() => setSubmitMsg(''), 3000);
    }
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
    if (!isAdmin) { alert(t.errPin); return; }

    const { error: updateErr } = await supabase.from('shifts').update({ is_deleted: true }).eq('id', shiftId);
    if (updateErr) alert(t.errDel);
    else { setShifts(shifts.filter(s => s.id !== shiftId)); alert(t.successDel); }
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
      const sDate = new Date(shift.shift_date);
      sDate.setHours(0,0,0,0);
      
      let dateMatch = true;
      if (dateFilter === 'year') {
        dateMatch = sDate.getFullYear() === currentYear;
      } else if (dateFilter === 'month') {
        dateMatch = sDate.getFullYear() === currentYear && sDate.getMonth() === currentMonth;
      } else if (dateFilter === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        startOfWeek.setHours(0,0,0,0);
        dateMatch = sDate >= startOfWeek;
      } else if (dateFilter === 'custom') {
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate); start.setHours(0,0,0,0);
          const end = new Date(customEndDate); end.setHours(23,59,59,999);
          dateMatch = sDate >= start && sDate <= end;
        } else if (customStartDate) {
          const start = new Date(customStartDate); start.setHours(0,0,0,0);
          dateMatch = sDate >= start;
        } else if (customEndDate) {
          const end = new Date(customEndDate); end.setHours(23,59,59,999);
          dateMatch = sDate <= end;
        }
      }

      let storeMatch = true;
      if (storeFilter !== 'All') {
        storeMatch = shift.store_location === storeFilter;
      }

      let employeeMatch = true;
      if (viewMode === 'dashboard' && employeeFilter !== 'All') {
        employeeMatch = shift.employee_id === employeeFilter;
      }

      return dateMatch && storeMatch && employeeMatch;
    });
  };

  const loadSchedules = async (startDate: string) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const { data } = await supabase.from('schedules').select('*')
      .gte('schedule_date', start.toISOString().split('T')[0])
      .lte('schedule_date', end.toISOString().split('T')[0]);
    if (data) setSchedules(data);
  };

  const openAdminSchedule = () => {
    loadSchedules(scheduleWeekStart);
    setViewMode('schedule_admin');
  };

  const openStaffSchedule = () => {
    loadSchedules(scheduleWeekStart);
    setViewMode('schedule_staff');
  };

  useEffect(() => {
    if (viewMode === 'schedule_admin' || viewMode === 'schedule_staff') {
      loadSchedules(scheduleWeekStart);
    }
  }, [scheduleWeekStart, viewMode]);

  const saveScheduleEntry = async () => {
    if (!schedStart || !schedEnd) return alert("Συμπλήρωσε ώρες.");
    
    const payload = {
      employee_id: schedEmpId, store_location: schedStore, schedule_date: schedDate, start_time: schedStart, end_time: schedEnd
    };

    if (editSchedId) {
      await supabase.from('schedules').update(payload).eq('id', editSchedId);
      setEditSchedId(null);
    } else {
      await supabase.from('schedules').insert([payload]);
    }
    setSchedStart(''); setSchedEnd('');
    loadSchedules(scheduleWeekStart);
  };

  const editSchedule = (s: any) => {
    setEditSchedId(s.id);
    setSchedEmpId(s.employee_id);
    setSchedStore(s.store_location);
    setSchedDate(s.schedule_date);
    setSchedStart(s.start_time);
    setSchedEnd(s.end_time);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteSchedule = async (id: string) => {
    if(!window.confirm("Διαγραφή από το πρόγραμμα;")) return;
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
      const oldDate = new Date(s.schedule_date);
      oldDate.setDate(oldDate.getDate() + 7);
      return {
        employee_id: s.employee_id, store_location: s.store_location, 
        schedule_date: oldDate.toISOString().split('T')[0], start_time: s.start_time, end_time: s.end_time
      };
    });

    await supabase.from('schedules').insert(newEntries);
    loadSchedules(scheduleWeekStart);
    alert(t.copySuccess);
  };

  const renderLangButtons = () => (
    <div className="w-full flex justify-end gap-2 mb-3">
      <button onClick={() => setLang('el')} className={`px-3 py-1 text-sm font-bold rounded-lg border-2 shadow-sm transition-colors ${lang === 'el' ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]' : 'bg-white text-gray-600 border-gray-200'}`}>🇬🇷 ΕΛ</button>
      <button onClick={() => setLang('da')} className={`px-3 py-1 text-sm font-bold rounded-lg border-2 shadow-sm transition-colors ${lang === 'da' ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]' : 'bg-white text-gray-600 border-gray-200'}`}>🇩🇰 DA</button>
      <button onClick={() => setLang('uk')} className={`px-3 py-1 text-sm font-bold rounded-lg border-2 shadow-sm transition-colors ${lang === 'uk' ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]' : 'bg-white text-gray-600 border-gray-200'}`}>🇺🇦 UK</button>
    </div>
  );
  // ---------------- ΟΘΟΝΗ: ΠΡΟΓΡΑΜΜΑ (ADMIN & STAFF) ----------------
  if (loggedInUser && (viewMode === 'schedule_admin' || viewMode === 'schedule_staff')) {
    const isSchedAdmin = viewMode === 'schedule_admin';
    const sortedSchedules = [...schedules].sort((a, b) => new Date(a.schedule_date).getTime() - new Date(b.schedule_date).getTime());
    const displaySchedules = isSchedAdmin ? sortedSchedules : sortedSchedules.filter(s => s.employee_id === loggedInUser.id);

    return (
      <div className="min-h-screen bg-gray-100 p-3 sm:p-4 flex flex-col items-center justify-start pt-6 sm:pt-10">
        <div className="max-w-3xl w-full">{renderLangButtons()}</div>
        <div className={`bg-white p-4 sm:p-8 rounded-lg shadow-md border-t-4 max-w-3xl w-full ${isSchedAdmin ? 'border-purple-600' : 'border-teal-500'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">{isSchedAdmin ? t.scheduleAdminTitle : t.scheduleStaffTitle}</h2>
            <button onClick={() => setViewMode('form')} className="text-xs sm:text-sm font-semibold p-2 text-gray-600 hover:text-gray-800">{t.back}</button>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-4 rounded-lg border">
            <label className="font-bold text-gray-700 w-full sm:w-auto">Εβδομάδα (Δευτέρα):</label>
            <input type="date" value={scheduleWeekStart} onChange={(e) => setScheduleWeekStart(getMonday(new Date(e.target.value)).toISOString().split('T')[0])} className="w-full sm:flex-1 p-2 border rounded" />
            {isSchedAdmin && (
              <button onClick={copyPreviousWeek} className="w-full sm:w-auto bg-gray-800 text-white px-4 py-2 rounded text-sm font-bold shadow hover:bg-gray-700">
                {t.copyPrevWeek}
              </button>
            )}
          </div>

          {isSchedAdmin && (
            <div className={`mb-8 p-4 rounded-lg border shadow-sm ${editSchedId ? 'bg-yellow-50 border-yellow-300' : 'bg-purple-50 border-purple-200'}`}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-bold mb-1">{t.employee}</label>
                  <select value={schedEmpId} onChange={e => setSchedEmpId(e.target.value)} className="w-full p-2 border rounded bg-white text-sm">
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">{t.store}</label>
                  <select value={schedStore} onChange={e => setSchedStore(e.target.value)} className="w-full p-2 border rounded bg-white text-sm">
                    <option value="Hellas">Hellas</option>
                    <option value="Nordic">Nordic</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold mb-1">{t.date}</label>
                  <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} className="w-full p-2 border rounded text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-bold mb-1">{t.startTime}</label>
                  <input type="time" value={schedStart} onChange={e => setSchedStart(e.target.value)} className="w-full p-2 border rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">{t.endTime}</label>
                  <input type="time" value={schedEnd} onChange={e => setSchedEnd(e.target.value)} className="w-full p-2 border rounded text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={saveScheduleEntry} className={`flex-1 text-white font-bold py-2 rounded shadow ${editSchedId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
                  {editSchedId ? t.updateSchedule : t.saveSchedule}
                </button>
                {editSchedId && (
                  <button onClick={() => { setEditSchedId(null); setSchedStart(''); setSchedEnd(''); }} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">
                    {t.cancelEdit}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="bg-white border rounded shadow-sm overflow-hidden">
            {displaySchedules.length === 0 ? (
              <p className="text-center text-gray-500 py-6">{t.noRecords}</p>
            ) : (
              <div className="divide-y">
                {displaySchedules.map(s => {
                  const empName = employees.find(e => e.id === s.employee_id)?.name || t.unknown;
                  const formattedDate = new Date(s.schedule_date).toLocaleDateString(lang === 'el' ? 'el-GR' : lang === 'da' ? 'da-DK' : 'uk-UA', { weekday: 'short', day: 'numeric', month: 'short' });
                  
                  let colleagues = '';
                  if (!isSchedAdmin) {
                    const others = schedules.filter(other => other.schedule_date === s.schedule_date && other.store_location === s.store_location && other.employee_id !== s.employee_id);
                    colleagues = others.map(o => employees.find(e => e.id === o.employee_id)?.name).filter(Boolean).join(', ');
                  }

                  return (
                    <div key={s.id} className={`p-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-gray-50 ${s.id === editSchedId ? 'bg-yellow-50' : ''}`}>
                      <div className="mb-2 sm:mb-0">
                        <div className="font-bold text-gray-800 text-lg">{formattedDate} <span className="text-sm font-normal text-gray-500 ml-2">({s.store_location})</span></div>
                        <div className="text-sm text-gray-600 mt-1">
                          {isSchedAdmin ? <span className="font-semibold text-purple-700">{empName}</span> : null}
                          <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">{s.start_time} - {s.end_time}</span>
                        </div>
                        {!isSchedAdmin && colleagues && (
                          <div className="text-xs text-gray-500 mt-2 bg-teal-50 inline-block px-2 py-1 rounded border border-teal-100">
                            <span className="font-bold">{t.colleagues}</span> {colleagues}
                          </div>
                        )}
                      </div>
                      
                      {isSchedAdmin && (
                        <div className="flex gap-2">
                          <button onClick={() => editSchedule(s)} className="bg-yellow-500 text-white px-3 py-1 rounded font-bold shadow text-sm">✏️</button>
                          <button onClick={() => deleteSchedule(s.id)} className="bg-red-500 text-white px-3 py-1 rounded font-bold shadow text-sm">✕</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- ΟΘΟΝΗ: ΣΤΑΤΙΣΤΙΚΑ ΩΡΩΝ (ADMIN & MY HOURS) ---
  if (loggedInUser && (viewMode === 'dashboard' || viewMode === 'my_hours')) {
    const filteredShifts = getFilteredShifts();
    const totals: Record<string, number> = {};
    let totalMyHours = 0;

    filteredShifts.forEach(shift => {
      const emp = employees.find(e => e.id === shift.employee_id);
      const empName = emp ? emp.name : t.unknown;
      totals[empName] = (totals[empName] || 0) + shift.hours_worked;
      if (viewMode === 'my_hours') totalMyHours += shift.hours_worked;
    });

    const sortedShifts = [...filteredShifts].sort((a, b) => new Date(b.shift_date).getTime() - new Date(a.shift_date).getTime());
    const isDash = viewMode === 'dashboard';
    
    const activeColor = isDash ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white';
    const inactiveColor = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    const storeActiveColor = isDash ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-blue-500 text-blue-600 bg-blue-50';
    const storeInactiveColor = 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white';
    const customBoxClass = isDash ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200';
    const customInputClass = isDash ? 'border-orange-300 focus:border-orange-500' : 'border-blue-300 focus:border-blue-500';

    return (
      <div className="min-h-screen bg-gray-100 p-3 sm:p-4 flex flex-col items-center justify-start pt-6 sm:pt-10">
        <div className="max-w-2xl w-full">{renderLangButtons()}</div>
        <div className={`bg-white p-4 sm:p-8 rounded-lg shadow-md border-t-4 max-w-2xl w-full ${isDash ? 'border-orange-500' : 'border-blue-500'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">{isDash ? t.statsTitle : t.myHoursTitle}</h2>
            <div className="space-x-2 sm:space-x-3">
              <button onClick={() => setViewMode('form')} className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 font-semibold p-2">{t.back}</button>
              <button onClick={handleLogout} className={`text-xs sm:text-sm font-semibold p-2 ${isDash ? 'text-[#8B5A2B] hover:text-orange-600' : 'text-blue-600 hover:text-blue-800'}`}>{t.logout}</button>
            </div>
          </div>

          {isDash && (
            <div className="mb-4 bg-orange-50 p-3 sm:p-4 rounded border border-orange-200">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">{t.employee}:</label>
              <select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)} className="w-full p-2 sm:p-3 border border-orange-300 rounded focus:outline-none focus:border-orange-500 text-sm sm:text-base bg-white">
                <option value="All">{t.all}</option>
                {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-3">
            <button onClick={() => setDateFilter('week')} className={`py-3 sm:py-2 rounded text-xs sm:text-sm font-bold transition-colors ${dateFilter === 'week' ? activeColor : inactiveColor}`}>{t.week}</button>
            <button onClick={() => setDateFilter('month')} className={`py-3 sm:py-2 rounded text-xs sm:text-sm font-bold transition-colors ${dateFilter === 'month' ? activeColor : inactiveColor}`}>{t.month}</button>
            <button onClick={() => setDateFilter('year')} className={`py-3 sm:py-2 rounded text-xs sm:text-sm font-bold transition-colors ${dateFilter === 'year' ? activeColor : inactiveColor}`}>{t.year}</button>
            <button onClick={() => setDateFilter('custom')} className={`py-3 sm:py-2 rounded text-xs sm:text-sm font-bold transition-colors ${dateFilter === 'custom' ? activeColor : inactiveColor}`}>{t.range}</button>
          </div>

          {dateFilter === 'custom' && (
            <div className={`flex flex-col sm:flex-row gap-3 mb-4 p-4 rounded border shadow-sm ${customBoxClass}`}>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">{t.from}</label>
                <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className={`w-full p-2 border rounded focus:outline-none text-sm bg-white ${customInputClass}`} />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">{t.to}</label>
                <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className={`w-full p-2 border rounded focus:outline-none text-sm bg-white ${customInputClass}`} />
              </div>
            </div>
          )}

          <div className="flex gap-1 sm:gap-2 mb-6 mt-2">
            <button onClick={() => setStoreFilter('All')} className={`flex-1 py-3 sm:py-2 rounded border-2 text-xs sm:text-sm font-bold transition-colors ${storeFilter === 'All' ? storeActiveColor : storeInactiveColor}`}>{t.allStores}</button>
            <button onClick={() => setStoreFilter('Hellas')} className={`flex-1 py-3 sm:py-2 rounded border-2 text-xs sm:text-sm font-bold transition-colors ${storeFilter === 'Hellas' ? storeActiveColor : storeInactiveColor}`}>Hellas</button>
            <button onClick={() => setStoreFilter('Nordic')} className={`flex-1 py-3 sm:py-2 rounded border-2 text-xs sm:text-sm font-bold transition-colors ${storeFilter === 'Nordic' ? storeActiveColor : storeInactiveColor}`}>Nordic</button>
          </div>

          <div className="flex justify-end mb-4">
            <button onClick={() => handleExportCSV(filteredShifts)} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded text-sm w-full sm:w-auto shadow-sm">{t.export}</button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-3 sm:p-4 mb-6">
            <h3 className="text-gray-700 font-bold mb-3 border-b pb-2 text-sm sm:text-base">{t.totals}</h3>
            {Object.keys(totals).length === 0 && <p className="text-center text-gray-500 py-2 text-sm">{t.noShifts}</p>}
            {Object.keys(totals).length > 0 && isDash && (
              <table className="w-full text-left text-sm sm:text-base">
                <tbody>
                  {Object.entries(totals).map(([name, totalHours]) => (
                    <tr key={name} className="border-b border-gray-200 last:border-0">
                      <td className="py-2 text-gray-800 font-medium">{name}</td>
                      <td className="py-2 text-right font-bold text-orange-600">{totalHours} {t.hoursText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {Object.keys(totals).length > 0 && !isDash && (
              <div className="py-3 text-center">
                <span className="text-gray-600 font-medium text-lg">{t.totalMyHours} </span>
                <span className="text-blue-600 font-bold text-2xl ml-2">{totalMyHours}</span>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded p-3 sm:p-4 shadow-sm">
            <h3 className="text-gray-700 font-bold mb-3 border-b pb-2 text-sm sm:text-base">{t.details}</h3>
            {sortedShifts.length === 0 && <p className="text-center text-gray-500 py-2 text-sm">{t.noRecords}</p>}
            {sortedShifts.length > 0 && (
              <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                <table className="w-full text-left text-xs sm:text-sm min-w-[350px]">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="pb-2">{t.shortDate}</th>
                      {isDash && <th className="pb-2">{t.employee}</th>}
                      <th className="pb-2">{t.shortStore}</th>
                      <th className="pb-2 text-center">{t.hoursCol}</th>
                      <th className="pb-2 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedShifts.map((shift) => {
                      const empName = employees.find(e => e.id === shift.employee_id)?.name || t.unknown;
                      return (
                        <tr key={shift.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3">{new Date(shift.shift_date).toLocaleDateString('el-GR').slice(0, 5)}</td>
                          {isDash && <td className="py-3 font-medium truncate max-w-[80px] sm:max-w-none">{empName}</td>}
                          <td className="py-3">{shift.store_location}</td>
                          <td className="py-3 text-center font-semibold">{shift.hours_worked}</td>
                          <td className="py-3 text-center">
                            <button onClick={() => handleDeleteShift(shift.id)} className="text-red-500 hover:text-red-700 font-bold text-lg px-2 p-1">✕</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ΟΘΟΝΗ: ΚΕΝΤΡΙΚΟ ΜΕΝΟΥ (ΜΕΤΑ ΤΟ LOGIN) ----------------
  if (loggedInUser && viewMode === 'form') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">{renderLangButtons()}</div>
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border-t-4 border-orange-500 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{t.hello}, {loggedInUser.name}!</h2>
            <button onClick={handleLogout} className="text-sm text-[#8B5A2B] hover:text-orange-600 font-semibold p-2">{t.logout}</button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 mb-2">
               <button onClick={openStaffSchedule} className="bg-teal-50 text-teal-700 font-bold py-3 rounded border border-teal-200 shadow-sm text-sm hover:bg-teal-100">{t.scheduleStaffBtn}</button>
               <button onClick={handleLoadMyHours} className="bg-blue-50 text-blue-700 font-bold py-3 rounded border border-blue-200 shadow-sm text-sm hover:bg-blue-100">{t.myHoursBtn}</button>
            </div>

            <div className="border-t pt-4 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.store}</label>
              <select value={storeLocation} onChange={(e) => setStoreLocation(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-base bg-white mb-3">
                <option value="Hellas">Hellas</option>
                <option value="Nordic">Nordic</option>
              </select>

              <label className="block text-sm font-medium text-gray-700 mb-1">{t.date}</label>
              <input type="date" value={shiftDate} onChange={(e) => setShiftDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-base mb-3" />

              <label className="block text-sm font-medium text-gray-700 mb-1">{t.hoursWorked}</label>
              <input type="number" step="0.5" placeholder={t.egHours} value={hours} onChange={(e) => setHours(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-base mb-3" />

              <button onClick={handleSaveShift} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded transition-colors shadow-sm text-lg">{t.save}</button>
            </div>

            {submitMsg && <p className={`text-center text-sm font-medium mt-2 ${submitMsg.includes('επιτυχώς') || submitMsg.includes('succes') || submitMsg.includes('успішно') ? 'text-green-600' : 'text-red-600'}`}>{submitMsg}</p>}

            {loggedInUser.role?.toLowerCase() === 'admin' && (
              <div className="border-t pt-4 mt-4 grid grid-cols-1 gap-2">
                <button onClick={openAdminSchedule} className="w