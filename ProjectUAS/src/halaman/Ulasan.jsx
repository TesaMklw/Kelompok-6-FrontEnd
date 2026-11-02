import { useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";

export default function Ulasan() {
    const [ulasan, setUlasan] = useState("");
    const [terkirim, setTerkirim] = useState(false);

    useEffect(() => {
        document.title = "Warung Wong Deso - Ulasan";
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Ulasan terkirim:", ulasan);
        setUlasan("");
        setTerkirim(true);
    };

    return (
        <Container className="halaman-ulasan py-4 text-center">
            <section className="bagian-halaman" id="ulasan">
                <h2 className="judul-bagian text-uppercase">Ulasan</h2>
                <p className="teks-pendukung mx-auto mb-4">
                    Bagikan pengalaman kamu setelah menikmati produk kami.
                </p>

                <Form className="kotak-sempit mx-auto" onSubmit={handleSubmit}>
                    {terkirim && (
                        <Alert variant="success" dismissible onClose={() => setTerkirim(false)}>
                            Terima kasih, ulasanmu sudah terkirim!
                        </Alert>
                    )}
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Tulis ulasan kamu..."
                        value={ulasan}
                        onChange={(e) => setUlasan(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        className="mt-3 text-uppercase"
                        style={{ minWidth: 280 }}
                    >
                        Kirim Ulasan
                    </Button>
                </Form>
            </section>
        </Container>
    );
}