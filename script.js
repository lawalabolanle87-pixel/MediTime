// ================= Sample data (illustrative only, not medical advice) =================

const INTERACTION_MEDS = [
  'Warfarin', 'Aspirin', 'Ibuprofen', 'Lisinopril', 'Amlodipine',
  'Atorvastatin', 'Levothyroxine', 'Omeprazole'
];

const INTERACTION_PAIRS = [
  { pair: ['Warfarin', 'Aspirin'], severity: 'high', note: 'Combined use raises bleeding risk — usually avoided unless closely monitored.' },
  { pair: ['Warfarin', 'Ibuprofen'], severity: 'high', note: 'NSAIDs can increase bleeding risk alongside warfarin.' },
  { pair: ['Aspirin', 'Ibuprofen'], severity: 'moderate', note: 'Ibuprofen may blunt aspirin\'s heart-protective effect if timed poorly.' },
  { pair: ['Lisinopril', 'Ibuprofen'], severity: 'moderate', note: 'NSAIDs can reduce blood-pressure control and strain the kidneys.' },
  { pair: ['Levothyroxine', 'Omeprazole'], severity: 'mild', note: 'Acid reducers can lower thyroid hormone absorption — spacing doses helps.' },
  { pair: ['Amlodipine', 'Atorvastatin'], severity: 'mild', note: 'May modestly raise statin levels in the blood.' }
];

const PHARMACIES = [
  { name: 'GreenLeaf Pharmacy', detail: '12 Ahmadu Bello Way · Mon–Sat, 8am–8pm' },
  { name: 'Wellness Point Pharmacy', detail: '45 Ibrahim Taiwo Rd · Open 24 hours' },
  { name: 'CarePlus Pharmacy', detail: '7 Yakubu Gowon St · Daily, 9am–9pm' }
];

const GUIDE_MEDS = [
  { name: 'Metformin', dose: '500–1000mg, with meals', desc: 'Helps control blood sugar in type 2 diabetes.', side: 'nausea, mild stomach upset' },
  { name: 'Lisinopril', dose: '10–20mg daily', desc: 'Lowers blood pressure by relaxing blood vessels.', side: 'dry cough, dizziness' },
  { name: 'Amlodipine', dose: '5–10mg daily', desc: 'Relaxes blood vessels to treat high blood pressure.', side: 'ankle swelling, flushing' },
  { name: 'Atorvastatin', dose: '10–40mg at night', desc: 'Lowers cholesterol levels.', side: 'muscle aches, mild fatigue' },
  { name: 'Levothyroxine', dose: 'Dose varies, empty stomach', desc: 'Replaces thyroid hormone for an underactive thyroid.', side: 'jitteriness if dose is too high' },
  { name: 'Omeprazole', dose: '20mg daily, before food', desc: 'Reduces stomach acid for reflux or ulcers.', side: 'headache, mild nausea' },
  { name: 'Amoxicillin', dose: '250–500mg, 3x daily with food', desc: 'Antibiotic for bacterial infections.', side: 'diarrhea, rash' },
  { name: 'Ibuprofen', dose: '200–400mg as needed', desc: 'Relieves pain and inflammation.', side: 'stomach upset — take with food' }
];

const SYMPTOMS = [
  { name: 'Mild headache', verdict: 'self-care', title: 'Self-care', text: 'Rest, hydrate, and consider an OTC pain reliever if needed.' },
  { name: 'Fever a few days', verdict: 'pharmacist', title: 'See a pharmacist', text: 'Monitor and use a fever reducer; check in with a pharmacist if it lasts beyond 3 days.' },
  { name: 'Persistent cough', verdict: 'pharmacist', title: 'See a pharmacist', text: 'A cough lasting over two weeks is worth a pharmacist check for the right next step.' },
  { name: 'Mild stomach upset', verdict: 'self-care', title: 'Self-care', text: 'Try a bland diet and stay hydrated; it usually settles on its own.' },
  { name: 'Skin rash, mild', verdict: 'self-care', title: 'Self-care', text: 'Keep the area moisturized and avoid known irritants. See a pharmacist if it spreads or worsens.' },
  { name: 'Chest pain', verdict: 'doctor', title: 'Seek urgent care', text: 'Chest pain should be assessed by a doctor promptly — don\'t wait it out.' },
  { name: 'Shortness of breath', verdict: 'doctor', title: 'Seek urgent care', text: 'Difficulty breathing needs prompt medical attention.' },
  { name: 'Severe allergic reaction', verdict: 'doctor', title: 'Seek emergency care', text: 'Swelling, hives with breathing trouble, or dizziness call for emergency care immediately.' }
];

// ================= User name =================
const nameModal = document.getElementById('nameModal');
const nameForm = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');
const greetName = document.getElementById('greetName');

