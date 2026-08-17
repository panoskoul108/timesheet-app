import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const [storeLocation, setStoreLocation] = useState('Hellas');
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');
  const [woltStars, setWoltStars] = useState(''); // Νέο state για τα αστεράκια Wolt
  const [submitMsg, setSubmitMsg] = useState('');

  const [viewMode, setViewMode] = useState<'form' | 'dashboard'>('form');
  const [shifts, setShifts] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year'>('month');
  const [storeFilter, setStoreFilter] = useState<'All' | 'Hellas' | 'Nordic'>('All');

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from('employees').select('*');
      if (data) setEmployees(data);
      if (error) console.error('Σφάλμα:', error);
    };
    fetchEmployees();
  }, []);

  const handleLogin = () => {
    if (selectedUser.pin === pin) {
      setLoggedInUser(selectedUser);
      setError('');
      setPin('');
      setViewMode('form');
    } else {
      setError('Λάθος PIN. Προσπάθησε ξανά.');
      setPin('');
    }
  };

  const handleSaveShift = async () => {
    if (!hours || isNaN(Number(hours))) {
      setSubmitMsg('Παρακαλώ βάλε σωστό αριθμό ωρών.');
      return;
    }

    // Φτιάχνουμε τα δεδομένα προς αποθήκευση
    const payload: any = {
      employee_id: loggedInUser.id,
      store_location: storeLocation,
      shift_date: shiftDate,
      hours_worked: Number(hours)
    };

    // Αν ο χρήστης επέλεξε αστεράκια, τα προσθέτουμε στα δεδομένα
    if (woltStars) {
      payload.wolt_stars = Number(woltStars);
    }

    const { error } = await supabase.from('shifts').insert([payload]);

    if (error) {
      setSubmitMsg('Υπήρξε σφάλμα κατά την αποθήκευση.');
      console.error(error);
    } else {
      setSubmitMsg('Οι ώρες αποθηκεύτηκαν επιτυχώς!');
      setHours('');
      setWoltStars(''); // Καθαρισμός πεδίου μετά την αποθήκευση
      setTimeout(() => setSubmitMsg(''), 3000);
    }
  };

  const loadDashboard = async () => {
    const { data, error } = await supabase.from('shifts').select('*');
    if (data) {
      const activeShifts = data.filter(s => s.is_deleted !== true);
      setShifts(activeShifts);
    }
    if (error) console.error(error);
    setViewMode('dashboard');
  };

  const handleDeleteShift = async (shiftId: string) => {
    const confirmDelete = window.confirm("Σίγουρα θέλεις να διαγράψεις αυτή τη βάρδια;");
    if (!confirmDelete) return;

    const { error } = await supabase.from('shifts').update({ is_deleted: true }).eq('id', shiftId);
    
    if (error) {
      console.error(error);
      alert('Υπήρξε σφάλμα κατά τη διαγραφή.');
    } else {
      setShifts(shifts.filter(s => s.id !== shiftId));
    }
  };

  const handleExportCSV = (filteredShifts: any[]) => {
    if (filteredShifts.length === 0) {
      alert('Δεν υπάρχουν δεδομένα για εξαγωγή.');
      return;
    }

    // Προσθέσαμε τη στήλη για τα αστεράκια Wolt στο Excel
    let csvContent = "\uFEFFΥπάλληλος;Κατάστημα;Ημερομηνία;Ώρες;Αστεράκια Wolt\n";

    filteredShifts.forEach(shift => {
      const emp = employees.find(e => e.id === shift.employee_id);
      const empName = emp ? emp.name : 'Άγνωστος';
      
      const [year, month, day] = shift.shift_date.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      
      const stars = shift.wolt_stars ? shift.wolt_stars : '-';
      
      csvContent += `${empName};${shift.store_location};${formattedDate};${shift.hours_worked};${stars}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `servato_export_${dateFilter}_${storeFilter}.csv`);
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
      }

      let storeMatch = true;
      if (storeFilter !== 'All') {
        storeMatch = shift.store_location === storeFilter;
      }

      return dateMatch && storeMatch;
    });
  };

  if (loggedInUser && viewMode === 'dashboard') {
    const filteredShifts = getFilteredShifts();
    
    const totals: Record<string, number> = {};
    filteredShifts.forEach(shift => {
      const emp = employees.find(e => e.id === shift.employee_id);
      const empName = emp ? emp.name : 'Άγνωστος';
      totals[empName] = (totals[empName] || 0) + shift.hours_worked;
    });

    const sortedShifts = [...filteredShifts].sort((a, b) => 
      new Date(b.shift_date).getTime() - new Date(a.shift_date).getTime()
    );

    return (
      <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start pt-10">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border-t-4 border-orange-500 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Στατιστικά Ωρών</h2>
            <div className="space-x-3">
              <button 
                onClick={() => setViewMode('form')}
                className="text-sm text-gray-600 hover:text-gray-800 font-semibold transition-colors"
              >
                Πίσω
              </button>
              <button 
                onClick={() => { setLoggedInUser(null); setViewMode('form'); }}
                className="text-sm text-[#8B5A2B] hover:text-orange-600 font-semibold transition-colors"
              >
                Αποσύνδεση
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <button onClick={() => setDateFilter('week')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${dateFilter === 'week' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Εβδομάδα</button>
            <button onClick={() => setDateFilter('month')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${dateFilter === 'month' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Μήνας</button>
            <button onClick={() => setDateFilter('year')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${dateFilter === 'year' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Χρονιά</button>
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={() => setStoreFilter('All')} className={`flex-1 py-2 rounded border-2 text-sm font-bold transition-colors ${storeFilter === 'All' ? 'border-[#8B5A2B] text-[#8B5A2B] bg-orange-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>Όλα τα Μαγαζιά</button>
            <button onClick={() => setStoreFilter('Hellas')} className={`flex-1 py-2 rounded border-2 text-sm font-bold transition-colors ${storeFilter === 'Hellas' ? 'border-[#8B5A2B] text-[#8B5A2B] bg-orange-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>Hellas</button>
            <button onClick={() => setStoreFilter('Nordic')} className={`flex-1 py-2 rounded border-2 text-sm font-bold transition-colors ${storeFilter === 'Nordic' ? 'border-[#8B5A2B] text-[#8B5A2B] bg-orange-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>Nordic</button>
          </div>

          <div className="flex justify-end mb-4">
            <button 
              onClick={() => handleExportCSV(filteredShifts)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors"
            >
              📥 Εξαγωγή σε Excel
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-8">
            <h3 className="text-gray-700 font-bold mb-3 border-b pb-2">Σύνολα</h3>
            {Object.keys(totals).length === 0 ? (
              <p className="text-center text-gray-500 py-2">Δεν βρέθηκαν βάρδιες.</p>
            ) : (
              <table className="w-full text-left">
                <tbody>
                  {Object.entries(totals).map(([name, totalHours]) => (
                    <tr key={name} className="border-b border-gray-200 last:border-0">
                      <td className="py-2 text-gray-800 font-medium">{name}</td>
                      <td className="py-2 text-right font-bold text-orange-600">{totalHours} ώρες</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded p-4 shadow-sm">
            <h3 className="text-gray-700 font-bold mb-3 border-b pb-2">Αναλυτικές Καταχωρήσεις</h3>
            {sortedShifts.length === 0 ? (
              <p className="text-center text-gray-500 py-2">Δεν υπάρχουν καταχωρήσεις.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="pb-2">Ημ/νία</th>
                      <th className="pb-2">Υπάλληλος</th>
                      <th className="pb-2">Κατάστημα</th>
                      <th className="pb-2 text-center">Ώρες</th>
                      <th className="pb-2 text-center">Wolt</th>
                      <th className="pb-2 text-center">Διαγραφή</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedShifts.map((shift) => {
                      const emp = employees.find(e => e.id === shift.employee_id);
                      const empName = emp ? emp.name : 'Άγνωστος';
                      
                      return (
                        <tr key={shift.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-2">{new Date(shift.shift_date).toLocaleDateString('el-GR')}</td>
                          <td className="py-2 font-medium">{empName}</td>
                          <td className="py-2">{shift.store_location}</td>
                          <td className="py-2 text-center font-semibold">{shift.hours_worked}</td>
                          <td className="py-2 text-center text-orange-500 font-bold">
                            {shift.wolt_stars ? `${shift.wolt_stars} ⭐` : '-'}
                          </td>
                          <td className="py-2 text-center">
                            <button 
                              onClick={() => handleDeleteShift(shift.id)}
                              className="text-red-500 hover:text-red-700 font-bold text-lg px-2"
                              title="Ασφαλής Διαγραφή"
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

  if (loggedInUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border-t-4 border-orange-500 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Γεια σου, {loggedInUser.name}!
            </h2>
            <button 
              onClick={() => { setLoggedInUser(null); setSubmitMsg(''); setHours(''); setWoltStars(''); }}
              className="text-sm text-[#8B5A2B] hover:text-orange-600 font-semibold transition-colors"
            >
              Αποσύνδεση
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Κατάστημα</label>
              <select 
                value={storeLocation} 
                onChange={(e) => setStoreLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              >
                <option value="Hellas">Hellas</option>
                <option value="Nordic">Nordic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ημερομηνία</label>
              <input 
                type="date" 
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ώρες που δούλεψες</label>
              <input 
                type="number" 
                step="0.5"
                placeholder="π.χ. 6 ή 6.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Νέο προαιρετικό πεδίο για τα αστεράκια Wolt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Αστεράκια Wolt (Προαιρετικό)</label>
              <select 
                value={woltStars} 
                onChange={(e) => setWoltStars(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Κανένα --</option>
                <option value="1">1 ⭐</option>
                <option value="2">2 ⭐⭐</option>
                <option value="3">3 ⭐⭐⭐</option>
                <option value="4">4 ⭐⭐⭐⭐</option>
                <option value="5">5 ⭐⭐⭐⭐⭐</option>
              </select>
            </div>

            <button 
              onClick={handleSaveShift}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded transition-colors mt-4"
            >
              Καταχώρηση Ωρών
            </button>

            {submitMsg && (
              <p className={`text-center text-sm font-medium mt-3 ${submitMsg.includes('επιτυχώς') ? 'text-green-600' : 'text-red-600'}`}>
                {submitMsg}
              </p>
            )}

            {loggedInUser.role?.toLowerCase() === 'admin' && (
              <button 
                onClick={loadDashboard}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded transition-colors mt-6 border-2 border-gray-300"
              >
                📊 Πίνακας Ωρών (Admin)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border-b-4 border-[#8B5A2B] max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Servato
        </h1>

        {!selectedUser ? (
          <div className="grid grid-cols-2 gap-3">
            {employees.length === 0 ? (
              <p className="col-span-2 text-center text-gray-500 text-sm">Φόρτωση υπαλλήλων...</p>
            ) : (
              employees.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => setSelectedUser(emp)}
                  className="bg-gray-50 hover:bg-orange-100 text-gray-700 font-medium py-4 rounded border border-gray-200 hover:border-orange-500 transition-colors"
                >
                  {emp.name}
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-xl text-gray-700 mb-4">
              Γεια σου, <span className="font-bold text-orange-600">{selectedUser.name}</span>
            </h2>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="****"
              className="w-32 text-center text-3xl tracking-[0.5em] p-2 border-2 border-gray-300 rounded mb-4 focus:outline-none focus:border-orange-500"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            
            <div className="flex w-full gap-3">
              <button
                onClick={() => { setSelectedUser(null); setPin(''); setError(''); }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded transition-colors"
              >
                Πίσω
              </button>
              <button
                onClick={handleLogin}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded transition-colors"
              >
                Είσοδος
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
