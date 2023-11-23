import toast from "./toast.mjs";
import { closeModal, modalDelete, modalFade, showAddModal } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // model
  const RENDER_BOOKS = "renderBooks";
  const books = JSON.parse(localStorage.getItem("booksStorage")) || [];
  let searchBooks;

  const generateObject = (id, title, year, author) => {
    return {
      id,
      title,
      year,
      author,
      isCompleted: false,
    };
  };

  const setDefaultValue = () => {
    books = JSON.parse(localStorage.getItem("booksStorage")) || [];
  };

  // view
  const showBooks = () => {
    makeBook();
  };

  const makeUiBook = (book) => {
    const bookEl = document.createElement("section");
    bookEl.classList.add("book", "card");

    const wrapEl = document.createElement("div");
    wrapEl.classList.add("wrap");

    const titleEl = document.createElement("h3");
    const statusEl = document.createElement("span");
    titleEl.classList.add("book-title");
    titleEl.innerText = book?.title;
    statusEl.classList.add("status", "primary");
    statusEl.innerText = book?.isCompleted
      ? "Selesai Baca"
      : "Belum Selesai Baca";
    wrapEl.append(titleEl, statusEl);

    const timeEl = document.createElement("p");
    timeEl.classList.add("book-timestamp");
    timeEl.innerText = book?.year;

    // action
    const actionEl = document.createElement("ul");
    actionEl.classList.add("book-action");

    const editEl = document.createElement("li");
    editEl.classList.add("action-edit");
    const editIEl = document.createElement("i");
    editIEl.classList.add("fa-solid", "fa-pen-to-square");
    editEl.appendChild(editIEl);
    editEl.addEventListener("click", () => {
      editBook(book?.id);
    });

    const btnEl = document.createElement("li");
    btnEl.addEventListener("click", () => {
      setCompleted(book?.id);
    });
    btnEl.classList.add("btn");
    if (!book?.isCompleted) {
      btnEl.classList.add("success");
      btnEl.innerText = "Selesai Baca ";
      const btnIEl = document.createElement("i");
      btnIEl.classList.add("fa-solid", "fa-book");
      btnEl.appendChild(btnIEl);
    } else {
      btnEl.classList.add("warning");
      btnEl.innerText = "Belum Selesai Baca ";
      const btnIEl = document.createElement("i");
      btnIEl.classList.add("fa-solid", "fa-book");
      btnEl.appendChild(btnIEl);
    }

    const deleteEl = document.createElement("li");
    deleteEl.classList.add("btn", "danger");
    deleteEl.addEventListener("click", () => {
      modalDelete(book);
    });
    deleteEl.innerText = "Hapus ";
    const deleteIEl = document.createElement("i");
    deleteIEl.classList.add("fa-solid", "fa-trash");
    deleteEl.appendChild(deleteIEl);

    actionEl.append(editEl, btnEl, deleteEl);

    bookEl.append(wrapEl, timeEl, actionEl);
    return bookEl;
  };

  const makeBook = () => {
    const bookSortDesc = localStorage.getItem("booksStorage")
      ? [...JSON.parse(localStorage.getItem("booksStorage"))].sort((a, b) =>
          b.id.localeCompare(a.id)
        )
      : [];
    const booksEl = document.querySelectorAll(".books");
    booksEl?.forEach((item) => {
      while (item.firstChild) {
        item.removeChild(item.lastChild);
      }
      bookSortDesc?.map((book, index) => {
        if (item.id == "recent-book" && index < 2) {
          item.appendChild(makeUiBook(book));
        }
      });
      if (searchBooks) {
        searchBooks?.map((book) => {
          if (item.id == "notcompleted-book" && !book.isCompleted) {
            item.appendChild(makeUiBook(book));
          } else if (item?.id == "completed-book" && book.isCompleted) {
            item.appendChild(makeUiBook(book));
          }
        });
      } else {
        books?.map((book) => {
          if (item.id == "notcompleted-book" && !book.isCompleted) {
            item.appendChild(makeUiBook(book));
          } else if (item.id == "completed-book" && book.isCompleted) {
            item.appendChild(makeUiBook(book));
          }
        });
      }
    });
  };

  showBooks();

  // controller

  // search
  const search = (searchInput) => {
    searchBooks = [...books]?.filter((book) =>
      book.title.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  const saveLocalStorage = () => {
    localStorage.setItem("booksStorage", JSON.stringify(books));
  };

  const setCompleted = (id) => {
    books?.map((book) => {
      if (book.id === id) book.isCompleted = !book.isCompleted;
    });
    toast({ text: "Status buku berhasil dirubah", time: 3000 });
    saveLocalStorage();
    document.dispatchEvent(new Event(RENDER_BOOKS));
  };

  // delete Book
  const deleteBook = (id) => {
    const indexBook = books?.findIndex((book) => book.id === id);
    searchBooks?.map((book, index) => {
      if (book.id == id) {
        searchBooks?.splice(index, 1);
      }
    });
    books?.splice(indexBook, 1);

    toast({ text: "Buku berhasil dihapus", time: 5000 });
    saveLocalStorage();
    document.dispatchEvent(new Event(RENDER_BOOKS));
  };

  // edit Book
  const editBook = (id) => {
    const bookEdit = books?.find((book) => book.id === id);
    modalFade("update", id);
    document.getElementById("id").value = bookEdit?.id;
    document.getElementById("id2").value = bookEdit?.id;
    document.getElementById("title").value = bookEdit?.title;
    document.getElementById("year").value = bookEdit?.year;
    document.getElementById("author").value = bookEdit?.author;
  };

  // add Book
  const addBook = () => {
    const id = document.getElementById("id2").value;
    const title = document.getElementById("title").value;
    const year = parseInt(document.getElementById("year").value);
    const author = document.getElementById("author").value;

    const generateBook = generateObject(id, title, year, author);
    books.push(generateBook);
    toast({ text: "Buku berhasil ditambah", time: 5000 });
    saveLocalStorage();
    document.dispatchEvent(new Event(RENDER_BOOKS));
  };

  document.getElementById("modal-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const btnForm = document.querySelector('.modal button[type="submit"]');
    const isUpdate = btnForm.id === "save" ? false : true;
    if (!isUpdate) {
      addBook();
    } else {
      updateBook();
    }
    modalFade();
  });

  // updateBook
  const updateBook = () => {
    const id = document.getElementById("id2").value;
    const title = document.getElementById("title").value;
    const year = parseInt(document.getElementById("year").value);
    const author = document.getElementById("author").value;

    const editBook = books?.find((book) => book.id === id);
    editBook.title = title;
    editBook.year = year;
    editBook.author = author;

    toast({ text: "Buku berhasil di update", time: 5000 });
    saveLocalStorage();
    document.dispatchEvent(new Event(RENDER_BOOKS));
  };

  // custom listener
  document.addEventListener(RENDER_BOOKS, () => {
    showBooks();
  });

  // utils
  const searchNav = document.getElementById("nav-search");
  const searchValue = document.getElementById("search-value");
  const searchInput = document.getElementById("search");
  document.getElementById("search-delete").onclick = () => {
    searchNav.classList.toggle("hidden");
    searchValue.textContent = "";
    searchInput.value = "";
    searchBooks = null;
    document.dispatchEvent(new Event(RENDER_BOOKS));
  };

  document.getElementById("formSearch").onsubmit = (e) => {
    e.preventDefault();
    searchNav.classList.toggle("hidden");
    searchValue.innerText = searchInput.value;
    search(searchInput.value);
    document.dispatchEvent(new Event(RENDER_BOOKS));
  };

  const deleteBtn = document.getElementById("ya-delete");
  document.getElementById("ya-delete").onclick = () => {
    const id = deleteBtn.dataset.bookId;
    deleteBook(id);
    modalDelete();
  };

  document.getElementById("tidak-delete").onclick = () => {
    modalDelete();
  };

  showAddModal();
  closeModal();
});
