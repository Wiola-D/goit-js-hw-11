const { default: axios } = require('axios');

const inputText = 'yellow flowers';
const queryString = inputText.split(' ').join('+');

axios(
  `https:pixabay.com/api/?key=42471477-c4305623f815b95e7b6c9543d&q=${queryString}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
)
  .then(response => response.data)
  .then(({ hits }) => {
    const markup = hits.map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>${downloads}</b>
    </p>
  </div>
</div>`
    );
    return markup;
  })
  .then(markup => {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = markup.join('');
  });
