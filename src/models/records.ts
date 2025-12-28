import { db, RecordsType } from './models';

export async function getRecord(
  position: number = 0,
): Promise<RecordsType | null> {
  if (position < 0 || position > 9) {
    throw new Error('Position must be between 0 and 9');
  }

  const allRecords = await db.records.orderBy('id').reverse().toArray();

  if (allRecords.length === 0) return null;
  if (position >= allRecords.length) {
    throw new Error(`Only ${allRecords.length} records available`);
  }

  return allRecords[position];
}

export async function getTotalRecords(): Promise<number> {
  return await db.records.count();
}
