import ExportToPdf from '../components/inventory-pdf/InventoryPdfSender';

const ExportToPDFpage = () => {
  return (
    <div className='min-h-screen flex flex-col items-center bg-gradient-to-r from-black via-gray-900 to-purple-800'>
      <ExportToPdf />
    </div>
  );
};
export default ExportToPDFpage;
