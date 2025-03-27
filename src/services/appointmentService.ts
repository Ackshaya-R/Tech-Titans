
import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

export interface Appointment {
  _id?: string | ObjectId;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: Date | string;
  time: string;
  isEmergency: boolean;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  symptoms?: string;
  notes?: string;
  createdAt: Date;
}

export const appointmentCollection = () => {
  const db = getDatabase();
  if (!db) return null;
  return db.collection<Appointment>('appointments');
};

export const getAppointments = async (patientEmail?: string) => {
  const collection = appointmentCollection();
  if (!collection) return [];

  let query = {};
  if (patientEmail) {
    query = { patientEmail };
  }

  try {
    return await collection.find(query).sort({ date: -1 }).toArray();
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

export const getAppointmentById = async (id: string) => {
  const collection = appointmentCollection();
  if (!collection) return null;

  try {
    return await collection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return null;
  }
};

export const createAppointment = async (appointment: Omit<Appointment, '_id'>) => {
  const collection = appointmentCollection();
  if (!collection) return null;

  try {
    // Add created date
    const appointmentWithDate = {
      ...appointment,
      createdAt: new Date()
    };
    
    const result = await collection.insertOne(appointmentWithDate as any);
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error creating appointment:', error);
    return null;
  }
};

export const updateAppointment = async (id: string, appointmentData: Partial<Appointment>) => {
  const collection = appointmentCollection();
  if (!collection) return false;

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: appointmentData }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating appointment:', error);
    return false;
  }
};

export const cancelAppointment = async (id: string) => {
  const collection = appointmentCollection();
  if (!collection) return false;

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'cancelled' } }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return false;
  }
};