function initName() {
  const savedName = localStorage.getItem('meditime_username');
  if (savedName) {
    greetName.textContent = savedName;
    nameModal.hidden = true;
  } else {
    nameModal.hidden = false;
  }
}

nameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;
  localStorage.setItem('meditime_username', name);
  greetName.textContent = name;
  nameModal.hidden = true;
});

// ================= State =================
let doses = JSON.parse(localStorage.getItem('meditime_doses') || '[]');
let streakData = JSON.parse(localStorage.getItem('meditime_streak') || '{"count":0,"lastCompleteDate":null}');
let refills = JSON.parse(localStorage.getItem('meditime_refills') || '[]');
let selectedInteractionMeds = new Set();

const RING_CIRCUMFERENCE = 264;
const todayStr = () => new Date().toISOString().slice(0, 10);

function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

// ================= Routing =================
const views = document.querySelectorAll('.view');
const backBtn = document.getElementById('backBtn');
const homeBtn = document.getElementById('homeBtn');

function goTo(viewName) {
  views.forEach(v => v.hidden = v.dataset.view !== viewName);
  backBtn.hidden = viewName === 'home';
  window.location.hash = viewName === 'home' ? '' : viewName;
}

document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => goTo(btn.dataset.goto));
});
backBtn.addEventListener('click', () => goTo('home'));
homeBtn.addEventListener('click', () => goTo('home'));

function routeFromHash() {
  const hash = window.location.hash.replace('#', '');
  const valid = ['doses', 'interactions', 'pharmacy', 'guide', 'symptoms'];
  goTo(valid.includes(hash) ? hash : 'home');
}
window.addEventListener('hashchange', routeFromHash);

// ================= Doses (home progress + doses view) =================
const doseList = document.getElementById('doseList');
const emptyState = document.getElementById('emptyState');
const progressPct = document.getElementById('progressPct');
const progressSummary = document.getElementById('progressSummary');
const ringFg = document.getElementById('ringFg');
const addForm = document.getElementById('addForm');

function isOverdue(dose) {
  if (dose.taken) return false;
  const now = new Date();
  const [h, m] = dose.time.split(':').map(Number);
  const doseTime = new Date();
  doseTime.setHours(h, m, 0, 0);
  return now > doseTime;
}

function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function renderDoses() {
  doseList.innerHTML = '';
  const sorted = [...doses].sort((a, b) => a.time.localeCompare(b.time));
  emptyState.style.display = sorted.length === 0 ? 'block' : 'none';

  sorted.forEach(dose => {
    const li = document.createElement('li');
    li.className = 'dose-item';
    if (dose.taken) li.classList.add('taken');
    if (isOverdue(dose)) li.classList.add('overdue');
    li.innerHTML = `
      <button class="dose-check" aria-label="Mark ${dose.name} as taken" data-id="${dose.id}">${dose.taken ? '✓' : ''}</button>
      <div class="dose-info">
        <div class="dose-name">${dose.name}</div>
        <div class="dose-meta">${dose.dosage || 'No dosage set'}</div>
      </div>
      <span class="dose-time">${formatTime(dose.time)}</span>
      <button class="dose-remove" aria-label="Remove ${dose.name}" data-id="${dose.id}">✕</button>
    `;
    doseList.appendChild(li);
  });

  updateProgress();
}

function updateProgress() {
  const total = doses.length;
  const takenCount = doses.filter(d => d.taken).length;
  const pct = total === 0 ? 0 : Math.round((takenCount / total) * 100);

  progressPct.textContent = `${pct}%`;
  ringFg.style.strokeDashoffset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * pct) / 100;

  progressSummary.textContent = total === 0
    ? 'No doses added yet — visit Doses to add one.'
    : takenCount === total
      ? `All ${total} doses taken today. Nicely done.`
      : `${takenCount} of ${total} doses taken today.`;

  if (total > 0 && takenCount === total && streakData.lastCompleteDate !== todayStr()) {
    streakData.count += 1;
    streakData.lastCompleteDate = todayStr();
    save('meditime_streak', streakData);
  }
}

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('medName').value.trim();
  const dosage = document.getElementById('medDose').value.trim();
  const time = document.getElementById('medTime').value;
  if (!name || !time) return;

  doses.push({ id: Date.now().toString(), name, dosage, time, taken: false });
  save('meditime_doses', doses);
  renderDoses();
  addForm.reset();
});

doseList.addEventListener('click', (e) => {
  const id = e.target.closest('button')?.dataset.id;
  if (!id) return;
  if (e.target.classList.contains('dose-check')) {
    const dose = doses.find(d => d.id === id);
    if (dose) dose.taken = !dose.taken;
    save('meditime_doses', doses);
    renderDoses();
  }
  if (e.target.classList.contains('dose-remove')) {
    doses = doses.filter(d => d.id !== id);
    save('meditime_doses', doses);
    renderDoses();
  }
});

