import { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fotoBeranda } from "../assets/gambar";

export default function Beranda() {
	useEffect(() => {
		document.title = "Warung Wong Deso - Beranda";
	}, []);

	return (
		<Container className="py-4 py-lg-5">
			<Row className="align-items-center g-4 g-lg-5">
				<Col lg={6}>
					<p className="eyebrow">
						<span aria-hidden="true" /> Warung makan keluarga • sejak 2012
					</p>
					<h1 id="hero-title" className="judul-hero">
						Rasa ndeso, <em>hati legowo.</em>
					</h1>
					<p className="teks-pendukung">
						Masakan sederhana, dimasak dari bahan-bahan pilihan.
					</p>
					<Button as={Link} to="/menu" variant="primary" className="mt-2">
						Lihat menu
					</Button>
					<p className="catatan-hero">
						<strong>★ 4.9 </strong>
						<span>•</span> 2.000+ pelanggan pulang kenyang
					</p>
				</Col>
				<Col lg={6}>
					<img
						className="foto-hero"
						src={fotoBeranda.src}
						alt={fotoBeranda.alt}
					/>
					<p className="stempel-foto">{fotoBeranda.keterangan}</p>
				</Col>
			</Row>
		</Container>
	);
}

