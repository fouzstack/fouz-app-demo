//import ExportImportInventory from '../components/inventory/ExportImportInventory';
import ImportInventory from '../components/inventory/ImportInventory';
import ExportInventory from '../components/inventory/ExportInventory';

export default function ExportImportInventoryPage() {
  return (
    <main className='overscroll-auto relative min-h-screen flex flex-col items-center justify-start'>
      <section className='max-w-[320px] mt-4 rounded rounded-2xl border p-4 py-8'>
        <ImportInventory />
        <hr className='my-4' />
        <ExportInventory />
      </section>
    </main>
  );
}
