const { default: axios } = require('axios');
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.querySelector('.search-input');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const searchBtn = document.querySelector('.search-btn');
const searchForm = document.querySelector('#search-form');

var lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

let currentPage = 1;

async function fetchData(page = 1) {
  try {
    const response = await axios.get(
      `https:pixabay.com/api/?key=42471477-c4305623f815b95e7b6c9543d&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    const { hits, totalHits } = response.data;
    renderSelect(response.data.hits);
    if (hits.length === 0) {
      Notiflix.Notifly.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadBtn.style.display = 'none';
      return;
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  }
}

function renderSelect(hits) {
  const markup = hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `

        <li class="photo-card">
        <a class = "gallery__link" href="${largeImageURL}">
          <img class="gallery_image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
          <div class="info">
          <p class="info-item"><span><b>Likes</b></span><span>${likes}</span></p>
                        <p class="info-item"><span><b>Views</b></span><span>${views}</span></p>
                        <p class="info-item"><span><b>Comments</b></span><span>${comments}</span></p>
                        <p class="info-item"><span><b>Downloads</b></span><span>${downloads}</span></p>
        </div>
      </li>
    `;
    }
  );
  gallery.insertAdjacentHTML('beforeend', markup.join(''));
}

function loadMore() {
  currentPage += 1;
  fetchData(currentPage);
}

searchBtn.addEventListener('click', e => {
  e.preventDefault();
  gallery.innerHTML = '';
  fetchData();
});

loadBtn.addEventListener('click', e => {
  e.preventDefault();
  loadMore();
});
