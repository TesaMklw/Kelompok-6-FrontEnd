import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { daftarGaleri } from "../assets/gambar";

export default function Galeri() {
	useEffect(() => {
		document.title = "Warung Wong Deso - Galeri";
	}, []);

	return (
		<Container className="py-4 py-lg-5">
			<div className="text-center mb-4">
				<h1 id="gallery-title" className="judul-halaman">
					Galeri
				</h1>
				<p className="teks-pendukung mx-auto">
					Foto dari orang-orang yang pernah berkunjung dan hidangan yang pernah
					dipesan.
				</p>
			</div>
			<Row xs={1} md={2} lg={3} className="g-4 galeri-grid">
				{daftarGaleri.map((foto) => (
					<Col key={foto.src} className="d-flex">
						<figure className="kartu-galeri">
							<div className="bingkai-foto">
								<img src={foto.src} alt={foto.alt} />
							</div>
							<figcaption>
								<strong>{foto.judul}</strong>
								<span>{foto.keterangan}</span>
							</figcaption>
						</figure>
					</Col>
				))}
			</Row>
		</Container>
	);
}