// ================= Interactions =================
const interactionChips = document.getElementById('interactionChips');
const interactionResult = document.getElementById('interactionResult');

INTERACTION_MEDS.forEach(med => {
  const chip = document.createElement('button');
  chip.className = 'chip';
  chip.textContent = med;
  chip.addEventListener('click', () => {
    if (selectedInteractionMeds.has(med)) {
      selectedInteractionMeds.delete(med);
      chip.classList.remove('selected');
    } else {
      selectedInteractionMeds.add(med);
      chip.classList.add('selected');
    }
    renderInteractionResult();
  });
  interactionChips.appendChild(chip);
});

function renderInteractionResult() {
  const meds = [...selectedInteractionMeds];
  if (meds.length < 2) {
    interactionResult.innerHTML = '<p class="result-empty">Select at least two medications above.</p>';
    return;
  }

  const found = INTERACTION_PAIRS.filter(p =>
    meds.includes(p.pair[0]) && meds.includes(p.pair[1])
  );

  if (found.length === 0) {
    interactionResult.innerHTML = '<p class="result-empty">No known interactions in this sample dataset for your selection. This is illustrative, not exhaustive — always confirm with a pharmacist.</p>';
    return;
  }

  interactionResult.innerHTML = found.map(f => `
    <div class="result-item">
      <div class="result-pair"><span class="severity ${f.severity}">${f.severity}</span>${f.pair[0]} + ${f.pair[1]}</div>
      <div class="result-note">${f.note}</div>
    </div>
  `).join('');
}

// ================= Pharmacy & refills =================
const pharmacyList = document.getElementById('pharmacyList');
const refillPharmacySelect = document.getElementById('refillPharmacy');
const refillForm = document.getElementById('refillForm');
const refillList = document.getElementById('refillList');
const refillEmpty = document.getElementById('refillEmpty');

PHARMACIES.forEach(p => {
  const li = document.createElement('li');
  li.className = 'pharmacy-item';
  li.innerHTML = `<div class="pharmacy-name">${p.name}</div><div class="pharmacy-detail">${p.detail}</div>`;
  pharmacyList.appendChild(li);

  const opt = document.createElement('option');
  opt.value = p.name;
  opt.textContent = p.name;
  refillPharmacySelect.appendChild(opt);
});

function renderRefills() {
  refillList.innerHTML = '';
  refillEmpty.style.display = refills.length === 0 ? 'block' : 'none';
  refills.forEach(r => {
    const li = document.createElement('li');
    li.className = 'refill-item';
    li.innerHTML = `
      <div>
        <div class="refill-med">${r.med}</div>
        <div class="refill-sub">${r.pharmacy}</div>
      </div>
      <span class="refill-status">${r.status}</span>
    `;
    refillList.appendChild(li);
  });
}

refillForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const med = document.getElementById('refillMed').value.trim();
  const pharmacy = refillPharmacySelect.value;
  if (!med) return;
  refills.push({ id: Date.now().toString(), med, pharmacy, status: 'Requested — pending pickup' });
  save('meditime_refills', refills);
  renderRefills();
  refillForm.reset();
});

// ================= Medication guide =================
const guideList = document.getElementById('guideList');
const guideSearch = document.getElementById('guideSearch');

function renderGuide(filter = '') {
  const q = filter.trim().toLowerCase();
  const filtered = GUIDE_MEDS.filter(m => m.name.toLowerCase().includes(q));
  guideList.innerHTML = filtered.map(m => `
    <li class="guide-item">
      <div class="guide-name">${m.name}</div>
      <div class="guide-dose">${m.dose}</div>
      <div class="guide-desc">${m.desc}</div>
      <div class="guide-side"><b>Common side effects:</b> ${m.side}</div>
    </li>
  `).join('') || '<p class="result-empty">No matches — try a different search.</p>';
}

guideSearch.addEventListener('input', () => renderGuide(guideSearch.value));

// ================= Symptom guide =================
const symptomChips = document.getElementById('symptomChips');
const symptomResult = document.getElementById('symptomResult');

SYMPTOMS.forEach(s => {
  const chip = document.createElement('button');
  chip.className = 'chip';
  chip.textContent = s.name;
  chip.addEventListener('click', () => {
    symptomChips.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    symptomResult.innerHTML = `
      <span class="symptom-verdict ${s.verdict}">${s.title}</span>
      <p class="result-note">${s.text}</p>
    `;
  });
  symptomChips.appendChild(chip);
});

// ================= Init =================
initName();
renderDoses();
renderRefills();
renderGuide();
routeFromHash();
