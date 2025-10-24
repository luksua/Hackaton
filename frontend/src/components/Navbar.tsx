import React, { useState, useContext } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from "../context/AuthContext";
import '../styles/navbar.css';

type Role = 'owner' | 'tenant' | undefined;
type NavRole = 'both' | 'public' | 'auth' | 'owner' | 'tenant';

type NavItem = {
    label: string;
    path: string;
    roles: NavRole;
    roleScoped?: boolean;
};

const NavigationBar: React.FC = () => {
    const [show, setShow] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const role: Role = (user && (user.role as Role)) || undefined;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const rolePath = (path: string) => {
        if (!path.startsWith('/')) path = '/' + path;
        return role ? `/${role}${path}` : path;
    };

    const navItems: NavItem[] = [
        { label: 'Inicio', path: '/', roles: 'both' },
        { label: 'Mapa', path: '/mapa', roles: 'both' },
        { label: 'Mis Propiedades', path: '/mis-propiedades', roles: 'owner' },
        { label: 'Propiedades', path: '/propiedades', roles: 'both' },
        { label: 'Servicios', path: '/servicios', roles: 'both' },
        { label: 'Pagos', path: '/billing', roles: 'auth', roleScoped: true },
        { label: 'Contratos', path: '/contratos', roles: 'owner' },
    ];

    const renderLink = (item: NavItem, onClickClose?: () => void) => {
        const finalPath = item.roleScoped ? rolePath(item.path) : item.path;

        return (
            <LinkContainer to={finalPath} key={finalPath}>
                <Nav.Link
                    className={`nav-link-custom mx-2 fw-semibold ${isActive(finalPath) ? 'active' : ''}`}
                    onClick={onClickClose}
                >
                    {item.label}
                </Nav.Link>
            </LinkContainer>
        );
    };

    const renderMobileLink = (item: NavItem) => {
        const finalPath = item.roleScoped ? rolePath(item.path) : item.path;

        return (
            <LinkContainer to={finalPath} key={`mobile-${finalPath}`}>
                <Nav.Link
                    className={`nav-link-mobile text-white fs-5 py-3 ${isActive(finalPath) ? 'active-mobile' : ''}`}
                    onClick={handleClose}
                >
                    {item.label}
                </Nav.Link>
            </LinkContainer>
        );
    };

    const isVisible = (item: NavItem) => {
        const roles = item.roles;
        if (roles === 'both') return true;
        if (roles === 'public') return !isAuthenticated;
        if (roles === 'auth') return isAuthenticated;
        if (roles === 'owner') return isAuthenticated && role === 'owner';
        if (roles === 'tenant') return isAuthenticated && role === 'tenant';
        return false;
    };

    return (
        <>
            <Navbar
                expand="lg"
                className="custom-navbar fixed-top shadow-sm"
                style={{ backgroundColor: '#163f36ff' }}
            >
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand
                            onClick={() => navigate("/")}
                            style={{ cursor: "pointer", fontWeight: 700 }}
                        >
                            <span className="navbar-logo text-white fw-bold">
                                NOVA<span className="text-success">HABITAT</span>
                            </span>
                        </Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        onClick={handleShow}
                        className="border-0"
                    >
                        <span className="navbar-toggler-icon-custom">
                            <i className="bi bi-list text-white fs-4"></i>
                        </span>
                    </Navbar.Toggle>

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            {navItems.filter(isVisible).map(item => renderLink(item))}
                        </Nav>

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
                                        onClick={() => navigate(role ? `/${role}/dashboard` : '/dashboard')}
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
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

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
                        {navItems.filter(isVisible).map(item => renderMobileLink(item))}

                        <LinkContainer to={role ? `/${role}/dashboard` : '/dashboard'}>
                            <Nav.Link className={`nav-link-mobile text-white fs-5 py-3 ${isActive(role ? `/${role}/dashboard` : '/dashboard') ? 'active-mobile' : ''}`} onClick={handleClose}>
                                <i className="bi bi-speedometer2 me-3"></i>
                                Panel
                            </Nav.Link>
                        </LinkContainer>
                    </Nav>

                    <div className="mt-4 pt-4 border-top border-secondary">
                        {!isAuthenticated ? (
                            <>
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
                            </>
                        ) : (
                            <Button
                                variant="outline-light"
                                className="rounded-pill w-100 mb-3"
                                onClick={() => {
                                    handleClose();
                                    logout();
                                }}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>
                                Cerrar sesión
                            </Button>
                        )}
                    </div>

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