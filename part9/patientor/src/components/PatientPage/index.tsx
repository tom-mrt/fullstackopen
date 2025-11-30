interface EntryProps {
  entry: Entry;
}

interface HealthProps {
  entry: HealthCheckEntry;
}

interface HospitalProps {
  entry: HospitalEntry;
}

interface OccupationalProps {
  entry: OccupationalHealthcareEntry;
}

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import patientService from '../../services/patients';
import diagnosisService from '../../services/diagnosis';
import EntryForm from './EntryForm';
import { Patient, Diagnosis, OccupationalHealthcareEntry, HospitalEntry, HealthCheckEntry, Entry } from '../../types';
import LocalHospital from '@mui/icons-material/LocalHospital';

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();


  useEffect(() => {
    if (!id) { 
      setError("id not found"); 
      setLoading(false); 
      return; 
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const fetched = await patientService.getOnePatient(id);
        if (cancelled) return;
        if (!fetched) {
          setError("patient not found");
        } else {
          setPatient(fetched);
        }
      } catch {
        if (!cancelled) setError("failed to fetch patient");
      } finally {
        if (!cancelled) setLoading(false)
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    const getDiagnoses = async () => {
      try {
        const data = await diagnosisService.getAll()
        setDiagnoses(data)
      } catch (e: unknown){
        if (e instanceof Error) {
          setError(e.message)
        }
      }
    };
    void getDiagnoses();

  }, [])

  if (loading) return <div>loading...</div>;
  if (error) return <h2>{error}</h2>;
  if (!patient) return null;

  const entryStyle = {
    border: "1px solid black",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  const HospitalEntryComp: React.FC<HospitalProps> = ({ entry }) => {
    return (
      <div key={entry.id}>
        {entry.date} <LocalHospital /><br/>
        {entry.description}<br/>
        Discharge: {entry.discharge.date}, {entry.discharge.criteria}<br/>
      </div>
    )
  };

  const OccupationalHealthcareEntryComp: React.FC<OccupationalProps> = ({ entry }) => {
    return (
      <div key={entry.id}>
        {entry.date}<br/>
        {entry.description}<br/>
        diagnose by {entry.specialist} <br/>
        sickLeave: {entry.sickLeave?.startDate} ~ {entry.sickLeave?.endDate} <br/>
      </div>
    )
  };

  const HealthCheckEntryComp: React.FC<HealthProps> = ({ entry }) => {
    return (
      <div key={entry.id}>
        {entry.date}<br/>
        {entry.description}<br/>
        diagnose by {entry.specialist} <br/>
        rating: {entry.healthCheckRating} <br/>
      </div>
    )
  };

  const EntryDetails: React.FC<EntryProps> = ({ entry }) => {
    switch (entry.type) {
      case "Hospital":
        return <HospitalEntryComp entry={entry}/>
      case "OccupationalHealthcare":
        return <OccupationalHealthcareEntryComp entry={entry} />;
      case "HealthCheck":
        return <HealthCheckEntryComp entry={entry} />;
      default:
        throw new Error("Unexpected entry type.");
    }
  };

  return (
    <div>
      <h2>{patient.name} {patient.gender}</h2>
      ssn: {patient.ssn ?? "N/A"} <br />
      occupation: {patient.occupation}

      <EntryForm id={id} setPatient={setPatient}/>

      <h3>entries</h3>
      {patient.entries?.map(entry => {
        return (
          <div key={entry.id} style={entryStyle}>
            <EntryDetails entry={entry} />
            <ul>
              {entry.diagnosisCodes?.map(d => (
                <li key={d}>{d} {diagnoses?.find(diagnose => diagnose.code === d)?.name}</li>
              ))}
            </ul>
          </div>
        )

      })}

    </div>
  )
};

export default PatientPage;