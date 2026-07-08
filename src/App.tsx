import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import BriefPage from './pages/BriefPage';
import RegionsPage from './pages/RegionsPage';
import MapPage from './pages/MapPage';
import RegionDetailPage from './pages/RegionDetailPage';
import PlotDetailPage from './pages/PlotDetailPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/brief" element={<BriefPage />} />
          <Route path="/regions" element={<RegionsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/region/:id" element={<RegionDetailPage />} />
          <Route path="/plot/:id" element={<PlotDetailPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
