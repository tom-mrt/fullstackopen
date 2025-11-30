import express, { Request, Response, NextFunction} from 'express';
import { z } from 'zod';
import { Entry, EntryWithoutId, NonSensitivePatient, PatientEntry } from '../types';
import patientService from '../services/patientService';
import { newEntrySchema, MedicalEntrySchema } from '../utils';

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getPatients());
});

router.get("/:id", (req, res: Response) => {
  const id: string = req.params.id
  const p = patientService.getOnePatient(id);
  if (!p) return res.status(404).json({ error: "Patient not found" });
  
  return res.json(p);
})


const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    MedicalEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
}

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues});
  } else {
    next(error);
  }
};

router.post("/", newPatientParser, (req: Request<unknown, unknown, PatientEntry>, res: Response) => {
  const newPatient = patientService.addPatient(req.body);
  res.json(newPatient);
})

router.post("/:id/entries", newEntryParser, (req: Request<{ id: string}, Entry, EntryWithoutId>, res: Response) => {
  
  const addedEntry = patientService.addEntry(req.params.id, req.body);
  res.json(addedEntry);
})

router.use(errorMiddleware);

export default router;