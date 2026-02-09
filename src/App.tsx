import './App.css';
import { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import type { Instrument } from './types';
import sampleData from './sampleData.json';

// 1. Lazy Loading the component
// This moves FinancialTable into its own JS chunk, loaded only when needed.
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

  // 2. Memoization of Data
  // If this App component re-renders for other reasons (like a theme toggle),
  // useMemo ensures we don't treat 'data' as a "new" object unless it actually is.
  const memoizedData = useMemo(() => data, [data]);



  return (
    <div className="App">
      <header className="App-header">
        <h1>Financial Instruments</h1>
      </header>
      <main>
        {/* 3. Suspense Boundary */}
        {/* Required when using React.lazy to show a loader while the chunk downloads */}
        <Suspense fallback={<p>Loading Table...</p>}>
          <FinancialTable data={memoizedData} />
        </Suspense>
      </main>
    </div>
  );
}

export default App;