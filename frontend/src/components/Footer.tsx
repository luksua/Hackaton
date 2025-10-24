import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-5">
      <Container>
        <Row className="mb-4">
          <Col md={3}>
            <h5 className="fw-bold">Nova Habitat</h5>
            <p className="small text-white-50">
              Encuentra el lugar de tus sueños.
            </p>
          </Col>
          <Col md={3}>
            <h6 className="fw-bold">Navegación</h6>
            <ul className="list-unstyled small text-white-50">
              <li>Propiedades</li>
              <li>Propietarios</li>
              <li>Blog</li>
              <li>Contacto</li>
            </ul>
          </Col>
          <Col md={3}>
            <h6 className="fw-bold">Legal</h6>
            <ul className="list-unstyled small text-white-50">
              <li>Términos de Servicio</li>
              <li>Política de Privacidad</li>
            </ul>
          </Col>
          <Col md={3}>
            <h6 className="fw-bold">Síguenos</h6>
            <div>
              <a href="#" className="text-white me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </Col>
        </Row>
        <hr className="border-secondary" />
        <p className="text-center small text-white-50 mb-0">
          © {new Date().getFullYear()} Nova Habitat. Todos los derechos reservados.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;

// import React from 'react';
// import { Container, Row, Col, Form, Button } from 'react-bootstrap';

// const Footer: React.FC = () => {
//   return (
//     <footer className="bg-dark text-white pt-5 pb-3">
//       <Container>
//         <Row className="g-4">
//           <Col lg={4} md={6}>
//             <div className="footer-brand mb-4">
//               <h4 className="fw-bold text-success">NOVA HABITAT</h4>
//               <p className="text-light mb-4">
//                 Tu socio de confianza en bienes raíces, ofreciendo soluciones 
//                 innovadoras y sostenibles para cada etapa de tu vida.
//               </p>
//               <div className="social-links">
//                 {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
//                   <a 
//                     key={platform}
//                     href="#" 
//                     className="text-white me-3 fs-5"
//                   >
//                     <i className={`bi bi-${platform}`}></i>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </Col>

//           <Col lg={2} md={6}>
//             <h6 className="text-success mb-3">Enlaces Rápidos</h6>
//             <ul className="list-unstyled">
//               {['Inicio', 'Propiedades', 'Servicios', 'Nosotros', 'Contacto'].map((link) => (
//                 <li key={link} className="mb-2">
//                   <a href="#" className="text-light text-decoration-none">
//                     {link}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </Col>

//           <Col lg={3} md={6}>
//             <h6 className="text-success mb-3">Servicios</h6>
//             <ul className="list-unstyled">
//               {[
//                 'Compra y Venta',
//                 'Alquiler Residencial',
//                 'Asesoría Legal',
//                 'Financiamiento',
//                 'Valoraciones',
//                 'Gestión de Propiedades'
//               ].map((service) => (
//                 <li key={service} className="mb-2">
//                   <a href="#" className="text-light text-decoration-none">
//                     {service}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </Col>

//           <Col lg={3} md={6}>
//             <h6 className="text-success mb-3">Newsletter</h6>
//             <p className="text-light small mb-3">
//               Suscríbete para recibir las últimas propiedades y noticias del mercado.
//             </p>
//             <Form className="subscribe-form">
//               <Form.Group className="mb-3">
//                 <Form.Control
//                   type="email"
//                   placeholder="Tu correo electrónico"
//                   className="border-0 rounded-3 py-2"
//                 />
//               </Form.Group>
//               <Button 
//                 variant="success" 
//                 className="w-100 rounded-3 py-2"
//               >
//                 Suscribirse
//               </Button>
//             </Form>
//           </Col>
//         </Row>

//         <hr className="my-4 border-light" />

//         <Row className="align-items-center">
//           <Col md={6}>
//             <p className="mb-0 text-light small">
//               &copy; 2024 NOVA HABITAT. Todos los derechos reservados.
//             </p>
//           </Col>
//           <Col md={6} className="text-md-end">
//             <div className="footer-links">
//               {['Privacidad', 'Términos', 'Cookies'].map((link) => (
//                 <a 
//                   key={link}
//                   href="#" 
//                   className="text-light text-decoration-none small me-3"
//                 >
//                   {link}
//                 </a>
//               ))}
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </footer>
//   );
// };

// export default Footer;

