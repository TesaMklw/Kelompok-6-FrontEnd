import { useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";

export default function Ulasan() {
	const [isi, setIsi] = useState("");
	const [terkirim, setTerkirim] = useState(false);

	useEffect(() => {
		document.title = "Warung Wong Deso - Ulasan";
	}, []);

	function kirim(event) {
		event.preventDefault();
		setTerkirim(true);
		setIsi("");
	}

	return (
		<Container className="halaman-ulasan py-4 py-lg-5">
			<h1 className="judul-halaman text-center">Ulasan</h1>
			<p className="teks-pendukung text-center mx-auto">
				Bagikan pengalaman kamu setelah menikmati masakan kami.
			</p>
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
					<Button type="submit" variant="primary">
						Kirim Ulasan
					</Button>
				</div>
			</Form>
		</Container>
	);
}

