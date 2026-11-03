import { useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const statistik = [
	{ angka: "2012", label: "Tahun Berdiri" },
	{ angka: "28+", label: "Menu" },
	{ angka: "2.000+", label: "Pelanggan" },
];

const alamat = "Jl. Raya Lenteng Agung Timur No. 32, Jagakarsa";
const tautanPeta = `https://www.google.com/maps?q=${encodeURIComponent(
	`Warung Wong Deso, ${alamat}`,
)}`;

export default function Tentang() {
	useEffect(() => {
		document.title = "Warung Wong Deso - Tentang Kami";
	}, []);

	return (
		<Container className="py-4 py-lg-5">
			<header className="text-center mb-2">
				<p className="eyebrow justify-content-center">
					<span /> Profil warung
				</p>
				<h1 className="judul-halaman">Tentang Kami</h1>
				<p className="teks-pendukung mx-auto">
					Kenalan lebih dekat dengan Warung Wong Deso — cerita kami, lokasi
					warung, dan cara menghubungi kami.
				</p>
			</header>

			<section id="profil" className="bagian-halaman text-center">
				<p className="eyebrow justify-content-center">
					<span /> Profil kami
				</p>
				<h2 className="judul-bagian">Profil Kami</h2>
				<p className="teks-pendukung mx-auto">
					Warung Wong Deso adalah warung makan keluarga yang telah berdiri sejak
					2012 di Jagakarsa. Kami menyajikan masakan sederhana ala rumahan yang
					dimasak dari bahan-bahan pilihan, dengan semangat &quot;Rasa ndeso,
					hati legowo&quot; — sederhana rasanya, lapang hatinya.
				</p>
				<Row className="g-3 mt-2 justify-content-center">
					{statistik.map((item) => (
						<Col key={item.label} md={4}>
							<Card className="kartu-stat h-100">
								<Card.Body>
									<div className="angka-stat">{item.angka}</div>
									<div className="label-stat">{item.label}</div>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			</section>

			<section id="lokasi" className="bagian-halaman">
				<div className="text-center">
					<p className="eyebrow justify-content-center">
						<span /> Kunjungi kami
					</p>
					<h2 className="judul-bagian">Lokasi</h2>
				</div>
				<div className="kotak-lokasi">
					<iframe
						src={`${tautanPeta}&output=embed`}
						title="Peta lokasi Warung Wong Deso"
						loading="lazy"
					/>
					<p className="mb-0 mt-3">
						<strong>Alamat:</strong> {alamat}
					</p>
				</div>
			</section>

			<section id="kontak" className="bagian-halaman">
				<div className="text-center">
					<p className="eyebrow justify-content-center">
						<span /> Hubungi kami
					</p>
					<h2 className="judul-bagian">Kontak</h2>
					<p className="teks-pendukung mx-auto">
						Pesan tempat, tanya menu, atau pesan nasi kotak — hubungi kami
						lewat email atau telepon/WhatsApp di bawah ini.
					</p>
				</div>
				<Row className="g-3">
					<Col md={4}>
						<Card className="kartu-kontak h-100">
							<Card.Body className="d-flex flex-column text-center">
								<div className="label-kontak">Email</div>
								<a className="nilai-kontak" href="mailto:manganlur@gmail.com">
									manganlur@gmail.com
								</a>
								<Button
									as="a"
									href="mailto:manganlur@gmail.com"
									variant="primary"
									className="mt-auto"
								>
									Kirim Email
								</Button>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4}>
						<Card className="kartu-kontak h-100">
							<Card.Body className="d-flex flex-column text-center">
								<div className="label-kontak">Telepon / WhatsApp</div>
								<a className="nilai-kontak" href="tel:+6282122517112">
									+6282122517112
								</a>
								<Button
									as="a"
									href="tel:+6282122517112"
									variant="primary"
									className="mt-auto"
								>
									Hubungi Kami
								</Button>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4}>
						<Card className="kartu-kontak h-100">
							<Card.Body className="d-flex flex-column text-center">
								<div className="label-kontak">Alamat</div>
								<p className="nilai-kontak teks-alamat">{alamat}</p>
								<Button
									as="a"
									href={tautanPeta}
									target="_blank"
									rel="noopener noreferrer"
									variant="primary"
									className="mt-auto"
								>
									Lihat Peta
								</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</section>
		</Container>
	);
}

