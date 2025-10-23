import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import '../styles/navbar.css';

const NavigationBar: React.FC = () => {
    const [show, setShow] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const { isAuthenticated, user, logout } = useContext(AuthContext);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
            <Navbar
                expand="lg"
                className="custom-navbar fixed-top shadow-sm"
                style={{ backgroundColor: '#163f36ff' }}
            >
                <Container>
                    {/* Logo */}
                    <LinkContainer to="/">
                        <Navbar.Brand
                            onClick={() => navigate("/")}
                            style={{ cursor: "pointer", fontWeight: 700, fontSize: "1.3rem" }}
                        >
                            <img
                                src="/images/logo.png"
                                alt="Nova Habitat Logo"
                                width="30"
                                height="30"
                                className="me-2 align-text-top"
                            />
                           <span className="navbar-logo text-white fw-bold fs-3">
                                NOVA<span className="text-success">HABITAT</span>
                            </span>
                        </Navbar.Brand>
                    </LinkContainer>

                    {/* Mobile Toggle */}
                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        onClick={handleShow}
                        className="border-0"
                    >
                        <span className="navbar-toggler-icon-custom">
                            <i className="bi bi-list text-white fs-4"></i>
                        </span>
                    </Navbar.Toggle>

                    {/* Desktop Menu */}
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <LinkContainer to="/">
                                <Nav.Link className={`nav-link-custom mx-2 fw-semibold ${isActive('/') ? 'active' : ''}`}>
                                    Inicio
                                </Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/mis-propiedades">
                                <Nav.Link className={`nav-link-custom mx-2 fw-semibold ${isActive('/mis-propiedades') ? 'active' : ''}`}>
                                    Mis Propiedades
                                </Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/propiedades">
                                <Nav.Link className={`nav-link-custom mx-2 fw-semibold ${isActive('/propiedades') ? 'active' : ''}`}>
                                    Propiedades
                                </Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/servicios">
                                <Nav.Link className={`nav-link-custom mx-2 fw-semibold ${isActive('/servicios') ? 'active' : ''}`}>
                                    Servicios
                                </Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/owner/billing">
                                <Nav.Link className={`nav-link-custom mx-2 fw-semibold ${isActive('/billing') ? 'active' : ''}`}>
                                    PAGOS P
                                </Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/tenant/billing">
                                <Nav.Link className={`nav-link-custom mx-2 fw-semibold ${isActive('/billing') ? 'active' : ''}`}>
                                    PAGOS C
                                </Nav.Link>
                            </LinkContainer>


                            <LinkContainer to="/contratos">
                                <Nav.Link className={`nav-link-custom mx-2 fw-semibold ${isActive('/contratos') ? 'active' : ''}`}>
                                    Contratos
                                </Nav.Link>
                            </LinkContainer>

                            <LinkContainer to="/propiedades/nueva">
                                <Nav.Link className={`nav-link-custom mx-2 fw-semibold ${isActive('/propiedades/nueva') ? 'active' : ''}`}>
                                    propiedades
                                </Nav.Link>
                            </LinkContainer>
                        </Nav>

                        {/* CTA Buttons */}
                        <div className="d-flex align-items-center">
                            {!isAuthenticated ? (
                                <>
                                    <Button
                                        variant="outline-light"
                                        className="rounded-pill me-2 d-none d-md-block"
                                        onClick={() => navigate('/register')}
                                    >
                                        <i className="bi bi-person-plus me-2"></i>
                                        Registrarse
                                    </Button>

                                    <Button
                                        variant="outline-light"
                                        className="rounded-pill me-2 d-none d-md-block"
                                        onClick={() => navigate('/login')}
                                    >
                                        <i className="bi bi-box-arrow-in-right me-2"></i>
                                        Ingresar
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <span className="text-white me-3 d-none d-md-block">
                                        Hola, <strong>{user?.name}</strong>
                                    </span>

                                    <Button
                                        variant="outline-light"
                                        className="rounded-pill me-2 d-none d-md-block"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        <i className="bi bi-speedometer2 me-2"></i>
                                        Panel
                                    </Button>

                                    <Button
                                        variant="outline-light"
                                        className="rounded-pill me-2 d-none d-md-block"
                                        onClick={logout}
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Cerrar sesión
                                    </Button>
                                </>
                            )}

                            {/* <Button
                                className="btn-primary-custom rounded-pill px-4"
                                onClick={() => navigate('/consulta')}
                            >
                                <i className="bi bi-chat-dots me-2"></i>
                                Consulta Gratuita
                            </Button> */}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Mobile Offcanvas Menu */}
            <Offcanvas
                show={show}
                onHide={handleClose}
                placement="end"
                style={{ backgroundColor: '#163f36ff', color: 'white' }}
            >
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title>
                        <span className="navbar-logo text-white fw-bold fs-4">
                            NOVA<span className="text-success">HABITAT</span>
                        </span>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <LinkContainer to="/">
                            <Nav.Link className={`nav-link-mobile text-white fs-5 py-3 ${isActive('/') ? 'active-mobile' : ''}`} onClick={handleClose}>
                                <i className="bi bi-house me-3"></i>
                                Inicio
                            </Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/propiedades">
                            <Nav.Link className={`nav-link-mobile text-white fs-5 py-3 ${isActive('/propiedades') ? 'active-mobile' : ''}`} onClick={handleClose}>
                                <i className="bi bi-building me-3"></i>
                                Propiedades
                            </Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/servicios">
                            <Nav.Link className={`nav-link-mobile text-white fs-5 py-3 ${isActive('/servicios') ? 'active-mobile' : ''}`} onClick={handleClose}>
                                <i className="bi bi-tools me-3"></i>
                                Servicios
                            </Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/nosotros">
                            <Nav.Link className={`nav-link-mobile text-white fs-5 py-3 ${isActive('/nosotros') ? 'active-mobile' : ''}`} onClick={handleClose}>
                                <i className="bi bi-people me-3"></i>
                                Nosotros
                            </Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/contacto">
                            <Nav.Link className={`nav-link-mobile text-white fs-5 py-3 ${isActive('/contacto') ? 'active-mobile' : ''}`} onClick={handleClose}>
                                <i className="bi bi-telephone me-3"></i>
                                Contacto
                            </Nav.Link>
                        </LinkContainer>
                    </Nav>

                    <div className="mt-4 pt-4 border-top border-secondary">
                        <Button
                            variant="outline-light"
                            className="rounded-pill w-100 mb-3"
                            onClick={() => {
                                handleClose();
                                navigate('/login');
                            }}
                        >
                            <i className="bi bi-person me-2"></i>
                            Ingresar
                        </Button>

                        <Button
                            className="btn-primary-custom rounded-pill w-100"
                            onClick={() => {
                                handleClose();
                                navigate('/consulta');
                            }}
                        >
                            <i className="bi bi-chat-dots me-2"></i>
                            Consulta Gratuita
                        </Button>
                    </div>

                    {/* Contact Info Mobile */}
                    <div className="mt-5 pt-3 border-top border-secondary">
                        <div className="contact-info-mobile">
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-telephone text-success me-3"></i>
                                <div>
                                    <small className="text-light">Llámanos</small>
                                    <div className="text-white">+1 (555) 123-4567</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-envelope text-success me-3"></i>
                                <div>
                                    <small className="text-light">Email</small>
                                    <div className="text-white">info@novahabitat.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default NavigationBar;