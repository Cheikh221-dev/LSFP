// app.js

const API_BASE = '/api';

// ---------- UTILS ----------
async function fetchData(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error('Erreur réseau');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// ---------- CLUBS ----------
async function loadClubs() {
  const clubs = await fetchData('/clubs');
  const container = document.getElementById('clubs-list');
  if (!container) return;
  container.innerHTML = '';
  
  clubs.forEach(club => {
    const div = document.createElement('div');
    div.className = 'col-md-4 mb-3';
    div.innerHTML = `
      <div class="card bg-dark border-warning text-warning h-100">
        <img src="${club.logo || 'placeholder.png'}" class="card-img-top" alt="${club.nom}">
        <div class="card-body">
          <h5 class="card-title">${club.nom}</h5>
          <p class="card-text">${club.ville || ''}</p>
        </div>
      </div>`;
    container.appendChild(div);
  });
}

// ---------- JOUEURS ----------
async function loadJoueurs() {
  const joueurs = await fetchData('/joueurs');
  const container = document.getElementById('joueurs-list');
  if (!container) return;
  container.innerHTML = '';

  joueurs.forEach(j => {
    const div = document.createElement('div');
    div.className = 'col-md-4 mb-3';
    div.innerHTML = `
      <div class="card bg-dark border-warning text-warning h-100 p-2">
        <h5>${j.nom}</h5>
        <p>Club: ${j.club?.nom || ''}</p>
        <p>Poste: ${j.poste}</p>
        <p>Age: ${j.age}</p>
        <p>Buts: ${j.buts} | Cartons Jaunes: ${j.cartonsJaunes} | Cartons Rouges: ${j.cartonsRouges}</p>
      </div>`;
    container.appendChild(div);
  });
}

// ---------- CALENDRIER ----------
async function loadCalendrier() {
  const matchs = await fetchData('/matchs');
  ['l1','l2','n1','n2'].forEach(ligue => {
    const container = document.getElementById(`calendar-${ligue}`);
    if (!container) return;
    container.innerHTML = '';
    matchs.filter(m => m.ligue.nom.replace(/\s/g,'').toLowerCase() === ligue).forEach(m => {
      const div = document.createElement('div');
      div.className = 'card bg-dark border-warning text-warning mb-2 p-2';
      div.innerHTML = `
        <p><strong>${m.clubDomicile.nom}</strong> vs <strong>${m.clubExterieur.nom}</strong></p>
        <p>Date: ${new Date(m.date).toLocaleString()} | Stade: ${m.stade}</p>`;
      container.appendChild(div);
    });
  });
}

// ---------- RESULTATS ----------
async function loadResultats() {
  const matchs = await fetchData('/matchs');
  ['l1','l2','n1','n2'].forEach(ligue => {
    const container = document.getElementById(`results-${ligue}`);
    if (!container) return;
    container.innerHTML = '';
    matchs.filter(m => m.ligue.nom.replace(/\s/g,'').toLowerCase() === ligue && m.scoreDomicile != null).forEach(m => {
      const div = document.createElement('div');
      div.className = 'card bg-dark border-warning text-warning mb-2 p-2';
      div.innerHTML = `
        <p><strong>${m.clubDomicile.nom}</strong> ${m.scoreDomicile} - ${m.scoreExterieur} <strong>${m.clubExterieur.nom}</strong></p>
        <p>Date: ${new Date(m.date).toLocaleString()} | Stade: ${m.stade}</p>`;
      container.appendChild(div);
    });
  });
}

// ---------- CLASSEMENTS ----------
async function loadClassements() {
  const classements = await fetchData('/classements');
  ['l1','l2','n1','n2'].forEach(ligue => {
    const container = document.getElementById(`classement-${ligue}`);
    if (!container) return;
    container.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'table table-dark table-striped table-bordered text-warning';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Rang</th><th>Club</th><th>Points</th><th>V</th><th>N</th><th>D</th><th>Diff</th>
        </tr>
      </thead>
      <tbody>
        ${classements.filter(c => c.ligue.nom.replace(/\s/g,'').toLowerCase() === ligue)
          .sort((a,b)=>b.points-a.points)
          .map((c,i)=>`
            <tr>
              <td>${i+1}</td>
              <td>${c.club.nom}</td>
              <td>${c.points}</td>
              <td>${c.victoires}</td>
              <td>${c.nuls}</td>
              <td>${c.defaites}</td>
              <td>${c.diffButs}</td>
            </tr>`).join('')}
      </tbody>`;
    container.appendChild(table);
  });
}

// ---------- TALENTS ----------
async function loadTalents() {
  const talents = await fetchData('/talents');
  const container = document.getElementById('talents-list');
  if (!container) return;
  container.innerHTML = '';

  talents.forEach(t => {
    const div = document.createElement('div');
    div.className = 'col-md-4 mb-3';
    div.innerHTML = `
      <div class="card bg-dark border-warning text-warning h-100 p-2">
        <h5>${t.nom} (${t.age} ans)</h5>
        <p>Position: ${t.position}</p>
        <p>Club: ${t.club || 'Indépendant'}</p>
        ${t.videoUrl ? `<a href="${t.videoUrl}" target="_blank" class="btn btn-warning btn-sm mt-1">Voir Vidéo</a>` : ''}
        <p>${t.description || ''}</p>
      </div>`;
    container.appendChild(div);
  });
}

// ---------- FORMULAIRE TALENTS ----------
async function submitTalentForm() {
  const form = document.getElementById('talent-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(`${API_BASE}/talents`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Erreur lors de l\'envoi');
      form.reset();
      loadTalents();
      alert('Talent ajouté avec succès !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'envoi du talent.');
    }
  });
}

// ---------- INITIALISATION ----------
document.addEventListener('DOMContentLoaded', () => {
  loadClubs();
  loadJoueurs();
  loadCalendrier();
  loadResultats();
  loadClassements();
  loadTalents();
  submitTalentForm();
});
