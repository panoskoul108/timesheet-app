import { useState, useEffect } from 'react';
import { supabase } from './supabase';

// Το Λεξικό Μεταφράσεων
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
    export: '📥 Εξαγωγή σε Excel',
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
    errSave: 'Υπήρξε σφάλμα κατά την αποθήκευση.',
    successSave: 'Οι ώρες αποθηκεύτηκαν επιτυχώς!',
    confirmDel: 'Σίγουρα θέλεις να διαγράψεις αυτή τη βάρδια;',
    promptPin: 'Απαιτείται έγκριση Διαχειριστή.\nΠαρακαλώ εισάγετε ένα Admin PIN για να γίνει η διαγραφή:',
    errPin: 'Αποτυχία: Το PIN είναι λάθος ή δεν ανήκει σε Διαχειριστή. Η διαγραφή ακυρώθηκε.',
    errDel: 'Υπήρξε σφάλμα κατά τη διαγραφή.',
    successDel: 'Η βάρδια διαγράφηκε επιτυχώς.',
    noDataExp: 'Δεν υπάρχουν δεδομένα για εξαγωγή.'
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
    export: '📥 Eksporter til Excel',
    totals: 'Totaler',
    noShifts: 'Ingen vagter fundet.',
    hoursText: 'timer',
    totalMyHours: 'Totale timer:',
    details: 'Detaljer',
    noRecords: 'Ingen registreringer.',
    shortDate: 'Dato',
    shortStore: 'Butik',
    unknown: 'Ukendt',
    errInvalidHours: 'Indtast venligst et gyldigt antal timer.',
    errSave: 'Der opstod en fejl under lagring.',
    successSave: 'Timer gemt med succes!',
    confirmDel: 'Er du sikker på, at du vil slette denne vagt?',
    promptPin: 'Admin-godkendelse kræves.\nIndtast et Admin PIN for at slette:',
    errPin: 'Fejl: PIN er forkert eller tilhører ikke en Admin. Sletning annulleret.',
    errDel: 'Der opstod en fejl under sletning.',
    successDel: 'Vagten blev slettet med succes.',
    noDataExp: 'Ingen data at eksportere.'
  },
  uk: {
    loading: 'Завантаження...',
    hello: 'Привіт',
    wrongPin: 'Невірний PIN. Спробуйте ще раз.',
    back: 'Назад',
    login: 'Увійти',
    logout: 'Вийти',
    store: 'Магазин',
    date: 'Дата',
    hoursWorked: 'Відпрацьовані години',
    hoursCol: 'Години',
    egHours: 'напр. 6 або 6.5',
    save: 'Зберегти години',
    myHoursBtn: '⏱️ Мої години',
    adminBtn: '📊 Таблиця годин (Admin)',
    statsTitle: 'Статистика (Admin)',
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
    export: '📥 Експорт в Excel',
    totals: 'Всього',
    noShifts: 'Зміни не знайдені.',
    hoursText: 'годин',
    totalMyHours: 'Всього годин:',
    details: 'Детально',
    noRecords: 'Немає записів.',
    shortDate: 'Дата',
    shortStore: 'Магазин',
    unknown: 'Невідомий',
    errInvalidHours: 'Будь ласка, введіть дійсну кількість годин.',
    errSave: 'Помилка збереження.',
    successSave: 'Години успішно збережено!',
    confirmDel: 'Ви впевнені, що хочете видалити цю зміну?',
    promptPin: 'Потрібен дозвіл адміністратора.\nВведіть Admin PIN для видалення:',
    errPin: 'Помилка: PIN невірний або не належить адміністратору. Видалення скасовано.',
    errDel: 'Виникла помилка під час видалення.',
    successDel: 'Зміну успішно видалено.',
    noDataExp: 'Немає даних для експорту.'
  }
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

  const [viewMode, setViewMode] = useState<'form' | 'dashboard' | 'my_hours'>('form');
  const [shifts, setShifts] = useState<any[]>([]);
  
  const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year' | 'custom'>('month');
  const [storeFilter, setStoreFilter] = useState<'All' | 'Hellas' | 'Nordic'>('All');
  const [employeeFilter, setEmployeeFilter] = useState<string>('All');
  
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Φορτώνει τυχόν αποθηκευμένο χρήστη και τους υπαλλήλους με το που ανοίγει η σελίδα
  useEffect(() => {
    const savedUser = localStorage.getItem('shiftSheetsUser');
    if (savedUser) {
      try {
        setLoggedInUser(JSON.parse(savedUser));
        setViewMode('form');
      } catch (e) {
        console.error("Σφάλμα ανάγνωσης αποθηκευμένου χρήστη.");
      }
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
      // Αποθήκευση στο κινητό/browser του χρήστη
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
    // Διαγραφή του χρήστη από τη μνήμη
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

    const { error: insertErr } = await supabase.from('shifts').insert([
      {
        employee_id: loggedInUser.id,
        store_location: storeLocation,
        shift_date: shiftDate,
        hours_worked: Number(hours)
      }
    ]);

    if (insertErr) {
      setSubmitMsg(t.errSave);
      console.error(insertErr);
    } else {
      setSubmitMsg(t.successSave);
      setHours('');
      setTimeout(() => setSubmitMsg(''), 3000);
    }
  };

  const loadDashboard = async () => {
    const { data, error: fetchError } = await supabase.from('shifts').select('*');
    if (data) {
      setShifts(data.filter(s => s.is_deleted !== true));
    }
    if (fetchError) console.error(fetchError);
    setViewMode('dashboard');
  };

  const handleLoadMyHours = async () => {
    const { data, error: fetchError } = await supabase.from('shifts').select('*').eq('employee_id', loggedInUser.id);
    if (data) {
      setShifts(data.filter(s => s.is_deleted !== true));
    }
    if (fetchError) console.error(fetchError);
    setViewMode('my_hours');
  };

  const handleDeleteShift = async (shiftId: string) => {
    const enteredPin = window.prompt(t.promptPin);
    if (enteredPin === null || enteredPin.trim() === '') return;

    const isAdmin = employees.some(emp => emp.pin === enteredPin && emp.role?.toLowerCase() === 'admin');

    if (!isAdmin) {
      alert(t.errPin);
      return;
    }

    const { error: updateErr } = await supabase.from('shifts').update({ is_deleted: true }).eq('id', shiftId);
    
    if (updateErr) {
      console.error(updateErr);
      alert(t.errDel);
    } else {
      setShifts(shifts.filter(s => s.id !== shiftId));
      alert(t.successDel);
    }
  };

  const handleExportCSV = (filteredShifts: any[]) => {
    if (filteredShifts.length === 0) {
      alert(t.noDataExp);
      return;
    }

    let csvContent = `\uFEFF${t.employee};${t.store};${t.date};${t.hoursCol}\n`;

    filteredShifts.forEach(shift => {
      const emp = employees.find(e => e.id === shift.employee_id);
      const empName = emp ? emp.name : t.unknown;
      const [year, month, day] = shift.shift_date.split('-');
      const formattedDate = `="${day}/${month}/${year}"`;
      csvContent += `${empName};${shift.store_location};${formattedDate};${shift.hours_worked}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // Ενημέρωση και εδώ στο όνομα του αρχείου
    link.setAttribute("download", `shiftsheets_export_${dateFilter}_${storeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const renderLangButtons = () => (
    <div className="w-full flex justify-end gap-2 mb-3">
      <button onClick={() => setLang('el')} className={`px-3 py-1 text-sm font-bold rounded-lg border-2 shadow-sm transition-colors ${lang === 'el' ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]' : 'bg-white text-gray-600 border-gray-200'}`}>🇬🇷 ΕΛ</button>
      <button onClick={() => setLang('da')} className={`px-3 py-1 text-sm font-bold rounded-lg border-2 shadow-sm transition-colors ${lang === 'da' ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]' : 'bg-white text-gray-600 border-gray-200'}`}>🇩🇰 DA</button>
      <button onClick={() => setLang('uk')} className={`px-3 py-1 text-sm font-bold rounded-lg border-2 shadow-sm transition-colors ${lang === 'uk' ? 'bg-[#8B5A2B] text-white border-[#8B5A2B]' : 'bg-white text-gray-600 border-gray-200'}`}>🇺🇦 UK</button>
    </div>
  );

  // ---------------- Οθόνη 3: Dashboard & My Hours ----------------
  if (loggedInUser && (viewMode === 'dashboard' || viewMode === 'my_hours')) {
    const filteredShifts = getFilteredShifts();
    const totals: Record<string, number> = {};
    let totalMyHours = 0;

    filteredShifts.forEach(shift => {
      const emp = employees.find(e => e.id === shift.employee_id);
      const empName = emp ? emp.name : t.unknown;
      totals[empName] = (totals[empName] || 0) + shift.hours_worked;
      if (viewMode === 'my_hours') {
        totalMyHours += shift.hours_worked;
      }
    });

    const sortedShifts = [...filteredShifts].sort((a, b) => 
      new Date(b.shift_date).getTime() - new Date(a.shift_date).getTime()
    );

    const isDash = viewMode === 'dashboard';
    
    const activeColor = isDash ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white';
    const inactiveColor = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    
    const storeActiveColor = isDash ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-blue-500 text-blue-600 bg-blue-50';
    const storeInactiveColor = 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white';
    
    const customBoxClass = isDash ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200';
    const customInputClass = isDash ? 'border-orange-300 focus:border-orange-500' : 'border-blue-300 focus:border-blue-500';

    return (
      <div className="min-h-screen bg-gray-100 p-3 sm:p-4 flex flex-col items-center justify-start pt-6 sm:pt-10">
        <div className="max-w-2xl w-full">
          {renderLangButtons()}
        </div>
        <div className={`bg-white p-4 sm:p-8 rounded-lg shadow-md border-t-4 max-w-2xl w-full ${isDash ? 'border-orange-500' : 'border-blue-500'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {isDash ? t.statsTitle : t.myHoursTitle}
            </h2>
            <div className="space-x-2 sm:space-x-3">
              <button 
                onClick={() => setViewMode('form')}
                className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 font-semibold p-2"
              >
                {t.back}
              </button>
              <button 
                onClick={handleLogout}
                className={`text-xs sm:text-sm font-semibold p-2 ${isDash ? 'text-[#8B5A2B] hover:text-orange-600' : 'text-blue-600 hover:text-blue-800'}`}
              >
                {t.logout}
              </button>
            </div>
          </div>

          {isDash && (
            <div className="mb-4 bg-orange-50 p-3 sm:p-4 rounded border border-orange-200">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">{t.employee}:</label>
              <select
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                className="w-full p-2 sm:p-3 border border-orange-300 rounded focus:outline-none focus:border-orange-500 text-sm sm:text-base bg-white"
              >
                <option value="All">{t.all}</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
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
                <input 
                  type="date" 
                  value={customStartDate} 
                  onChange={(e) => setCustomStartDate(e.target.value)} 
                  className={`w-full p-2 border rounded focus:outline-none text-sm bg-white ${customInputClass}`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">{t.to}</label>
                <input 
                  type="date" 
                  value={customEndDate} 
                  onChange={(e) => setCustomEndDate(e.target.value)} 
                  className={`w-full p-2 border rounded focus:outline-none text-sm bg-white ${customInputClass}`}
                />
              </div>
            </div>
          )}
         <div className="flex gap-1 sm:gap-2 mb-6 mt-2">
            <button onClick={() => setStoreFilter('All')} className={`flex-1 py-3 sm:py-2 rounded border-2 text-xs sm:text-sm font-bold transition-colors ${storeFilter === 'All' ? storeActiveColor : storeInactiveColor}`}>{t.allStores}</button>
            <button onClick={() => setStoreFilter('Hellas')} className={`flex-1 py-3 sm:py-2 rounded border-2 text-xs sm:text-sm font-bold transition-colors ${storeFilter === 'Hellas' ? storeActiveColor : storeInactiveColor}`}>Hellas</button>
            <button onClick={() => setStoreFilter('Nordic')} className={`flex-1 py-3 sm:py-2 rounded border-2 text-xs sm:text-sm font-bold transition-colors ${storeFilter === 'Nordic' ? storeActiveColor : storeInactiveColor}`}>Nordic</button>
          </div>

          <div className="flex justify-end mb-4">
            <button 
              onClick={() => handleExportCSV(filteredShifts)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded text-sm w-full sm:w-auto shadow-sm"
            >
              {t.export}
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-3 sm:p-4 mb-6">
            <h3 className="text-gray-700 font-bold mb-3 border-b pb-2 text-sm sm:text-base">{t.totals}</h3>
            {Object.keys(totals).length === 0 && (
              <p className="text-center text-gray-500 py-2 text-sm">{t.noShifts}</p>
            )}
            
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
            
            {sortedShifts.length === 0 && (
              <p className="text-center text-gray-500 py-2 text-sm">{t.noRecords}</p>
            )}

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
                      const emp = employees.find(e => e.id === shift.employee_id);
                      const empName = emp ? emp.name : t.unknown;
                      
                      return (
                        <tr key={shift.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3">{new Date(shift.shift_date).toLocaleDateString('el-GR').slice(0, 5)}</td>
                          {isDash && (
                            <td className="py-3 font-medium truncate max-w-[80px] sm:max-w-none">{empName}</td>
                          )}
                          <td className="py-3">{shift.store_location}</td>
                          <td className="py-3 text-center font-semibold">{shift.hours_worked}</td>
                          <td className="py-3 text-center">
                            <button 
                              onClick={() => handleDeleteShift(shift.id)}
                              className="text-red-500 hover:text-red-700 font-bold text-lg px-2 p-1"
                              title="Delete"
                            >
                              ✕
                            </button>
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

  // ---------------- Οθόνη 2: Φόρμα Καταγραφής Ωρών ----------------
  if (loggedInUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          {renderLangButtons()}
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border-t-4 border-orange-500 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {t.hello}, {loggedInUser.name}!
            </h2>
            <button 
              onClick={handleLogout}
              className="text-sm text-[#8B5A2B] hover:text-orange-600 font-semibold p-2"
            >
              {t.logout}
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.store}</label>
              <select 
                value={storeLocation} 
                onChange={(e) => setStoreLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-base bg-white"
              >
                <option value="Hellas">Hellas</option>
                <option value="Nordic">Nordic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.date}</label>
              <input 
                type="date" 
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.hoursWorked}</label>
              <input 
                type="number" 
                step="0.5"
                placeholder={t.egHours}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-base"
              />
            </div>

            <button 
              onClick={handleSaveShift}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded transition-colors mt-2 shadow-sm text-lg"
            >
              {t.save}
            </button>

            {submitMsg && (
              <p className={`text-center text-sm font-medium mt-2 ${submitMsg.includes('επιτυχώς') || submitMsg.includes('succes') || submitMsg.includes('успішно') ? 'text-green-600' : 'text-red-600'}`}>
                {submitMsg}
              </p>
            )}

            <button 
              onClick={handleLoadMyHours}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-4 rounded transition-colors mt-4 border-2 border-blue-200 shadow-sm text-base"
            >
              {t.myHoursBtn}
            </button>

            {loggedInUser.role?.toLowerCase() === 'admin' && (
              <button 
                onClick={loadDashboard}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded transition-colors mt-2 border-2 border-gray-300 shadow-sm text-base"
              >
                {t.adminBtn}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Οθόνη 1: Επιλογή Υπαλλήλου / PIN (Αρχική) ----------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        {renderLangButtons()}
      </div>
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border-b-4 border-[#8B5A2B] max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
          ShiftSheets
        </h1>

        {!selectedUser && (
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4">
            {employees.length === 0 && (
              <p className="col-span-1 min-[400px]:col-span-2 text-center text-gray-500 text-sm">{t.loading}</p>
            )}
            
            {employees.length > 0 && employees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => setSelectedUser(emp)}
                className="bg-gray-50 hover:bg-orange-100 text-gray-800 font-semibold py-5 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-colors text-lg active:bg-orange-200"
              >
                {emp.name}
              </button>
            ))}
          </div>
        )}
        
        {selectedUser && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl text-gray-700 mb-6">
              {t.hello}, <span className="font-bold text-orange-600">{selectedUser.name}</span>
            </h2>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="****"
              className="w-40 text-center text-4xl tracking-[0.5em] p-4 border-2 border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-orange-500 bg-gray-50"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}
            
            <div className="flex w-full gap-3 sm:gap-4">
              <button
                onClick={() => { setSelectedUser(null); setPin(''); setError(''); }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-lg transition-colors text-lg"
              >
                {t.back}
              </button>
              <button
                onClick={handleLogin}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors text-lg shadow-sm"
              >
                {t.login}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}