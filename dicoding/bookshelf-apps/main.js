(function() {
    try {
        if (JSON.parse(localStorage.getItem("books")) === null) localStorage.setItem("books", "[]");
    } catch {
        localStorage.setItem("books", "[]");
    };
    start();
    function getBooks() {
        let books = localStorage.getItem("books");
        try {
            books = JSON.parse(books);
        } catch {
            books = false;
        };
        return books;
    }
    function start() {
        let books = getBooks();
        books.map((book) => addBook(book));
    }
    function addBook(newData, keyword = "") {
        let books = getBooks();
        if (newData.title.toLowerCase().indexOf(keyword.toLowerCase()) < 0) return;
        const target = newData.isComplete ? document.querySelector("#completeBookshelfList") : document.querySelector("#incompleteBookshelfList");
        books.push(newData);
        const bookItem = document.createElement("article"),
              bookTitle = document.createElement("h3"),
              bookAuthor = document.createElement("p"),
              bookYear = document.createElement("p"),
              bookAction = document.createElement("div");
        bookItem.classList.add("book_item");
        bookTitle.innerText = newData.title;
        bookAuthor.innerText = `Penulis : ${newData.author}`;
        bookYear.innerText = `Tahun : ${newData.year}`;
        bookAction.classList.add("action");
        bookAction.innerHTML = `<button class="green">${newData.isComplete ? "Belum " : ""}Selesai dibaca</button>
                                <button class="red">Hapus buku</button>
                                <button class="edit"></button>`;
        const [greenButton, redButton, editButton] = bookAction.children;
        greenButton.addEventListener("click", () => moveBook(newData.id, !newData.isComplete));
        redButton.addEventListener("click", () => removeBook(newData.id, bookItem));
        editButton.addEventListener("click", () => editBook(newData.id, bookItem, { bookTitle, bookAuthor, bookYear }, keyword));
        bookItem.appendChild(bookTitle);
        bookItem.appendChild(bookAuthor);
        bookItem.appendChild(bookYear);
        bookItem.appendChild(bookAction);
        target.appendChild(bookItem);
    }
    function search(keyword) {
        let books = getBooks(),
            hasil = books.filter(book => book.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
        document.querySelector("#incompleteBookshelfList").innerHTML = "";
        document.querySelector("#completeBookshelfList").innerHTML = "";
        hasil.map(book => addBook(book));
    }
    function moveBook(id, toComplete = false) {
        let books = getBooks(),
            index = books.findIndex(book => book.id === id);
        if (books[index].isComplete === toComplete) return;
        books[index].isComplete = toComplete;
        document.querySelector("#incompleteBookshelfList").innerHTML = "";
        document.querySelector("#completeBookshelfList").innerHTML = "";
        books.map((book) => book.title.toLowerCase().indexOf(formSearchData.value) > -1 ? addBook(book) : null);
        localStorage.setItem("books", JSON.stringify(books));
    }
    function removeBook(id, bookElm) {
        if (confirm("Yakin menghapus?") === false) return;
        let books = getBooks(),
            index = books.findIndex(book => book.id === id);
        books.splice(index, 1);
        localStorage.setItem("books", JSON.stringify(books));
        if (typeof(bookElm.remove) === 'function') bookElm.remove();
    }
    function editBook(id, bookElm, { bookTitle, bookAuthor, bookYear }) {
        const modal = document.querySelector(".modal"),
              form = modal.querySelector("#updateBook"),
              keyword = document.querySelector("#searchBookTitle").value,
    onSubmitForm = e => {
        const judul = form.querySelector("#judul").value,
              penulis = form.querySelector("#penulis").value,
              tahun = form.querySelector("#tahun").value;
        let books = getBooks(),
            index = books.findIndex(book => book.id === id);
        if (judul.toLowerCase().indexOf(keyword.toLowerCase()) < 0) bookElm.remove();
        books[index].title = judul; bookTitle.innerText = judul;
        books[index].author = penulis; bookAuthor.innerText = `Penulis : ${penulis}`;
        books[index].year = tahun; bookYear.innerText = `Tahun : ${tahun}`;
        localStorage.setItem("books", JSON.stringify(books));
        setTimeout(() => modal.style.display = "none", 200);
        modal.querySelector(".modal-content.animate").animate(
            [
                {
                    transform: "scale(1)"
                },
                {
                    transform: "scale(0)"
                }
            ],
            {
                duration: 300
            }
        );
        e.preventDefault();
    };
        form.addEventListener("submit", onSubmitForm);
        modal.style.display = "block";
        modal.querySelector(".modal-content.animate").animate(
            [
                {
                    transform: 'scale(0)'
                },
                {
                    transform: 'scale(1)'
                }
            ],
            {
                duration: 300
            }
        );
        let books = getBooks(),
            index = books.findIndex(book => book.id === id),
            book = books[index];
        modal.querySelector("#judul").value = book.title;
        modal.querySelector("#penulis").value = book.author;
        modal.querySelector("#tahun").value = book.year;
        const closeModal = e => {
            if (e.target == modal || e.target == modal.querySelector(".close")) {
                form.removeEventListener("submit", onSubmitForm);
                setTimeout(() => modal.style.display = "none", 200);
                modal.querySelector(".modal-content.animate").animate(
                    [
                        {
                            transform: "scale(1)"
                        },
                        {
                            transform: "scale(0)"
                        }
                    ],
                    {
                        duration: 300
                    }
                );
                modal.removeEventListener("click", closeModal);
            }
        };
        modal.addEventListener("click", closeModal);
    }
    const formAddData = document.querySelector("#inputBook"),
          formSearchData = document.querySelector("#searchBookTitle");
    formAddData.addEventListener("submit", function(e) {
        try {
            if (JSON.parse(localStorage.getItem("books")) === null) localStorage.setItem("books", "[]");
        } catch {
            localStorage.setItem("books", "[]");
        };
        let newData = {
                id: +new Date(),
                title: this.querySelector("#inputBookTitle").value,
                author: this.querySelector("#inputBookAuthor").value,
                year: this.querySelector("#inputBookYear").value,
                isComplete: this.querySelector("#inputBookIsComplete").checked,
            },
            books = getBooks();
        books.push(newData);
        addBook(newData, formSearchData.value);
        localStorage.setItem("books", JSON.stringify(books));
        e.preventDefault();
    });
    formSearchData.addEventListener("input", () => search(formSearchData.value));
})();