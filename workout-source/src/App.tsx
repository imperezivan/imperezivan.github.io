import { HashRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Exercises } from './pages/Exercises';
import { WorkoutForm } from './pages/WorkoutForm';
import { WorkoutDetail } from './pages/WorkoutDetail';
import { Stats } from './pages/Stats';

export function App() {
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="exercises" element={<Exercises />} />
            <Route path="workout/new" element={<WorkoutForm />} />
            <Route path="workout/:id" element={<WorkoutDetail />} />
            <Route path="workout/:id/edit" element={<WorkoutForm />} />
            <Route path="stats" element={<Stats />} />
          </Route>
        </Routes>
      </HashRouter>
    </DataProvider>
  );
}

export default App;
