import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, NavLink, useLocation } from "react-router-dom";

const tautan = [
	{ ke: "/", label: "Beranda", akhir: true },
	{ ke: "/galeri", label: "Galeri" },
	{ ke: "/menu", label: "Menu" },
	{ ke: "/ulasan", label: "Ulasan" },
];

const menuTentang = [
	{ ke: "/tentang#profil", hash: "#profil", label: "Profil" },
	{ ke: "/tentang#lokasi", hash: "#lokasi", label: "Lokasi" },
	{ ke: "/tentang#kontak", hash: "#kontak", label: "Kontak" },
];

export default function Navigasi() {
	const { pathname, hash } = useLocation();

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
							active={pathname === "/tentang"}
						>
							{menuTentang.map((item) => (
								<NavDropdown.Item
									key={item.ke}
									as={Link}
									to={item.ke}
									active={pathname === "/tentang" && hash === item.hash}
								>
									{item.label}
								</NavDropdown.Item>
							))}
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

