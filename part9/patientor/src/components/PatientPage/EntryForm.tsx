import React, { CSSProperties, SyntheticEvent, useState } from 'react';
import { HealthCheckRating, EntryWithoutId, Patient, BaseEntryWithoutId } from '../../types';
import patientService from '../../services/patients';


interface RatingOption {
  label: string;
  value: HealthCheckRating;
}

const ratingOptions: RatingOption[] = Object.entries(HealthCheckRating)
  .filter(([k]) => isNaN(Number(k)))
  .map(([label, value]) => ({ 
    label,
    value: value as HealthCheckRating
  }));

const errorStyle: CSSProperties = {
  color: '#9b1c1c',
  backgroundColor: '#fde8e8',
  border: '1px solid #f8b4b4',
  borderRadius: 4,
  padding: '0.75rem 1rem',
  margin: '0 0 1rem'
};

interface EntryProps {
  id: string;
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
};

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare"


const EntryForm: React.FC<EntryProps> = ({ id, setPatient }) => {
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string>("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<HealthCheckRating | null>(null);
  const [dischargeDate, setDischargeDate] = useState("");
  const [criteria, setCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState<EntryType | "">("");
  const [notification, setNotification] = useState("");

  const handleCodesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiagnosisCodes(e.target.value);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRating(Number(e.target.value) as HealthCheckRating);
  };

  const clearState = () => {
    setDate("");
    setSpecialist("");
    setDiagnosisCodes("");
    setDescription("");
    setRating(null);
    setDischargeDate("");
    setCriteria("");
    setEmployerName("");
    setStartDate("");
    setEndDate("");
    setType("");
  };

  const assertNever = (value: never): never => {
    throw new Error(`Unexpected type: ${value}`)
  };

  const buildEntry = (): EntryWithoutId => {
    if (!type) {
      throw new Error("エントリータイプを指定してください。")
    }

    const baseEntry: BaseEntryWithoutId = {
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.split(","),
    };

    switch (type) {
      case "HealthCheck":
        if (rating === null) throw new Error("ratingを入力してください。")
        return {...baseEntry, type: "HealthCheck", healthCheckRating: rating};
      case "Hospital":
        return {...baseEntry, type: "Hospital", discharge: { date: dischargeDate, criteria }};
      case "OccupationalHealthcare":
        return {
          ...baseEntry, 
          type: "OccupationalHealthcare", 
          employerName, 
          ...(startDate && endDate ? { sickLeave: { startDate, endDate } } : {})}
      default:
        return assertNever(type);
    };
  };

  
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const addedEntry = await patientService.createEntry(id, buildEntry());
      setPatient((prev) => prev ? {...prev, entries: [...(prev.entries ?? []), addedEntry]} : prev)
      clearState();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setNotification(e.message)
        setTimeout(() => {
          setNotification("");
        }, 5000);
      }
    }

  };
  return (
    <div>
      {notification && (
        <>
          <p style={errorStyle}>{notification}</p>
        </>
      )}
      <p>New HealthCheck Entry</p>
      <label htmlFor="type">entry type</label>
      <select id="type" name="type" value={type} onChange={({ target }) => setType(target.value)}>
        <option value="" disabled>エントリータイプを選択してください</option>
        <option value="HealthCheck">HealthCheck</option>
        <option value="Hospital">Hospital</option>
        <option value="OccupationalHealthcare">OccupationalHealthcare</option>
      </select>
      
      <form onSubmit={handleSubmit}>
          <div className="form-group">
              <label htmlFor="date">Date (日付)</label>
              <input type="date" id="date" name="date" value={date} onChange={({ target }) => setDate(target.value)} required />
          </div>

          <div className="form-group">
              <label htmlFor="specialist">Specialist (専門医・担当医)</label>
              <input type="text" id="specialist" name="specialist" placeholder="例: 内科, 山田医師" value={specialist} onChange={({ target }) => setSpecialist(target.value)} required />
          </div>

          <div className="form-group">
              <label htmlFor="diagnosis_codes">Diagnosis Codes (診断コード)</label>
              <input type="text" id="diagnosis_codes" name="diagnosis_codes" placeholder="例: ICD-10, E11.9" value={diagnosisCodes} onChange={handleCodesChange} />
              <div className="help-text">複数の場合はカンマで区切ってください。</div>
          </div>

          {type === "OccupationalHealthcare" && (
            <>
              <div className="form-group">
                  <label htmlFor="employerName">employer name</label>
                  <input type="text" id="employerName" name="employerName" value={employerName} onChange={({ target }) => setEmployerName(target.value)} required />
              </div>
              <div className="form-group">
                  <label htmlFor="startDate">sick leave start date (日付)</label>
                  <input type="date" id="startDate" name="startDate" value={startDate} onChange={({ target }) => setStartDate(target.value)} required />
              </div>
              <div className="form-group">
                  <label htmlFor="endDate">sick leave end date (日付)</label>
                  <input type="date" id="endDate" name="endDate" value={endDate} onChange={({ target }) => setEndDate(target.value)} required />
              </div>
            </>
          )}

          {type === "HealthCheck" && (
            <div className="form-group">
              <label htmlFor="rating">Healthcheck Rating (健康評価)</label>
              <select id="rating" name="rating" value={rating ?? ""} onChange={handleRatingChange}>
                  <option value="" disabled>評価を選択してください</option>
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.value} - {option.label}</option>
                  ))}
              </select>
          </div>
          )}

          {type === "Hospital" && (
            <>
              <div className="form-group">
                  <label htmlFor="dischargeDate">discharge date (日付)</label>
                  <input type="date" id="dischargeDate" name="dischargeDate" value={dischargeDate} onChange={({ target }) => setDischargeDate(target.value)} required />
              </div>
              <div className="form-group">
                  <label htmlFor="criteria">criteria</label>
                  <input type="text" id="criteria" name="criteria" value={criteria} onChange={({ target }) => setCriteria(target.value)} required />
              </div>
            </>
          )}

          <div className="form-group">
              <label htmlFor="description">Description (詳細・症状の説明)</label>
              <textarea id="description" name="description" placeholder="具体的な症状や備考を入力してください..." value={description} onChange={({ target }) => setDescription(target.value)}></textarea>
          </div>

          <button type="submit">登録する</button>
      </form>
    </div>
  )
};

export default EntryForm;
