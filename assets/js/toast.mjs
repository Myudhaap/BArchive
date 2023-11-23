const toast = (arg) => {
  const toastContainer = document.getElementById("toast-container");
  const toast = makeUiToast(arg);
  toastContainer.appendChild(toast);
  removeToastAuto(toast, arg?.time);
};

const makeUiToast = (arg) => {
  const toastEl = document.createElement("div");
  toastEl.classList.add("toast");

  const toastStatusEl = document.createElement("div");
  toastStatusEl.classList.add("toast-status", "success");
  const iconStatusEl = document.createElement("i");
  iconStatusEl.classList.add("fa-solid", "fa-check");
  toastStatusEl.appendChild(iconStatusEl);

  const toastContentEl = document.createElement("div");
  toastContentEl.classList.add("toast-content");
  const contentTextEl = document.createElement("p");
  contentTextEl.classList.add("content-text");
  contentTextEl.innerText = arg?.text;
  const contentIconEl = document.createElement("i");
  contentIconEl.addEventListener("click", () => {
    toastEl.remove();
  });
  contentIconEl.classList.add("fa-solid", "fa-xmark");
  toastContentEl.append(contentTextEl, contentIconEl);

  toastEl.append(toastStatusEl, toastContentEl);
  toastEl.style.setProperty("--time", arg?.time ? `${arg?.time}ms` : "3000ms");

  return toastEl;
};

const removeToastAuto = (toast, time) => {
  const toastTimeout = setTimeout(
    () => {
      clearTimeout(toastTimeout);
      toast.remove();
    },
    time ? time + 2000 : 5000
  );
};

export default toast;
