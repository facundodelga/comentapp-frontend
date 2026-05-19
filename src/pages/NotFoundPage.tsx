import { Link } from 'react-router-dom';

export default function NotFoundPage() {
	return (
		<main
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '2rem',
				textAlign: 'center',
			}}
		>
			<div>
				<h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
				<p style={{ fontSize: '1.25rem', margin: '1rem 0' }}>
					Página no encontrada.
				</p>
				<Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>
					Volver al inicio
				</Link>
			</div>
		</main>
	);
}
