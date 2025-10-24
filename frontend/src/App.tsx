import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import FeaturedProperties from "./components/FeaturedProperties/FeaturedProperties";
import AddPropertyForm from "./components/FeaturedProperties/AddPropertyForm";
import OwnerBillingPage from "./pages/OwnerBillingPage";
import TenantBillingPage from "./pages/TenantBillingPage";
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './components/Login';
import AddContractForm from './components/Contracts/AddContractForm';
import PublicPropertiesList from './components/PublicPropertyList';
import OwnerPropertiesList from './components/OwnerPropetiesList';
import PropertyMap from './pages/Map';
import PropertyDetailPage from './pages/PropertyDetailPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/" element={<FeaturedProperties />} />
            <Route path="/propiedades" element={<PublicPropertiesList />} />
            <Route path="/propiedades/nueva" element={<AddPropertyForm />} />
            <Route path="/mis-propiedades" element={<OwnerPropertiesList />} />
            <Route path="/servicios" element={<div>Página de Servicios - En construcción</div>} />
            <Route path="/nosotros" element={<div>Página Nosotros - En construcción</div>} />
            <Route path="/contacto" element={<div>Página Contacto - En construcción</div>} />
            <Route path="/contratos" element={<AddContractForm />} />
            <Route path="/mapa" element={<PropertyMap />} />
            {/* 👇 Vista del propietario */}
            <Route path="/owner/billing" element={<OwnerBillingPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />

            {/* 👇 Vista del inquilino */}
            <Route path="/tenant/billing" element={<TenantBillingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/consulta" element={<div>Página Consulta - En construcción</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;