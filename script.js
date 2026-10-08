const startButton = document.querySelector(".start-button");
const startMenu = document.getElementById("startMenu");
const clock = document.getElementById("clock");

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  clock.textContent = time;
}

updateClock();
setInterval(updateClock, 1000);

startButton.addEventListener("click", () => {
  startMenu.classList.toggle("hidden");
});

document.querySelectorAll(".menu-item, .desktop-icon, .dock-item").forEach((item) => {
  item.addEventListener("click", () => {
    const app = item.dataset.app;
    openWindow(app);
    startMenu.classList.add("hidden");
  });
});

function openWindow(appName) {
  const windows = document.querySelectorAll(".window");
  windows.forEach((win) => {
    const isMatch = win.dataset.window === appName;
    win.classList.toggle("hidden", !isMatch);
  });

  document.querySelectorAll(".dock-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.app === appName);
  });
}

dragWindows();

function dragWindows() {
  const headers = document.querySelectorAll(".draggable");

  headers.forEach((header) => {
    const windowEl = header.closest(".window");
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener("mousedown", (event) => {
      isDragging = true;
      const rect = windowEl.getBoundingClientRect();
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
      windowEl.style.zIndex = "20";
    });

    document.addEventListener("mousemove", (event) => {
      if (!isDragging) return;

      const maxX = window.innerWidth - windowEl.offsetWidth;
      const maxY = window.innerHeight - windowEl.offsetHeight - 60;

      const newX = Math.min(Math.max(event.clientX - offsetX, 10), maxX);
      const newY = Math.min(Math.max(event.clientY - offsetY, 70), maxY);

      windowEl.style.left = `${newX}px`;
      windowEl.style.top = `${newY}px`;
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  });
}
