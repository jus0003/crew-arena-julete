(() => {
  const STORAGE_KEY = "todo-tasks-v1";

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const emptyMsg = document.getElementById("empty-msg");
  const countEl = document.getElementById("task-count");
  const clearDoneBtn = document.getElementById("clear-done");

  /** @type {{id: string, text: string, done: boolean}[]} */
  let tasks = load();

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render() {
    list.innerHTML = "";

    tasks.forEach((task) => {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", "Marcar como completada");
      checkbox.addEventListener("change", () => toggle(task.id));

      const text = document.createElement("span");
      text.textContent = task.text;
      text.addEventListener("click", () => toggle(task.id));

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "delete-btn";
      delBtn.textContent = "Eliminar";
      delBtn.addEventListener("click", () => remove(task.id));

      li.append(checkbox, text, delBtn);
      list.appendChild(li);
    });

    emptyMsg.style.display = tasks.length === 0 ? "block" : "none";

    const pending = tasks.filter((t) => !t.done).length;
    countEl.textContent = `${pending} pendiente${pending === 1 ? "" : "s"}`;
    clearDoneBtn.disabled = tasks.every((t) => !t.done);
  }

  function addTask(text) {
    tasks.push({ id: crypto.randomUUID(), text, done: false });
    save();
    render();
  }

  function toggle(id) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    save();
    render();
  }

  function remove(id) {
    tasks = tasks.filter((t) => t.id !== id);
    save();
    render();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTask(text);
    input.value = "";
    input.focus();
  });

  clearDoneBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.done);
    save();
    render();
  });

  render();
})();
