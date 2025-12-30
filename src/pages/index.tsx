import { lazy } from 'react';
import AdminLTE from '../components/AdminLTE/AdminLTE.tsx';
import SummaryPage from './summary.tsx';
import GeneralInformationPage from './general-information-page.tsx';
import CreateProductForm from '../components/product/createProductForm.tsx';

const Root = lazy(() => import('./root'));
//const CurrentTablePage = lazy(() => import('./table-page'));
import ProductTablesContainer from '../components/table/ProductTablesContainer';
const ReportPage = lazy(() => import('./report'));
const ExportToPDFpage = lazy(() => import('./export-to-pdf'));
import NextInventoryForm from '../components/inventory/NextInventoryForm';
import ImportInventory from '../components/inventory/ImportInventory';
import ExportInventory from '../components/inventory/ExportInventory';
const ErrorPage = lazy(() => import('./error-page.tsx'));

import SetProductIntoInventoryModal from '../components/product-list/SetProductIntoInventoryModal.tsx';
import ProductInfo from '../components/table-updater/ProductInfo.tsx';
import RecordsTable from '../components/record/RecordTable.tsx';
import InventoryFinancialSummary from '../components/inventory/FinancialSummary.tsx';
import VerifierDarkPremium from '../components/login/VerifierDarkPremium.tsx';

import IncomingProductsModal from '../components/incomings/IncomingKeyboard.tsx';
import IncomingProductsContainer from '../components/incomings/ProductTablesContainer.tsx';
import ProductsTableForAdjustmentContainer from '../components/losses/ProductsTableContainer.tsx';
import LossesAjustmentModal from '../components/losses/LossesAjustmentModal.tsx';

import ProductsTableForUpdatingProductContainer from '../components/product-editor/ProductsTableContainer.tsx';
import InventoryProductEditor from '../components/product/InventoryProductEditor.tsx';
import FinalProductsInput from '../components/table-updater/FinalProductsInput.tsx';
import IntegralTable from '../components/table/IntegralTable.tsx';
import SoldProductsContainer from '../components/sales/SoldProductsContainer.tsx';
import Documentation from '../components/product-list/Documentation.tsx';

//import LicenseGeneratorOffline from '../components/encoder/LicenseGeneratorOffline.tsx';

export const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    name: 'Productos',
  },
  {
    path: '/documentacion',
    element: <Documentation />,
    errorElement: <ErrorPage />,
    name: 'Documentación',
  },
  {
    path: '/entradas', //Tabla con Lista de Productos solo para Dar Entradas
    element: (
      <AdminLTE>
        {' '}
        <IncomingProductsContainer />{' '}
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Entradas',
  },
  {
    path: '/actualizar/entradas', //Formulario de Dar Entradas
    element: (
      <AdminLTE>
        {' '}
        <IncomingProductsModal />{' '}
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Actualizar Entradas',
  },
  {
    path: '/ajustes', // Table de productos solo para dar ajustes
    element: (
      <AdminLTE>
        {' '}
        <ProductsTableForAdjustmentContainer />{' '}
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Ajustes',
  },
  {
    path: '/ajustar/perdidas', // formulario para Perdidas
    element: (
      <AdminLTE>
        {' '}
        <LossesAjustmentModal />{' '}
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Formulario Perdidas',
  },
  {
    path: '/actualizar/finales',
    element: (
      <AdminLTE>
        <FinalProductsInput />
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Formulario Finales',
  },
  {
    path: '/ventas',
    element: (
      <AdminLTE>
        <SoldProductsContainer />
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Productos Vendidos',
  },
  {
    path: '/finales', // Table de productos solo para dar finales
    element: <AdminLTE> <ProductTablesContainer /></AdminLTE>,
    errorElement: <ErrorPage />,
    name: 'Finales',
  },
  {
    path: '/tabla/integral', // Table de productos solo para dar finales
    element: (
      <AdminLTE>
        {' '}
        <IntegralTable />{' '}
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Tabla integral',
  },
  {
    path: '/finanzas',
    element: (
      <AdminLTE>
        <InventoryFinancialSummary />
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Finanzas',
  },
  {
    path: '/informacion/general',
    element: <GeneralInformationPage />,
    errorElement: <ErrorPage />,
    name: 'Analísis',
  },
  {
    path: '/exportar/pdf',
    element: <ExportToPDFpage />,
    errorElement: <ErrorPage />,
    name: 'Exportar PDF',
  },
  {
    path: '/registros',
    element: (
      <AdminLTE>
        <RecordsTable />
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Registros',
  },
  {
    path: '/exportar/inventario',
    element: (
      <AdminLTE>
        <section className='w-full flex justify-center rounded rounded-2xl p-4 py-8'>
          <ExportInventory />
        </section>
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Exportar',
  },
  {
    path: '/importar/inventario',
    element: (
      <AdminLTE>
        <section className='w-full flex justify-center mt-4 rounded rounded-2xl p-4 py-8'>
          <ImportInventory />
        </section>
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Importar',
  },
  {
    path: '/crear/inventario',
    element: (
      <AdminLTE>
        <section className='w-full flex justify-center mt-4 rounded rounded-2xl p-4 py-8'>
          <NextInventoryForm />
        </section>
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Iniciar',
  },
  {
    path: '/editar/producto',
    element: (
      <AdminLTE>
        {' '}
        <ProductsTableForUpdatingProductContainer />
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Editar Producto',
  },
  {
    path: '/formulario/editar/producto',
    element: (
      <AdminLTE>
        <InventoryProductEditor />
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Formulario de Editar',
  },
  {
    path: '/reporte',
    element: <ReportPage />,
    errorElement: <ErrorPage />,
    name: 'Reporte',
  },
  {
    path: '/resumen',
    element: <SummaryPage />,
    errorElement: <ErrorPage />,
    name: 'Resumen',
  },
  {
    path: '/expired',
    element: <VerifierDarkPremium />,
    errorElement: <ErrorPage />,
    name: 'Expiración',
  },
  {
    path: '/crear/producto',
    element: (
      <AdminLTE>
        <CreateProductForm />
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Formulario',
  },
  {
    path: '/añadir/producto',
    element: (
      <AdminLTE>
        <SetProductIntoInventoryModal />
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Añadir Producto',
  },
  {
    path: '/informacion/producto',
    element: (
      <AdminLTE>
        <ProductInfo />
      </AdminLTE>
    ),
    errorElement: <ErrorPage />,
    name: 'Información',
  },
];

//export const routerMaker = () => routes;
