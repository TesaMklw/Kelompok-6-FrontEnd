import { useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Profil() {
	const { pengguna, keluar } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		document.title = "Warung Wong Deso - Profil";
	}, []);

	function keluarAkun() {
		keluar();
		navigate("/");
	}

	if (!pengguna) {
		return (
			<Container className="py-5">
				<Row className="justify-content-center">
					<Col xs={12} md={8} lg={6} className="text-center">
						<p className="eyebrow mb-2">
							<span aria-hidden="true" /> Profil
						</p>
						<h1 className="profil-ajakan">Sign up atau Sign in sekarang</h1>
						<p className="teks-pendukung mx-auto mb-4">
							Akun diperlukan untuk memesan menu. Pelanggan dan admin masuk dari
							halaman yang sama.
						</p>
						<div className="d-flex justify-content-center gap-2">
							<Button as={Link} to="/masuk" variant="primary">
								Sign In
							</Button>
							<Button
								as={Link}
								to="/masuk?mode=daftar"
								variant="outline-primary"
								className="btn-garis btn-profil"
							>
								Sign Up
							</Button>
						</div>
					</Col>
				</Row>
			</Container>
		);
	}

	const baris = [
		["Peran", pengguna.peran === "admin" ? "Admin" : "Pelanggan"],
		["Username", pengguna.username],
		["Email", pengguna.email],
		["Telepon", pengguna.telepon],
		["Alamat", pengguna.alamat],
	];

	return (
		<Container className="py-5">
			<Row className="justify-content-center">
				<Col xs={12} md={8} lg={6}>
					<p className="eyebrow mb-2">
						<span aria-hidden="true" /> Profil
					</p>
					<h1 className="judul-bagian nama-akun mb-3">{pengguna.nama}</h1>
					<Card className="kartu-profil">
						<Card.Body className="p-4">
							<dl className="daftar-profil">
								{baris.map(([label, nilai]) => (
									<div key={label} className="baris-profil">
										<dt>{label}</dt>
										<dd>{nilai}</dd>
									</div>
								))}
							</dl>
							<div className="d-flex flex-wrap gap-2 mt-4">
								{pengguna.peran === "admin" ? (
									<Button as={Link} to="/admin" variant="primary">
										Buka panel admin
									</Button>
								) : (
									<Button as={Link} to="/menu" variant="primary">
										Pesan menu
									</Button>
								)}
								<Button
									type="button"
									variant="outline-primary"
									className="btn-garis"
									onClick={keluarAkun}
								>
									Keluar
								</Button>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
