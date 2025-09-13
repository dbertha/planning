export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', { 
    day: 'numeric',
    month: 'short'
  }).format(date);
};

// Helpers locaux pour éviter les décalages de fuseau
const toLocalDateOnly = (input) => {
  const d = new Date(input);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const toYYYYMMDD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Fonction pour calculer les dates de nettoyage (vendredi au jour avant la prochaine semaine existante)
export const getCleaningDates = (semaine, nextSemaine = null) => {
  // Point de départ local (lundi local de cette semaine)
  const mondayLocal = toLocalDateOnly(semaine.debut);

  // Vendredi de la semaine courante = lundi + 4 jours
  const fridayLocal = new Date(mondayLocal);
  fridayLocal.setDate(mondayLocal.getDate() + 4);

  // Fin = début de la prochaine semaine existante - 1 jour, sinon fin de cette semaine
  let endLocal;
  if (nextSemaine) {
    const nextStartLocal = toLocalDateOnly(nextSemaine.debut);
    endLocal = new Date(nextStartLocal);
    endLocal.setDate(nextStartLocal.getDate() - 1);
  } else {
    endLocal = toLocalDateOnly(semaine.fin);
  }

  const debutStr = toYYYYMMDD(fridayLocal);
  const finStr = toYYYYMMDD(endLocal);

  return {
    debut: debutStr,
    fin: finStr,
    debutFormatted: formatDate(debutStr),
    finFormatted: formatDate(finStr)
  };
};