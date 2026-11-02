import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

const tautan = [
	{ ke: "/", label: "Beranda", akhir: true },
	{ ke: "/galeri", label: "Galeri" },
	{ ke: "/menu", label: "Menu" },
	{ ke: "/ulasan", label: "Ulasan" },
	{ ke: "/tentang", label: "Tentang Kami" },
];

export default function Navigasi() {
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
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

