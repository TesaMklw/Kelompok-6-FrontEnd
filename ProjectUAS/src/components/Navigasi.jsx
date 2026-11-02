import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, NavLink, useLocation } from "react-router-dom";

const tautan = [
  { ke: "/", label: "Beranda", akhir: true },
  { ke: "/galeri", label: "Galeri" },
  { ke: "/menu", label: "Menu" },
  { ke: "/ulasan", label: "Ulasan" },
];

export default function Navigasi() {
  const { pathname } = useLocation();

  return (
    <Navbar expand="lg" sticky="top" className="site-header">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          <span className="brand-mark">WD</span>
          <span>
            <strong>Warung Wong</strong>
            <small> DESO</small>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navigasi-utama" />
        <Navbar.Collapse id="navigasi-utama">
          <Nav className="ms-lg-auto align-items-lg-center">
            {tautan.map((item) => (
              <Nav.Link
                key={item.ke}
                as={NavLink}
                to={item.ke}
                end={item.akhir}
              >
                {item.label}
              </Nav.Link>
            ))}
            <NavDropdown
              title="Tentang Kami"
              id="menu-tentang"
              align="end"
              active={pathname.startsWith("/tentang")}
            >
              <NavDropdown.Item as={Link} to="/tentang#profil">
                Profil Kami
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/tentang#lokasi">
                Lokasi
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/tentang#kontak">
                Kontak
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
