// target elements --------------
const booksDiv = document.getElementById("books");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const viewSelect = document.getElementById("view");
const sortSelect = document.getElementById("sort");

let currentPage = 1;

// Fetch data from API -------------------------------
async function fetchData(page = 1, sort = "byTittle") {
  const searchValue = searchInput.value;

  try {
    const result = await fetch(
      `https://api.freeapi.app/api/v1/public/books?limit=10&page=${page}&query=${searchValue}`
    );
    const data = await result.json();
    const BooksData = data.data.data;
    booksDiv.innerHTML = "";
    if (sort === "byTittle") {
      BooksData.sort((a, b) => {
        const titleA = a.volumeInfo.title.toLowerCase();
        const titleB = b.volumeInfo.title.toLowerCase();
        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }
        return 0;
      });
    } else {
      BooksData.sort((a, b) => {
        const dateA = new Date(a.volumeInfo.publishedDate);
        const dateB = new Date(b.volumeInfo.publishedDate);
        return dateB - dateA;
      });
    }

    BooksData.map((book) => {
      booksDiv.innerHTML += `<div class="bg-white p-4 rounded-lg shadow-lg flex cursor-pointer flex-col justify-start items-center hover:shadow-2xl duration-300 gap-2 book" onclick="window.open('${book.volumeInfo.infoLink}', '_blank')">
              <img src="${book.volumeInfo.imageLinks.thumbnail}" alt="" class="w-[100px] object-cover rounded-lg shadow-lg" />
              <div class="flex flex-col items-center">
                
                <h2 class="text-black text-lg font-bold text-center mt-4">${book.volumeInfo.title}</h2>
                <p class="text-sm text-gray-700 text-center">${book.volumeInfo.authors}</p>
                <p class="text-sm text-gray-700">${book.volumeInfo.publishedDate}</p>
                </div>
              </div>
              `;
    });
    paginationDiv.innerHTML = "";
    const previousButton = document.createElement("button");
    previousButton.classList.add(
      "bg-purple-700",
      "hover:bg-purple-900",
      "text-white",
      "font-bold",
      "py-2",
      "px-4",
      "rounded"
    );
    previousButton.innerText = "Previous set of details";
    previousButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
      }
      fetchData(currentPage);
    });
    const nextButton = document.createElement("button");
    nextButton.classList.add(
      "bg-purple-700",
      "hover:bg-purple-900",
      "text-white",
      "font-bold",
      "py-2",
      "px-4",
      "rounded"
    );
    nextButton.innerText = "Next set of details";
    nextButton.addEventListener("click", () => {
      if (currentPage < data.data.totalPages) {
        currentPage++;
      }
      fetchData(currentPage);
    });
    const pageNumber = document.createElement("p");
    pageNumber.classList.add(
      "bg-purple-700",
      "hover:bg-purple-900",
      "text-white",
      "font-bold",
      "py-2",
      "px-4",
      "rounded"
    );
    pageNumber.innerText = `Page ${currentPage} of ${data.data.totalPages}`;
    paginationDiv.appendChild(previousButton);
    paginationDiv.appendChild(pageNumber);
    paginationDiv.appendChild(nextButton);
  } catch (err) {
    console.log(err);
  }
}
fetchData();

// Search Book -------------------------------
searchButton.addEventListener("click", () => {
  fetchData(1);
});

// View Book -------------------------------
viewSelect.addEventListener("change", (e) => {
  const book = document.querySelectorAll(".book");
  if (e.target.value === "list") {
    booksDiv.classList.remove("md:grid-cols-3", "lg:grid-cols-4");
    book.forEach((b) => b.classList.remove("flex-col"));
  } else {
    booksDiv.classList.add("md:grid-cols-3", "lg:grid-cols-4");
    book.forEach((b) => b.classList.add("flex-col"));
  }
});

// Sort Book -------------------------------
sortSelect.addEventListener("change", (e) => {
  const book = document.querySelectorAll(".book");
  if (e.target.value === "byTittle") {
    fetchData(1, "byTittle");
  } else {
    fetchData(1, "byDate");
  }
});
