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
  const [submitMsg, setSubmitMsg] = useState('');

  const [viewMode, setViewMode] = useState<'form' | 'dashboard'>('form');
  const [shifts, setShifts] = useState<any[]>([]);
  
  // Προσθήκη επιλογής 'custom' στο φίλτρο
  const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year' | 'custom'>('month');
  const [storeFilter, setStoreFilter] = useState<'All' | 'Hellas' | 'Nordic'>('All');
  
  // Νέα states για το εύρος ημερομηνιών
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

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

    const { error } = await supabase.from('shifts').insert([
      {
        employee_id: loggedInUser.id,
        store_location: storeLocation,
        shift_date: shiftDate,
        hours_worked: Number(hours)
      }
    ]);

    if (error) {
      setSubmitMsg('Υπήρξε σφάλμα κατά την αποθήκευση.');
      console.error(error);
    } else {
      setSubmitMsg('Οι ώρες αποθηκεύτηκαν επιτυχώς!');
      setHours('');
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

    let csvContent = "\uFEFFΥπάλληλος;Κατάστημα;Ημερομηνία;Ώρες\n";

    filteredShifts.forEach(shift => {
      const emp = employees.find(e => e.id === shift.employee_id);
      const empName = emp ? emp.name : 'Άγνωστος';
      
      const [year, month, day] = shift.shift_date.split('-');
      const formattedDate = `="${day}/${month}/${year}"`;
      
      csvContent += `${empName};${shift.store_location};${formattedDate};${shift.hours_worked}\n`;
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

      return dateMatch && storeMatch;
    });
  };

  // ---------------- Οθόνη 3: Dashboard Admin ----------------
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
      <div className="min-h-screen bg-gray-100 p-3 sm:p-4 flex justify-center items-start pt-6 sm:pt-10">
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md border-t-4 border-orange-500 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Στατιστικά</h2>
            <div className="space-x-2 sm:space-x-3">
              <button 
                onClick={() => setViewMode('form')}
                className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 font-semibold p-2"
              >
                Πίσω
              </button>
              <button 
                onClick={() => { setLoggedInUser(null); setViewMode('form'); }}
                className="text-xs sm:text-sm text-[#8B5A2B] hover:text-orange-600 font-semibold p-2"
              >
                Έξοδος
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-3">
            <button onClick={() => setDateFilter('week')} className={`py-3 sm:py-2 rounded text-xs sm:text-sm font-bold transition-colors ${dateFilter === 'week' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Εβδομάδα</button>
            <button onClick={() => setDateFilter('month')} className={`py-3 sm:py-2 rounded text-xs sm:text-sm font-bold transition-colors ${dateFilter === 'month' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Μήνας</button>
            <button onClick={() => setDateFilter('year')} className={`py-3 sm:py-2 rounded text-xs sm:text-sm font-bold transition-colors ${dateFilter === 'year' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Χρονιά</button>
            <button onClick={() => setDateFilter('custom')} className={`py-3 sm:py-2 rounded text-xs sm:text-sm font-bold transition-colors ${dateFilter === 'custom' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Εύρος</button>
          </div>

          {/* Νέο μενού για την επιλογή εύρους ημερομηνιών */}
          {dateFilter === 'custom' && (
            <div className="flex flex-col sm:flex-row gap-3 mb-4 bg-orange-50 p-4 rounded border border-orange-200 shadow-sm">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Από:</label>
                <input 
                  type="date" 
                  value={customStartDate} 
                  onChange={(e) => setCustomStartDate(e.target.value)} 
                  className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Έως:</label>
                <input 
                  type="date" 
                  value={customEndDate} 
                  onChange={(e) => setCustomEndDate(e.target.value)} 
                  className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex gap-1 sm:gap-2 mb-6 mt-2">
            <button onClick={() => setStoreFilter('All')} className={`flex-1 py-3 sm:py-2 rounded border-2 text-xs sm:text-sm font-bold transition-colors ${storeFilter === 'All' ? 'border-[#8B5A2B] text-[#8B5A2B] bg-orange-50' : 'border-gray-200 text-gray-500'}`}>Όλα</button>
            <button onClick={() => setStoreFilter('Hellas')} className={`flex-1 py-3 sm:py-2 rounded border-2 text-xs sm:text-sm font-bold transition-colors ${storeFilter === 'Hellas' ? 'border-[#8B5A2B] text-[#8B5A2B] bg-orange-50' : 'border-gray-200 text-gray-500'}`}>Hellas</button>
            <button onClick={() => setStoreFilter('Nordic')} className={`flex-1 py-3 sm:py-2 rounded border-2 text-xs sm:text-sm font-bold transition-colors ${storeFilter === 'Nordic' ? 'border-[#8B5A2B] text-[#8B5A2B] bg-orange-50' : 'border-gray-200 text-gray-500'}`}>Nordic</button>
          </div>

          <div className="flex justify-end mb-4">
            <button 
              onClick={() => handleExportCSV(filteredShifts)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded text-sm w-full sm:w-auto shadow-sm"
            >
              📥 Εξαγωγή σε Excel
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-3 sm:p-4 mb-6">
            <h3 className="text-gray-700 font-bold mb-3 border-b pb-2 text-sm sm:text-base">Σύνολα</h3>
            {Object.keys(totals).length === 0 ? (
              <p className="text-center text-gray-500 py-2 text-sm">Δεν βρέθηκαν βάρδιες.</p>
            ) : (
              <table className="w-full text-left text-sm sm:text-base">
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

          <div className="bg-white border border-gray-200 rounded p-3 sm:p-4 shadow-sm">
            <h3 className="text-gray-700 font-bold mb-3 border-b pb-2 text-sm sm:text-base">Αναλυτικά</h3>
            {sortedShifts.length === 0 ? (
              <p className="text-center text-gray-500 py-2 text-sm">Δεν υπάρχουν καταχωρήσεις.</p>
            ) : (
              <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                <table className="w-full text-left text-xs sm:text-sm min-w-[350px]">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="pb-2">Ημ/νία</th>
                      <th className="pb-2">Υπάλληλος</th>
                      <th className="pb-2">Μαγαζί</th>
                      <th className="pb-2 text-center">Ώρες</th>
                      <th className="pb-2 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedShifts.map((shift) => {
                      const emp = employees.find(e => e.id === shift.employee_id);
                      const empName = emp ? emp.name : 'Άγνωστος';
                      
                      return (
                        <tr key={shift.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3">{new Date(shift.shift_date).toLocaleDateString('el-GR').slice(0, 5)}</td>
                          <td className="py-3 font-medium truncate max-w-[80px] sm:max-w-none">{empName}</td>
                          <td className="py-3">{shift.store_location}</td>
                          <td className="py-3 text-center font-semibold">{shift.hours_worked}</td>
                          <td className="py-3 text-center">
                            <button 
                              onClick={() => handleDeleteShift(shift.id)}
                              className="text-red-500 hover:text-red-700 font-bold text-lg px-2 p-1"
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border-t-4 border-orange-500 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Γεια σου, {loggedInUser.name}!
            </h2>
            <button 
              onClick={() => { setLoggedInUser(null); setSubmitMsg(''); setHours(''); }}
              className="text-sm text-[#8B5A2B] hover:text-orange-600 font-semibold p-2"
            >
              Αποσύνδεση
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Κατάστημα</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Ημερομηνία</label>
              <input 
                type="date" 
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-base"
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
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-base"
              />
            </div>

            <button 
              onClick={handleSaveShift}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded transition-colors mt-2 shadow-sm text-lg"
            >
              Καταχώρηση Ωρών
            </button>

            {submitMsg && (
              <p className={`text-center text-sm font-medium mt-2 ${submitMsg.includes('επιτυχώς') ? 'text-green-600' : 'text-red-600'}`}>
                {submitMsg}
              </p>
            )}

            {loggedInUser.role?.toLowerCase() === 'admin' && (
              <button 
                onClick={loadDashboard}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded transition-colors mt-6 border-2 border-gray-300 shadow-sm"
              >
                📊 Πίνακας Ωρών (Admin)
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
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border-b-4 border-[#8B5A2B] max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
          Servato
        </h1>

        {!selectedUser ? (
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4">
            {employees.length === 0 ? (
              <p className="col-span-1 min-[400px]:col-span-2 text-center text-gray-500 text-sm">Φόρτωση υπαλλήλων...</p>
            ) : (
              employees.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => setSelectedUser(emp)}
                  className="bg-gray-50 hover:bg-orange-100 text-gray-800 font-semibold py-5 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-colors text-lg active:bg-orange-200"
                >
                  {emp.name}
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-xl text-gray-700 mb-6">
              Γεια σου, <span className="font-bold text-orange-600">{selectedUser.name}</span>
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
                Πίσω
              </button>
              <button
                onClick={handleLogin}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors text-lg shadow-sm"
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
