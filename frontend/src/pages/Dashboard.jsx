import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [patient, setPatient] = useState({
    name: "John Doe",
    age: 30,
    conditions: "Hypertension",
    allergies: "Peanuts",
    lastVisit: "2024-12-15",
  });

  useEffect(() => {
    const saved = localStorage.getItem("patientInfo");
    if (saved) {
      setPatient(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const updated = { ...patient, [e.target.name]: e.target.value };
    setPatient(updated);
    localStorage.setItem("patientInfo", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
          Patient Dashboard
        </h2>
        <div className="space-y-4">
          <input
            name="name"
            value={patient.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
          />
          <input
            name="age"
            value={patient.age}
            onChange={handleChange}
            placeholder="Age"
            type="number"
            className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
          />
          <input
            name="conditions"
            value={patient.conditions}
            onChange={handleChange}
            placeholder="Conditions"
            className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
          />
          <input
            name="allergies"
            value={patient.allergies}
            onChange={handleChange}
            placeholder="Allergies"
            className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
          />
          <input
            name="lastVisit"
            value={patient.lastVisit}
            onChange={handleChange}
            placeholder="Last Visit"
            type="date"
            className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}
