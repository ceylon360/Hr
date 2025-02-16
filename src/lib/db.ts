import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import type { Employee, Holiday, ColorTask } from "@/types/schema";

// Collections
const EMPLOYEES = "employees";
const HOLIDAYS = "holidays";
const COLOR_TASKS = "colorTasks";
const SCHEDULES = "schedules";

// Employees
export const addEmployee = async (employee: Omit<Employee, "id">) => {
  return addDoc(collection(db, EMPLOYEES), employee);
};

export const updateEmployee = async (
  id: string,
  employee: Partial<Employee>,
) => {
  return updateDoc(doc(db, EMPLOYEES, id), employee);
};

export const deleteEmployee = async (id: string) => {
  return deleteDoc(doc(db, EMPLOYEES, id));
};

export const getEmployees = async () => {
  const snapshot = await getDocs(collection(db, EMPLOYEES));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Holidays
export const addHoliday = async (holiday: Omit<Holiday, "id">) => {
  const holidayData = {
    ...holiday,
    date: holiday.date.toISOString(),
  };
  return addDoc(collection(db, HOLIDAYS), holidayData);
};

export const getHolidays = async () => {
  const snapshot = await getDocs(collection(db, HOLIDAYS));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: new Date(doc.data().date),
  })) as Holiday[];
};

// Color Tasks
export const addColorTask = async (colorTask: Omit<ColorTask, "id">) => {
  return addDoc(collection(db, COLOR_TASKS), colorTask);
};

export const getColorTasks = async () => {
  const snapshot = await getDocs(collection(db, COLOR_TASKS));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ColorTask[];
};

export const deleteColorTask = async (id: string) => {
  return deleteDoc(doc(db, COLOR_TASKS, id));
};

// Schedules
export interface ScheduleEntry {
  id?: string;
  employeeId: string;
  hour: number;
  color: string;
  date: Date;
}

export const updateSchedule = async (
  scheduleData: Omit<ScheduleEntry, "id">,
) => {
  const { employeeId, hour, date } = scheduleData;
  const dateStr = date.toISOString().split("T")[0];

  const q = query(
    collection(db, SCHEDULES),
    where("employeeId", "==", employeeId),
    where("hour", "==", hour),
    where("date", "==", dateStr),
  );

  const snapshot = await getDocs(q);

  const scheduleDoc = {
    ...scheduleData,
    date: dateStr,
  };

  if (!snapshot.empty) {
    return updateDoc(doc(db, SCHEDULES, snapshot.docs[0].id), scheduleDoc);
  }

  return addDoc(collection(db, SCHEDULES), scheduleDoc);
};

export const getScheduleForDate = async (date: Date) => {
  const dateStr = date.toISOString().split("T")[0];
  const q = query(collection(db, SCHEDULES), where("date", "==", dateStr));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: new Date(doc.data().date),
  })) as ScheduleEntry[];
};

// Real-time subscriptions
export const subscribeToSchedule = (
  date: Date,
  callback: (data: ScheduleEntry[]) => void,
) => {
  const dateStr = date.toISOString().split("T")[0];
  const q = query(collection(db, SCHEDULES), where("date", "==", dateStr));

  return onSnapshot(q, (snapshot) => {
    const schedules = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: new Date(doc.data().date),
    })) as ScheduleEntry[];
    callback(schedules);
  });
};
