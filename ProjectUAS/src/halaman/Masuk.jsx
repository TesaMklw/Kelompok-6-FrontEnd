import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Nav, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { akunAdmin, akunPelanggan } from "../data/akun";

const awalDaftar = {
	nama: "",
	username: "",
	email: "",
	password: "",
};

export default function Masuk() {
	const { pengguna, masuk } = useAuth();
	const navigate = useNavigate();
	const [params, setParams] = useSearchParams();
	const mode = params.get("mode") === "daftar" ? "daftar" : "masuk";
	const [formMasuk, setFormMasuk] = useState({ username: "", password: "" });
	const [formDaftar, setFormDaftar] = useState(awalDaftar);
	const [galat, setGalat] = useState("");
	const [infoDaftar, setInfoDaftar] = useState("");

	useEffect(() => {
		document.title = "Warung Wong Deso - Sign In";
	}, []);

	function gantiMode(berikutnya) {
		setGalat("");
		setInfoDaftar("");
		setParams(berikutnya === "daftar" ? { mode: "daftar" } : {});
	}

	function ubahMasuk(event) {
		const { name, value } = event.target;
		setFormMasuk((sekarang) => ({ ...sekarang, [name]: value }));
	}

	function ubahDaftar(event) {
		const { name, value } = event.target;
		setFormDaftar((sekarang) => ({ ...sekarang, [name]: value }));
	}

	function kirimMasuk(event) {
		event.preventDefault();
		const hasil = masuk(formMasuk.username, formMasuk.password);
		if (!hasil.ok) {
			setGalat(hasil.pesan);
			return;
		}
		navigate(hasil.pengguna.peran === "admin" ? "/admin" : "/profil");
	}

	function kirimDaftar(event) {
		event.preventDefault();
		setInfoDaftar(
			"Pendaftaran akun baru belum tersedia karena belum ada backend. Sign in dengan akun pelanggan yang sudah disediakan.",
		);
	}

	return (
		<Container className="py-5">
			<Row className="justify-content-center">
				<Col xs={12} md={7} lg={5}>
					<Card className="kartu-akun shadow-sm">
						<Card.Body className="p-4 p-lg-5">
							<p className="eyebrow mb-2">
								<span aria-hidden="true" /> Akun
							</p>
							<h1 className="judul-bagian mb-3">Sign In / Sign Up</h1>
							<p className="teks-pendukung mb-4">
								Pelanggan dan admin masuk dari halaman yang sama.
							</p>
							{pengguna && (
								<Alert variant="success">
									Kamu sedang masuk sebagai <strong>{pengguna.nama}</strong>.
								</Alert>
							)}
							<Nav variant="pills" className="akun-tab mb-4">
								<Nav.Item>
									<Nav.Link
										active={mode === "masuk"}
										onClick={() => gantiMode("masuk")}
									>
										Sign In
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link
										active={mode === "daftar"}
										onClick={() => gantiMode("daftar")}
									>
										Sign Up
									</Nav.Link>
								</Nav.Item>
							</Nav>

							{mode === "masuk" ? (
								<Form onSubmit={kirimMasuk}>
									<Form.Group className="mb-3" controlId="username-masuk">
										<Form.Label>Username</Form.Label>
										<Form.Control
											name="username"
											value={formMasuk.username}
											onChange={ubahMasuk}
											autoComplete="username"
											required
										/>
									</Form.Group>
									<Form.Group className="mb-3" controlId="password-masuk">
										<Form.Label>Password</Form.Label>
										<Form.Control
											type="password"
											name="password"
											value={formMasuk.password}
											onChange={ubahMasuk}
											autoComplete="current-password"
											required
										/>
									</Form.Group>
									{galat && <p className="text-danger small mb-3">{galat}</p>}
									<Button type="submit" variant="primary" className="w-100">
										Sign In
									</Button>
								</Form>
							) : (
								<Form onSubmit={kirimDaftar}>
									<Form.Group className="mb-3" controlId="nama-daftar">
										<Form.Label>Nama</Form.Label>
										<Form.Control
											name="nama"
											value={formDaftar.nama}
											onChange={ubahDaftar}
											required
										/>
									</Form.Group>
									<Form.Group className="mb-3" controlId="username-daftar">
										<Form.Label>Username</Form.Label>
										<Form.Control
											name="username"
											value={formDaftar.username}
											onChange={ubahDaftar}
											autoComplete="username"
											required
										/>
									</Form.Group>
									<Form.Group className="mb-3" controlId="email-daftar">
										<Form.Label>Email</Form.Label>
										<Form.Control
											type="email"
											name="email"
											value={formDaftar.email}
											onChange={ubahDaftar}
											autoComplete="email"
											required
										/>
									</Form.Group>
									<Form.Group className="mb-3" controlId="password-daftar">
										<Form.Label>Password</Form.Label>
										<Form.Control
											type="password"
											name="password"
											value={formDaftar.password}
											onChange={ubahDaftar}
											autoComplete="new-password"
											required
										/>
									</Form.Group>
									{infoDaftar && <Alert variant="warning">{infoDaftar}</Alert>}
									<Button type="submit" variant="primary" className="w-100">
										Sign Up
									</Button>
								</Form>
							)}

							<div className="akun-demo">
								<p className="mb-2">
									<strong>Akun yang sudah disediakan</strong>
								</p>
								<p className="mb-1">
									Pelanggan: {akunPelanggan.username} / {akunPelanggan.password}
								</p>
								<p className="mb-0">
									Admin: {akunAdmin.username} / {akunAdmin.password}
								</p>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
