export const modalFade = (title, id) => {
  resetInput();
  const myModal = document.getElementById("myModal");
  const modalTitle = document.getElementById("modal-title");
  const inputId = document.getElementById("id");
  const inputId2 = document.getElementById("id2");
  inputId.value = id;
  inputId2.value = id;
  const btn = document.querySelector(".modal button[type='submit']");
  if (title === "save") {
    btn.innerText = "Save";
    btn.setAttribute("id", "save");
  } else {
    btn.innerText = "Update";
    btn.setAttribute("id", "update");
  }
  modalTitle.innerText = title;
  myModal.classList.toggle("hidden");
};

const resetInput = () => {
  const id = document.getElementById("id");
  const id2 = document.getElementById("id2");
  const title = document.getElementById("title");
  const year = document.getElementById("year");
  const author = document.getElementById("author");
  id.value = "";
  id2.value = "";
  title.value = "";
  year.value = "";
  author.value = "";
};

export const showAddModal = (id) => {
  const addBook = document.getElementById("addBook");
  const title = "save";
  addBook.onclick = () => {
    modalFade(title, id || generateId());
  };
};

export const closeModal = () => {
  const closeBtn = document.getElementById("close");
  closeBtn.onclick = () => {
    modalFade();
  };
};

export const modalDelete = (book) => {
  const modalDelete = document.getElementById("modal-delete");
  const textDelete = document.getElementById("text-delete-modal");
  const titleDelete = document.getElementById("title-delete-modal");
  const deleteBtn = document.getElementById("ya-delete");
  deleteBtn.dataset.bookId = book?.id;
  titleDelete.innerText = book?.title;
  textDelete.innerText = book?.title;

  modalDelete.classList.toggle("hidden");
};

export const generateId = () => {
  return +new Date();
};
