// ARCHIVO: frontend/src/app/universidades/[universidadId]/carreras/page.tsx

export default async function CarrerasPage({ params }: { params: { universidadId: string } }) {
  
  const idRecibido = params.universidadId;

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', fontSize: '20px', color: 'white', backgroundColor: '#111' }}>
      <h1>Página de Depuración Final</h1>
      <p style={{ marginTop: '20px' }}>La estructura de carpetas y el enrutamiento funcionan.</p>
      <p>El valor que recibí para 'universidadId' es:</p>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        border: '2px solid lime', 
        color: 'lime', 
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        {idRecibido}
      </div>

      {idRecibido ? (
        <p style={{ marginTop: '20px', color: 'cyan' }}>¡ÉXITO! El parámetro se está recibiendo correctamente.</p>
      ) : (
        <p style={{ marginTop: '20px', color: 'red' }}>FALLO: El parámetro sigue llegando como undefined.</p>
      )}
    </div>
  );
}