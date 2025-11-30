import patients from '../../data/patients';
import { Patient, PatientEntry, NonSensitivePatient, Entry, EntryWithoutId } from '../types';
import { randomUUID } from 'crypto';

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({ id, name, dateOfBirth, gender, occupation }))
};

const getOnePatient = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (entry: PatientEntry): Patient => {
  const newPatient: Patient = {
    ...entry,
    id: randomUUID()
  }

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const newEntry: Entry = {
    ...entry,
    id: randomUUID()
  };

  patients.map(p => p.id === patientId ? p.entries.push(newEntry) : p);
  return newEntry;

};

export default {
  getPatients,
  getOnePatient,
  addPatient,
  addEntry
};