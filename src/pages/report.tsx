//import Encoder from "../components/encoder/Encoder";
import InventoryTable from '../components/inventory-survey/InventoryTable';
//import { PieGraph } from '../components/pie/PieGraph';
import ProductTable from '../components/report/ProductTable';
import NavButton from '../components/nav-button/NavButton';

export default function ReportPage() {
  //const navigate = useNavigate(); // Inicializa el hook para la navegación
  return (
    <main className='overscroll-auto flex flex-col items-center justify-center'>
      <ProductTable />
      <InventoryTable />
      <NavButton />
    </main>
  );
}
