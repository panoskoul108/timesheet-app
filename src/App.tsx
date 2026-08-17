import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function App() {
  // Χρησιμοποιούμε <any> για να περάσει ο κώδικας στο TypeScript χωρίς αυστηρούς ελέγχους
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

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

  if (loggedInUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-orange-500 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Καλωσήρθες, {loggedInUser.name}!
          </h2>
          <p className="text-gray-600 mb-6">Οθόνη καταγραφής ωρών (Έρχεται στο επόμενο βήμα)</p>
          <button 
            onClick={() => setLoggedInUser(null)}
            className="text-sm text-[#8B5A2B] hover:text-orange-600 font-semibold"
          >
            Αποσύνδεση
          </button>
        </div>
      </div>
    );
  }

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
