// src/lib/mockData.ts
export const mockAlerts = [
  {
    id: 1,
    level: "critical",
    title: "Épidémie de Choléra",
    location: "Région du Littoral",
    description: "Vigilance renforcée. Respectez les mesures d'hygiène.",
    date: "Il y a 2h",
  },
  {
    id: 2,
    level: "warning",
    title: "Pénurie de Vaccins",
    location: "Centre / Sud",
    description: "Rupture de stock temporaire dans les centres de santé publics.",
    date: "Il y a 1j",
  },
];

export const mockHospitals = [
  {
    id: 1,
    name: "Hôpital Central Yaoundé",
    lat: 3.8735,
    lng: 11.5021,
    type: "Public",
    phone: "+237 222 23 14 25",
  },
  {
    id: 2,
    name: "Hôpital Laquintinie Douala",
    lat: 4.0483,
    lng: 9.7043,
    type: "Public",
    phone: "+237 233 42 24 42",
  },
  {
    id: 3,
    name: "Clinique des Cedres",
    lat: 4.05,
    lng: 9.76,
    type: "Privé",
    phone: "+237 699 00 00 00",
  },
];