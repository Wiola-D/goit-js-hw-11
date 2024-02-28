const { default: axios } = require('axios');
import _throttle from 'lodash.throttle';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.scss';

const input = document.querySelector('.search-input');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const searchBtn = document.querySelector('.search-btn');
const searchForm = document.querySelector('#search-form');

var lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  scrollZoomFactor: false,
});

let currentPage = 1;

async function fetchData(name, page) {
  try {
    const response = await axios.get(
      `https:pixabay.com/api/?key=42471477-c4305623f815b95e7b6c9543d&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );

    const photos = await response.data;
    if (photos.hits.length === 0) {
      loadBtn.classList.add('hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      loadBtn.classList.remove('hidden');
      checkResults(photos);
      renderSelect(photos);
      lightbox.refresh();
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

// Funkcja spawdzania wyników
const checkResults = photos => {
  if (photos.hits.length < 40 && photos.hits.length > 0) {
    if (currentPage === 1) {
      Notiflix.Notify.success(`"Hooray! We found ${photos.totalHits} images."`);
    }
    loadBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    if (currentPage === 1) {
      Notiflix.Notify.success(`"Hooray! We found ${photos.totalHits} images."`);
    }
  }
};

//Funkcja tworzenia zdjęć w galeri
const renderSelect = photos => {
  const markup = photos.hits
    .map(photo => {
      return ` <li class="photo-card">
        <a class = "gallery__link" href="${photo.largeImageURL}">
          <img class="gallery_image" src="${photo.webformatURL}" loading="lazy" alt="${photo.tags}" loading="lazy" /></a>
          <div class="info">
          <p class="info-item"><span><b>Likes</b></span><span>${photo.likes}</span></p>
                        <p class="info-item"><span><b>Views</b></span><span>${photo.views}</span></p>
                        <p class="info-item"><span><b>Comments</b></span><span>${photo.comments}</span></p>
                        <p class="info-item"><span><b>Downloads</b></span><span>${photo.downloads}</span></p>
        </div>
      </li>
    `;
    })
    .join('');
  gallery.innerHTML = gallery.innerHTML + markup;
};

// Nasłuchiwacz czy jest wypełniany formularz
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const searchQuery = input.value.trim();
  if (!searchQuery) {
    Notiflix.Notify.info('Please enter a search query.');
    gallery.innerHTML = '';
  } else {
    gallery.innerHTML = '';
    currentPage = 1;
    fetchData();
  }
});

// Funkcja do ładowania kolejnych zdjęć
const loadMore = () => {
  currentPage++;
  fetchData(currentPage);
};

// Nasłuchywacz na Button "LOADE MORE"
loadBtn.addEventListener('click', e => {
  e.preventDefault();
  loadMore();
});
