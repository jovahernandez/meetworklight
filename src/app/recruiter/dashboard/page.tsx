export default function RecruiterDashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-6">
                Panel de Reclutador
            </h1>
            <p className="text-neutral-600">
                Bienvenido al panel de reclutador. Aquí podrás gestionar tus vacantes y perfil.
            </p>
            <div className="mt-8 grid md:grid-cols-2 gap-6">
                <a
                    href="/recruiter/jobs"
                    className="block bg-white rounded-lg shadow-md border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
                >
                    <h3 className="font-heading font-bold text-lg mb-2">Mis Vacantes</h3>
                    <p className="text-neutral-600">Ver y gestionar las vacantes que has publicado</p>
                </a>
                <a
                    href="/recruiter/jobs/new"
                    className="block bg-white rounded-lg shadow-md border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
                >
                    <h3 className="font-heading font-bold text-lg mb-2">Crear Vacante</h3>
                    <p className="text-neutral-600">Publica una nueva oportunidad de empleo</p>
                </a>
            </div>
        </div>
    );
}
