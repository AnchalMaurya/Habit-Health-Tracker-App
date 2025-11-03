/* ------------ DOM ELEMENTS ------------ */
const menuIcon = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const cardArea = document.querySelector(".card-area");

const homeLink = document.getElementById("homeTab");
const todayTab = document.getElementById("todayTab");
const historyTab = document.getElementById("historyTab");

const todaySection = document.getElementById("todaySection");
const historySection = document.getElementById("historySection");

const habitInput = document.getElementById("habitInput");
const habitDateInput = document.getElementById("habitDate");
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");
const habitList = document.getElementById("habitList");

const progressCircle = document.querySelector(".progress-circle");
const progressText = document.getElementById("progressText");

const historyTableBody = document.getElementById("historyTableBody");
const backToTodayBtn = document.getElementById("backToTodayBtn");


const healthTab = document.getElementById("healthTab");
const healthArea = document.getElementById("healthArea");
const backToMainBtn = document.getElementById("backToMainBtn");


/* ------------ STORAGE HELPERS ------------ */
function getHabits() {
    return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveHabits(habits) {
    localStorage.setItem("habits", JSON.stringify(habits));
}


/* ------------ RENDER FUNCTIONS ------------ */
function renderHabits() {
  const habits = getHabits();
  habitList.innerHTML = "";

  habits.forEach((habit, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.completed;
    checkbox.addEventListener("change", () => toggleHabitCompletion(index, checkbox.checked));

    const span = document.createElement("span");
    span.textContent = habit.text;
    if (habit.completed) span.classList.add("completed");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.addEventListener("click", () => deleteHabit(index));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    habitList.appendChild(li);
  });

  updateProgress();
}

function renderHistory() {
  historyTableBody.innerHTML = "";
  const habits = getHabits();

  if (habits.length === 0) {
    historyTableBody.innerHTML = `<tr><td colspan="4">No history available</td></tr>`;
    return;
  }

  const grouped = {};
  habits.forEach(habit => {
    if (!grouped[habit.date]) grouped[habit.date] = [];
    grouped[habit.date].push(habit);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  sortedDates.forEach(date => {
    const tasks = grouped[date];
    const completed = tasks.filter(t => t.completed).length;
    const percent = Math.round((completed / tasks.length) * 100);

    tasks.forEach(task => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${date}</td>
        <td>${task.text}</td>
        <td>${task.completed ? "✅ Completed" : "❌ Pending"}</td>
        <td>${percent}%</td>
      `;
      historyTableBody.appendChild(row);
    });
  });
}


/* ------------ ACTION FUNCTIONS ------------ */
function updateProgress() {
  const habits = getHabits();
  if (habits.length === 0) {
    progressCircle.style.background = `conic-gradient(#43a047 0deg, #444 0deg)`;
    progressText.textContent = "0%";
    return;
  }

  const completed = habits.filter(h => h.completed).length;
  const percent = Math.round((completed / habits.length) * 100);
  progressCircle.style.background = `conic-gradient(#43a047 ${percent * 3.6}deg, #444 0deg)`;
  progressText.textContent = `${percent}%`;
}

function addHabit() {
  const text = habitInput.value.trim();
  const date = habitDateInput.value || new Date().toISOString().split("T")[0];
  if (!text) return;

  const habits = getHabits();
  habits.push({ text, completed: false, date });
  saveHabits(habits);

  habitInput.value = "";
  habitDateInput.value = "";
  renderHabits();
}

function resetHabits() {
  if (confirm("Are you sure you want to reset all tasks?")) {
    localStorage.removeItem("habits");
    renderHabits();
  }
}

function toggleHabitCompletion(index, completed) {
  const habits = getHabits();
  habits[index].completed = completed;
  saveHabits(habits);
  renderHabits();
}

function deleteHabit(index) {
  const habits = getHabits();
  habits.splice(index, 1);
  saveHabits(habits);
  renderHabits();
}


/* ------------ NAVIGATION HANDLERS ------------ */
function toggleSidebar() {
  sidebar.classList.toggle("active");
}

function showHome(e) {
  e.preventDefault();
  // Always hide health-area
  healthArea.classList.add("hidden");
  // Always show card-area
  cardArea.classList.remove("hidden");
  // Reset to Home (front side of the card)
  cardArea.classList.remove("flipped");

  // Update active state
  todayTab.classList.remove("active");
  historyTab.classList.remove("active");
}


function showToday(e) {
  e.preventDefault();
  // Ensure health-area is hidden and card-area is visible
  healthArea.classList.add("hidden");
  cardArea.classList.remove("hidden");

  // Show Today section
  cardArea.classList.add("flipped");
  todaySection.classList.remove("hidden");
  historySection.classList.add("hidden");

  // Active states
  todayTab.classList.add("active");
  historyTab.classList.remove("active");
}

function showHistory(e) {
  e.preventDefault();
  // Ensure health-area is hidden and card-area is visible
  healthArea.classList.add("hidden");
  cardArea.classList.remove("hidden");

  // Show History section
  cardArea.classList.add("flipped");
  historySection.classList.remove("hidden");
  todaySection.classList.add("hidden");

  renderHistory();

  // Active states
  historyTab.classList.add("active");
  todayTab.classList.remove("active");
}


function backToToday() {
  cardArea.classList.add("flipped");
  todaySection.classList.remove("hidden");
  historySection.classList.add("hidden");

  todayTab.classList.add("active");
  historyTab.classList.remove("active");
}

/* Show Health Area */
function showHealth(e) {
  e.preventDefault();
  healthArea.classList.remove("hidden");
  document.querySelector(".card-area").classList.add("hidden");
}

/* Back to Card Area */
function backToMain() {
  healthArea.classList.add("hidden");
  document.querySelector(".card-area").classList.remove("hidden");
}


/* ------------ EVENT LISTENER INITIALIZER ------------ */
function initEventListeners() {
  menuIcon.addEventListener("click", toggleSidebar);
  homeLink.addEventListener("click", showHome);
  todayTab.addEventListener("click", showToday);
  historyTab.addEventListener("click", showHistory);
  healthTab.addEventListener("click", showHealth);
  backToMainBtn.addEventListener("click", backToMain);
  backToTodayBtn.addEventListener("click", backToToday);

  addBtn.addEventListener("click", addHabit);
  resetBtn.addEventListener("click", resetHabits);
}


/* ------------ INIT ------------ */
document.addEventListener("DOMContentLoaded", () => {
  renderHabits();
  initEventListeners();

  if (localStorage.getItem("goToBMI") === "true") {
    localStorage.removeItem("goToBMI");

    healthArea.classList.remove("hidden");
    cardArea.classList.add("hidden");

    healthFlip.classList.add("flipped");
  }
});



const bmiCheckBtn = document.getElementById("bmi-check");
const healthFlip = document.getElementById("healthFlip");
const bmiForm = document.getElementById("bmiForm");
const bmiResult = document.getElementById("bmiResult");
const backToHealthBtn = document.getElementById("backToHealthBtn");

/* Flip to BMI Calculator */
bmiCheckBtn.addEventListener("click", () => {
  healthFlip.classList.add("flipped");
});

/* Back to Health Checkups */
backToHealthBtn.addEventListener("click", () => {
  healthFlip.classList.remove("flipped");
});

/* BMI Calculator */
/* BMI Calculator */
bmiForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("bmiName").value;
  const age = document.getElementById("bmiAge").value;
  const gender = document.getElementById("bmiGender").value;
  const weight = parseFloat(document.getElementById("bmiWeight").value);
  const heightCm = parseFloat(document.getElementById("bmiHeight").value);

  if (!weight || !heightCm) {
    alert("⚠ Please enter valid weight and height!");
    return;
  }

  const heightM = heightCm / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(2);

  // Store data in localStorage
  const bmiData = {
    name,
    age,
    gender,
    weight,
    height: heightCm,
    bmi
  };
  localStorage.setItem("bmiData", JSON.stringify(bmiData));

  // Redirect to dashboard.html
  window.location.href = "dashboard.html";
});
