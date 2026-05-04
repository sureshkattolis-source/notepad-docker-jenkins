/* ─── NoteVault – Frontend App Logic ──────────────────────── */

const API = "http://localhost:5000";  // ← Backend URL

let allNotes       = [];
let currentFilter  = "all";
let deleteTargetId = null;
let selectedColor  = "#ffffff";

/* ══════════════════════════════════════════════════════════════
   LOAD & RENDER
══════════════════════════════════════════════════════════════ */
async function loadNotes() {
  try {
    const res  = await fetch(`${API}/notes`);
    const data = await res.json();
    allNotes   = data.notes || [];
    applyFilter(currentFilter);
    updateCount(allNotes.length);
  } catch (err) {
    showToast("Cannot connect to server 😞", "error");
  }
}

function renderNotes(notes) {
  const grid  = document.getElementById("notesGrid");
  const empty = document.getElementById("emptyState");

  grid.innerHTML = "";

  if (!notes.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  notes.forEach(note => {
    const card = document.createElement("div");
    card.className  = "note-card";
    card.style.background = note.color || "#ffffff";

    const preview = (note.content || "").slice(0, 200);
    const dateStr = formatDate(note.updated_at);

    card.innerHTML = `
      ${note.is_pinned ? '<i class="fas fa-thumbtack pin-badge"></i>' : ""}
      <h3>${escHtml(note.title)}</h3>
      <p>${escHtml(preview)}</p>
      <div class="note-meta">
        <span class="category-badge">${escHtml(note.category)}</span>
        <div class="card-actions">
          <button class="card-btn" onclick="editNote(${note.id}, event)" title="Edit">
            <i class="fas fa-pen"></i>
          </button>
          <button class="card-btn del" onclick="deleteNote(${note.id}, event)" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="note-meta" style="margin-top:4px">
        <span style="font-size:.68rem">${dateStr}</span>
      </div>`;

    grid.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════════════════
   FILTER & SEARCH
══════════════════════════════════════════════════════════════ */
function filterNotes(filter, el) {
  currentFilter = filter;
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  if (el) el.classList.add("active");

  const titleMap = { all: "All Notes", pinned: "Pinned Notes", Work: "Work", Personal: "Personal", General: "General" };
  document.getElementById("pageTitle").textContent = titleMap[filter] || filter;

  applyFilter(filter);
}

function applyFilter(filter) {
  let filtered = [...allNotes];
  if (filter === "pinned")     filtered = filtered.filter(n => n.is_pinned);
  else if (filter !== "all")   filtered = filtered.filter(n => n.category === filter);
  renderNotes(filtered);
}

function handleSearch() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  if (!q) { applyFilter(currentFilter); return; }
  const filtered = allNotes.filter(
    n => n.title.toLowerCase().includes(q) || (n.content || "").toLowerCase().includes(q)
  );
  renderNotes(filtered);
}

/* ══════════════════════════════════════════════════════════════
   MODAL – CREATE / EDIT
══════════════════════════════════════════════════════════════ */
function openModal(note = null) {
  const overlay = document.getElementById("modalOverlay");
  overlay.classList.add("open");

  selectedColor = note?.color || "#ffffff";
  document.getElementById("noteId").value      = note?.id      || "";
  document.getElementById("noteTitle").value   = note?.title   || "";
  document.getElementById("noteContent").value = note?.content || "";
  document.getElementById("noteCategory").value= note?.category|| "General";
  document.getElementById("noteColor").value   = selectedColor;
  document.getElementById("notePinned").checked= !!note?.is_pinned;
  document.getElementById("modalTitle").textContent = note ? "Edit Note" : "New Note";

  // Highlight selected color dot
  document.querySelectorAll(".color-dot").forEach(dot => {
    dot.classList.toggle("selected", dot.dataset.color === selectedColor);
  });
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
}

function closeModalOnOverlay(e) {
  if (e.target === document.getElementById("modalOverlay")) closeModal();
}

function pickColor(dot) {
  document.querySelectorAll(".color-dot").forEach(d => d.classList.remove("selected"));
  dot.classList.add("selected");
  selectedColor = dot.dataset.color;
  document.getElementById("noteColor").value = selectedColor;
}

/* ══════════════════════════════════════════════════════════════
   SAVE (CREATE or UPDATE)
══════════════════════════════════════════════════════════════ */
async function saveNote() {
  const id       = document.getElementById("noteId").value;
  const title    = document.getElementById("noteTitle").value.trim() || "Untitled Note";
  const content  = document.getElementById("noteContent").value;
  const category = document.getElementById("noteCategory").value;
  const color    = document.getElementById("noteColor").value || "#ffffff";
  const pinned   = document.getElementById("notePinned").checked ? 1 : 0;

  const payload = { title, content, category, color, is_pinned: pinned };

  try {
    let res;
    if (id) {
      res = await fetch(`${API}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(`${API}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    if (res.ok) {
      closeModal();
      loadNotes();
      showToast(id ? "Note updated ✓" : "Note created ✓", "success");
    } else {
      showToast("Failed to save note", "error");
    }
  } catch {
    showToast("Server error", "error");
  }
}

/* ══════════════════════════════════════════════════════════════
   EDIT
══════════════════════════════════════════════════════════════ */
async function editNote(id, e) {
  e.stopPropagation();
  try {
    const res  = await fetch(`${API}/notes/${id}`);
    const note = await res.json();
    openModal(note);
  } catch {
    showToast("Could not load note", "error");
  }
}

/* ══════════════════════════════════════════════════════════════
   DELETE
══════════════════════════════════════════════════════════════ */
function deleteNote(id, e) {
  e.stopPropagation();
  deleteTargetId = id;
  document.getElementById("confirmOverlay").classList.add("open");
}

function cancelDelete() {
  deleteTargetId = null;
  document.getElementById("confirmOverlay").classList.remove("open");
}

async function confirmDelete() {
  document.getElementById("confirmOverlay").classList.remove("open");
  if (!deleteTargetId) return;
  try {
    const res = await fetch(`${API}/notes/${deleteTargetId}`, { method: "DELETE" });
    if (res.ok) {
      loadNotes();
      showToast("Note deleted", "success");
    } else {
      showToast("Failed to delete", "error");
    }
  } catch {
    showToast("Server error", "error");
  }
  deleteTargetId = null;
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className   = `toast show ${type}`;
  setTimeout(() => { t.className = "toast"; }, 3000);
}

function updateCount(n) {
  document.getElementById("noteCount").textContent = `${n} note${n !== 1 ? "s" : ""}`;
}

function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function escHtml(str) {
  const d = document.createElement("div");
  d.appendChild(document.createTextNode(str || ""));
  return d.innerHTML;
}

/* ── Init ── */
window.addEventListener("DOMContentLoaded", loadNotes);
