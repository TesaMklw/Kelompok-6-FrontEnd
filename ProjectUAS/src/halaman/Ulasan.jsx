import { useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Ulasan() {
	const { pengguna } = useAuth();
	const bolehUlas = pengguna?.peran === "pelanggan";
	const [isi, setIsi] = useState("");
	const [terkirim, setTerkirim] = useState(false);

	useEffect(() => {
		document.title = "Warung Wong Deso - Ulasan";
	}, []);

	function kirim(event) {
		event.preventDefault();
		if (!bolehUlas) return;
		setTerkirim(true);
		setIsi("");
	}

	return (
		<Container className="halaman-ulasan py-4 py-lg-5">
			<h1 className="judul-halaman text-center">Ulasan</h1>
			<p className="teks-pendukung text-center mx-auto">
				Bagikan pengalaman kamu setelah menikmati masakan kami.
			</p>
			{!bolehUlas && (
				<Alert variant="warning" className="mx-auto kotak-sempit">
					{pengguna?.peran === "admin"
						? "Akun admin tidak bisa mengirim ulasan. Sign in dengan akun pelanggan."
						: "Kamu belum bisa mengirim ulasan. Sign up atau Sign in sekarang."}{" "}
					<Link to="/masuk">Sign In / Sign Up</Link>
				</Alert>
			)}
			{terkirim && (
				<Alert
					variant="success"
					className="mx-auto kotak-sempit"
					onClose={() => setTerkirim(false)}
					dismissible
				>
					Ulasan kamu sudah terkirim. Terima kasih sudah mampir.
				</Alert>
			)}
			<Form className="mx-auto kotak-sempit" onSubmit={kirim}>
				<fieldset className="form-pesan" disabled={!bolehUlas}>
					<Form.Group className="mb-3" controlId="isi-ulasan">
						<Form.Label className="visually-hidden">Isi ulasan</Form.Label>
						<Form.Control
							as="textarea"
							rows={5}
							value={isi}
							onChange={(event) => {
								setIsi(event.target.value);
								setTerkirim(false);
							}}
							placeholder="Tulis ulasan kamu..."
							required
						/>
					</Form.Group>
					<div className="text-center">
						<Button type="submit" variant="primary" disabled={!bolehUlas}>
							Kirim Ulasan
						</Button>
					</div>
				</fieldset>
			</Form>
		</Container>
	);
}

