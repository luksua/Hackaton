import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      className="hero-section text-center text-white d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('/images/fondo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "85vh",
        position: "relative",
      }}
    >
      <div
        className="overlay"
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
      ></div>

      <Container className="position-relative z-1">
        <h1 className="display-5 fw-bold mb-3">Tu Hogar Ideal te Espera</h1>
        <p className="lead mb-4">Descubre Propiedades Exclusivas en tu Ciudad</p>
        <Button
          variant="success"
          size="lg"
          className="rounded-pill px-4 fw-semibold"
          onClick={() => navigate("/propiedades")}
        >
          Ver Detalles
        </Button>
      </Container>
    </section>
  );
};

export default Hero;



// import React, { useState } from 'react';
// import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';

// const Hero: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Buscando:', searchTerm);
//   };

//   return (
//     <section 
//       className="hero-section position-relative overflow-hidden"
//       style={{
//         background: 'linear-gradient(135deg, rgba(30, 66, 50, 0.9) 0%, rgba(63, 163, 123, 0.7) 100%), url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center'
//       }}
//     >
//       <Container className="position-relative z-2">
//         <Row className="min-vh-100 align-items-center py-5">
//           <Col lg={8} className="mx-auto text-center text-white">
//             <div className="hero-content">
//               <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInUp">
//                 Encuentra Tu <span className="text-warning">Hogar Ideal</span>
//               </h1>
//               <p className="lead mb-5 fs-5 animate__animated animate__fadeInUp animate__delay-1s">
//                 Descubre propiedades exclusivas con Nova Habitat, tu socio de confianza en bienes raíces.
//                 Innovación y sostenibilidad en cada proyecto.
//               </p>
              
//               {/* Search Bar Mejorada */}
//               <div className="search-container animate__animated animate__fadeInUp animate__delay-2s">
//                 <Form onSubmit={handleSearch} className="search-form">
//                   <InputGroup size="lg" className="shadow-lg rounded-pill">
//                     <Form.Control
//                       type="text"
//                       placeholder="Buscar por ubicación, tipo de propiedad..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="border-0 rounded-start-pill ps-4"
//                     />
//                     <Button 
//                       type="submit"
//                       className="btn-primary-custom rounded-end-pill px-4"
//                     >
//                       <i className="bi bi-search me-2"></i>
//                       Buscar
//                     </Button>
//                   </InputGroup>
//                 </Form>
                
//                 {/* Filtros rápidos */}
//                 <div className="quick-filters mt-4">
//                   <div className="d-flex flex-wrap justify-content-center gap-3">
//                     {['Casas', 'Apartamentos', 'Oficinas', 'Terrenos', 'Lujo'].map((filter) => (
//                       <Button
//                         key={filter}
//                         variant="outline-light"
//                         size="sm"
//                         className="rounded-pill px-3"
//                       >
//                         {filter}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="hero-stats row mt-5 pt-4">
//                 <div className="col-md-4">
//                   <div className="stat-item">
//                     <h3 className="text-warning fw-bold">500+</h3>
//                     <p className="mb-0">Propiedades</p>
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <div className="stat-item">
//                     <h3 className="text-warning fw-bold">15+</h3>
//                     <p className="mb-0">Años de Experiencia</p>
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <div className="stat-item">
//                     <h3 className="text-warning fw-bold">98%</h3>
//                     <p className="mb-0">Clientes Satisfechos</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>

//       {/* Elementos decorativos */}
//       <div className="hero-shapes">
//         <div className="shape shape-1"></div>
//         <div className="shape shape-2"></div>
//         <div className="shape shape-3"></div>
//       </div>
//     </section>
//   );
// };

// export default Hero;