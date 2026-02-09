import './App.css';
import { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import type { Instrument } from './types';
import sampleData from './sampleData.json';

const FinancialTable = lazy(() => import('./components/FinancialTable'));

function App() {
  const [data, setData] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInstruments = (): Promise<Instrument[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sampleData as Instrument[]);
      }, 500);
    });
  };

  useEffect(() => {
    fetchInstruments()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const memoizedData = useMemo(() => data, [data]);



  return (
    <div className="App">
      <header className="App-header">
        <h1>Financial Instruments</h1>
      </header>
      <main>

        <Suspense fallback={<p>Loading Table...</p>}>
          <FinancialTable data={memoizedData} />
        </Suspense>
      </main>
    </div>
  );
}

export default App;