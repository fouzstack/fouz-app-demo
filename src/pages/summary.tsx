import Summary from '../components/summary/Sumary';
import NavButton from '../components/nav-button/NavButton';

export default function SummaryPage() {
  //const navigate = useNavigate(); // Inicializa el hook para la navegación
  return (
    <main className='overscroll-auto min-h-screen '>
      <Summary />
      <NavButton />
    </main>
  );
}
