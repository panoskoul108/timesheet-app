import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function App() {
  // Γενικά States
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  // States για τη φόρμα καταγραφής
  const [storeLocation, setStoreLocation] = useState('Hellas');
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');

  // States για τον πίνακα Admin
  const [viewMode, setViewMode] = useState<'form' | 'dashboard'>('form');
  const [shifts, setShifts] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year'>('month');
  const [storeFilter, setStoreFilter] = useState<'All' | 'Hellas' | 'Nordic'>('All'); // Νέο state για το μαγαζί

  // Φόρτωση εργαζομένων κατά το άνοιγμα
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

  // Φόρτωση βαρδιών για το Dashboard
  const loadDashboard = async () => {
    const { data, error } = await supabase.from('shifts').select('*');
    if (data) setShifts(data);
    if (error) console.error(error);
    setViewMode('dashboard');
  };

  // Φιλτράρισμα και υπολογισμός ωρών ανάλογα με την επιλογή χρόνου & μαγαζιού
  const getFilteredTotals = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const filtered = shifts.filter(shift => {
      const sDate = new Date(shift.shift_date);
      
      // 1. Έλεγχος Ημερομηνίας
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

      // 2. Έλεγχος Μαγαζιού
      let storeMatch = true;
      if (storeFilter !== 'All') {
        storeMatch = shift.store_location === storeFilter;
      }

      // Επιστρέφει true μόνο αν ταιριάζουν ΚΑΙ τα δύο φίλτρα
      return dateMatch && storeMatch;
    });

    // Ομαδοποίηση ωρών ανά υπάλληλο
    const totals: Record<string, number> = {};
    filtered.forEach(shift => {
      const emp = employees.find(e => e.id === shift.employee_id);
      const empName = emp ? emp.name : 'Άγνωστος';
      totals[empName] = (totals[empName] || 0) + shift.hours_worked;
    });
    
    return totals;
  };

  // ---------------- Οθόνη 3: Dashboard Admin ----------------
  if (loggedInUser && viewMode === 'dashboard') {
    const totals = getFilteredTotals();
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

          {/* Φίλτρα Ημερομηνίας */}
          <div className="flex gap-2 mb-3">
            <button onClick={() => setDateFilter('week')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${dateFilter === 'week' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Εβδομάδα</button>
            <button onClick={() => setDateFilter('month')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${dateFilter === 'month' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Μήνας</button>
            <button onClick={() => setDateFilter('year')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${dateFilter === 'year' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Χρονιά</button>
          </div>

          {/* Φίλτρα Μαγαζιού */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setStoreFilter('All')} className={`flex-1 py-2 rounded border-2 text-sm font-bold transition-colors ${storeFilter === 'All' ? 'border-[#8B5A2B] text-[#8B5A2B] bg-orange-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>Όλα τα Μαγαζιά</button>
            <button onClick={() => setStoreFilter('Hellas')} className={`flex-1 py-2 rounded border-2 text-sm font-bold transition-colors ${storeFilter === 'Hellas' ? 'border-[#8B5A2B] text-[#8B5A2B] bg-orange-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>Hellas</button>
            <button onClick={() => setStoreFilter('Nordic')} className={`flex-1 py-2 rounded border-2 text-sm font-bold transition-colors ${storeFilter === 'Nordic' ? 'border-[#8B5A2B] text-[#8B5A2B] bg-orange-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>Nordic</button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            {Object.keys(totals).length === 0 ? (
              <p className="text-center text-gray-500 py-4">Δεν βρέθηκαν βάρδιες για αυτόν τον συνδυασμό φίλτρων.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="pb-2 font-semibold text-gray-700">Υπάλληλος</th>
                    <th className="pb-2 font-semibold text-gray-700 text-right">Σύνολο Ωρών</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(totals).map(([name, totalHours]) => (
                    <tr key={name} className="border-b border-gray-200 last:border-0">
                      <td className="py-3 text-gray-800 font-medium">{name}</td>
                      <td className="py-3 text-right font-bold text-orange-600">{totalHours} ώρες</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border-t-4 border-orange-500 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Γεια σου, {loggedInUser.name}!
            </h2>
            <button 
              onClick={() => { setLoggedInUser(null); setSubmitMsg(''); setHours(''); }}
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

            {/* Εμφανίζεται ΜΟΝΟ αν ο χρήστης είναι Admin */}
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

  // ---------------- Οθόνη 1: Επιλογή Υπαλλήλου / PIN (Αρχική) ----------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border-b-4 border-[#8B5A2B] max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Παρουσιολόγιο
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
