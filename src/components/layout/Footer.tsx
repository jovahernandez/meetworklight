export function Footer() {
    return (
        <footer className="bg-neutral-800 text-neutral-300 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-sm">
                        © {new Date().getFullYear()} Meetwork. Conectando talento industrial con oportunidades reales.
                    </p>
                </div>
            </div>
        </footer>
    );
}
