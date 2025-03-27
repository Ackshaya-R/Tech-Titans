
import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

// Define doctor interface
export interface Doctor {
  _id?: string | ObjectId;
  name: string;
  specialty: string;
  location: {
    city: string;
    state: string;
    coordinates?: [number, number];
  };
  availability: {
    days: string[];
    slots: string[];
  };
  rating: number;
  experience: number;
  fee: number;
  image?: string;
  about?: string;
}

export const doctorCollection = () => {
  const db = getDatabase();
  if (!db) return null;
  return db.collection<Doctor>('doctors');
};

export const getDoctors = async (locationFilter?: string) => {
  const collection = doctorCollection();
  if (!collection) return [];

  let query = {};
  if (locationFilter) {
    query = { 'location.city': locationFilter };
  }

  try {
    return await collection.find(query).toArray();
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};

export const getDoctorById = async (id: string) => {
  const collection = doctorCollection();
  if (!collection) return null;

  try {
    return await collection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return null;
  }
};

export const addDoctor = async (doctor: Omit<Doctor, '_id'>) => {
  const collection = doctorCollection();
  if (!collection) return null;

  try {
    const result = await collection.insertOne(doctor as any);
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error adding doctor:', error);
    return null;
  }
};

export const updateDoctor = async (id: string, doctorData: Partial<Doctor>) => {
  const collection = doctorCollection();
  if (!collection) return false;

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: doctorData }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating doctor:', error);
    return false;
  }
};

export const deleteDoctor = async (id: string) => {
  const collection = doctorCollection();
  if (!collection) return false;

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return false;
  }
};
