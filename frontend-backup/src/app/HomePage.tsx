'use client';

export default function HomePage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1>AutoStock IA</h1>
      <p>Sistema de gestion inteligente de repuestos automotores</p>
      <a href="/login" style={{
        padding: '12px 24px',
        backgroundColor: '#f59e0b',
        color: 'white',
        borderRadius: '8px',
        fontWeight: 'bold'
      }}>
        Iniciar Sesion
      </a>
    </div>
  );
}