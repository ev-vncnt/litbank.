// Global variables
let currentPage = 1;
let currentSearchQuery = '';
let isLoading = false;

// DOM elements
const booksGrid = document.getElementById('booksGrid');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loadMoreButton = document.getElementById('loadMoreButton');
const booksCount = document.getElementById('booksCount');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing app...');
    loadInitialBooks();
    setupEventListeners();
});

function setupEventListeners() {
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    loadMoreButton.addEventListener('click', loadMoreBooks);
}

function loadInitialBooks() {
    console.log('Loading initial books...');
    showLoadingState();
    
    fetch('/api/books/random')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Books loaded:', data.books.length);
            displayBooks(data.books);
            updateBooksCount(data.books.length);
        })
        .catch(error => {
            console.error('Error loading books:', error);
            booksGrid.innerHTML = '<p class="error-message">Error 1: Error loading books. Please try again later.</p>';
        });
}

function performSearch() {
    const query = searchInput.value.trim();
    console.log('Searching for:', query);
    currentSearchQuery = query;
    currentPage = 1;
    
    if (query === '') {
        loadInitialBooks();
        return;
    }
    
    showLoadingState();
    
    fetch(`/api/books/search?q=${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Search results:', data.books.length);
            booksGrid.innerHTML = '';
            displayBooks(data.books);
            updateBooksCount(data.books.length, true);
        })
        .catch(error => {
            console.error('Error searching books:', error);
            booksGrid.innerHTML = '<p class="error-message">Error searching books. Please try again.</p>';
        });
}

function loadMoreBooks() {
    if (isLoading) return;
    
    isLoading = true;
    loadMoreButton.textContent = 'Loading...';
    loadMoreButton.disabled = true;
    
    const url = currentSearchQuery 
        ? `/api/books/search?q=${encodeURIComponent(currentSearchQuery)}&page=${currentPage + 1}`
        : `/api/books?page=${currentPage + 1}`;
    
    console.log('Loading more books from:', url);
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('More books loaded:', data.books.length);
            displayBooks(data.books, true);
            currentPage++;
            updateBooksCount(data.total || data.books.length);
            
            // Hide load more button if we've loaded all books
            if (data.books.length === 0 || (data.page && data.page >= data.total_pages)) {
                loadMoreButton.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error loading more books:', error);
        })
        .finally(() => {
            isLoading = false;
            loadMoreButton.textContent = 'load more books.';
            loadMoreButton.disabled = false;
        });
}

function displayBooks(books, append = false) {
    if (!append) {
        booksGrid.innerHTML = '';
    }
    
    if (books.length === 0) {
        booksGrid.innerHTML = '<p class="no-books">No books found.</p>';
        return;
    }
    
    books.forEach(book => {
        const bookElement = createBookElement(book);
        booksGrid.appendChild(bookElement);
    });
}

function createBookElement(book) {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book-card';
    
    // Handle missing or invalid data
    const thumbnail = book.thumbnail && book.thumbnail !== 'NaN' && book.thumbnail.startsWith('http') 
        ? book.thumbnail 
        : 'static/no-thumbnail.png';
    
    const title = book.title || 'Unknown Title';
    const authors = book.authors || 'Unknown Author';
    const categories = book.categories || 'Uncategorized';
    const rating = book.average_rating ? parseFloat(book.average_rating).toFixed(2) : 'No rating';
    const publishedYear = book.published_year || 'Unknown year';
    
    bookDiv.innerHTML = `
        <div class="book-image">
            <img src="${thumbnail}" alt="${title}">
        </div>
        <div class="book-info">
            <h3 class="book-title">${title}</h3>
            <p class="book-author">by ${authors}</p>
            <p class="book-category">${categories}</p>
            <div class="book-meta">
                <span class="book-rating">⭐ ${rating}</span>
                <span class="book-year">${publishedYear}</span>
            </div>
            ${book.description ? `<p class="book-description">${book.description.substring(0, 100)}...</p>` : ''}
        </div>
    `;
    
    return bookDiv;
}

function updateBooksCount(count, isSearch = false) {
    if (isSearch) {
        booksCount.textContent = `Found ${count} books matching your search`;
    } else {
        booksCount.textContent = `Displaying ${count} books`;
    }
    
    // Show/hide load more button based on context
    loadMoreButton.style.display = count > 0 && !isSearch ? 'block' : 'none';
}

function showLoadingState() {
    booksGrid.innerHTML = '<p class="loading-message">Loading books...</p>';
}