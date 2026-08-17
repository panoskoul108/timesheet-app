import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  // States για τη φόρμα καταγραφής ωρών
  const [storeLocation, setStoreLocation] = useState('Μαγαζί 1');
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]); // Σημερινή ημερομηνία
  const [hours, setHours] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');

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
      setHours(''); // Καθαρισμός πεδίου για επόμενη χρήση
      setTimeout(() => setSubmitMsg(''), 3000); // Κρύβει το μήνυμα μετά από 3 δευτερόλεπτα
    }
  };

  // Οθόνη 2: Φόρμα Καταγραφής Ωρών (Αφού κάνει Login)
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
                {/* Μπορείς να αλλάξεις τα ονόματα των μαγαζιών εδώ */}
                <option value="Μαγαζί 1">Μαγαζί 1</option>
                <option value="Μαγαζί 2">Μαγαζί 2</option>
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
          </div>
        </div>
      </div>
    );
  }

  // Οθόνη 1: Επιλογή / Εισαγωγή PIN (Αρχική)
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border-b-4 border-[#8B5A2B] max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Παρουσιολόγιο
        </h1>

        {!selectedUser ? (
          <div className="grid grid-cols-2 gap-3">
            {employees.length === 0 ? (
              <p className="col-span-2 text-center text-gray-500 text-sm">Δεν βρέθηκαν υπάλληλοι. Πρόσθεσε στο Supabase.</p>
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
