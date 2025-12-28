//import Encoder from "../components/encoder/Encoder";
import ProductTable from '../components/records/ProductTable';
//import NavButton from '../components/nav-button/NavButton';

export default function RecordsTablePage() {
  //const navigate = useNavigate(); // Inicializa el hook para la navegación
  return (
    <main className='w-full pb-[100px] overscroll-auto flex flex-col items-center justify-center'>
      <ProductTable />
    </main>
  );
}
