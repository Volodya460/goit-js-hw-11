import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';
import { ApiService } from './fetch';

const apiService = new ApiService();
// let inputValue = '';
// let page = 1;
// let quantityImg = 0;

const boxImagesEl = document.querySelector('.gallery');
const searchFormEl = document.querySelector('.search-form');
const loadMoreEl = document.querySelector('.load-more');
window.addEventListener('scroll', debounce(checkPosition, 300));
// window.addEventListener('resize', debounce(checkPosition, 300));

loadMoreEl.classList.add('is-hidden');
searchFormEl.addEventListener('submit', onSubmitForm);
loadMoreEl.addEventListener('click', onClickButtonMore);

function onSubmitForm(eve) {
  eve.preventDefault();

  loadMoreEl.classList.add('is-hidden');
  apiService.inputValue = eve.currentTarget.elements.searchQuery.value.trim();

  clearMarkup();

  if (!apiService.inputValue) {
    messageInfo('Write something');
    return;
  }

  apiService.resetPage();
  apiService.resetQuantityImg();
  getResponseData();

  eve.currentTarget.reset();
}

// async function fetchImages() {
//   const BASE_URL = 'https://pixabay.com/api/';

//   const searchParams = new URLSearchParams({
//     key: `33272220-12aa76911a3763f30e85ef70a`,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     per_page: 40,
//   });
//   return await axios
//     .get(`${BASE_URL}?${searchParams}&q=${inputValue}&page=${page}`)
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => messageError(error));
// }

async function getResponseData() {
  try {
    const { hits, totalHits } = await apiService.fetchImages();
    apiService.f;

    if (!hits.length) {
      messageError(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      return;
    }

    if (apiService.quantityImg === totalHits) {
      messageInfo("We're sorry, but you've reached the end of search results.");

      addCreatListImage(hits);
      optionsScroll();
      lightbox.refresh();

      return;
    } else {
      messageInfo(`Hooray! We found ${totalHits} images.`);
      addCreatListImage(hits);
      optionsScroll();
      lightbox.refresh();
    }
    loadMoreEl.classList.remove('is-hidden');
  } catch (err) {
    messageError(err.message);
  }
}

function onClickButtonMore(eve) {
  apiService.pagePlus();
  getResponseData();
}

function addCreatListImage(images) {
  const listImages = images
    .map(
      ({
        id,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
      }) => {
        return `<div class="photo-card">

  <a class='photo-link' href="${largeImageURL}">
  <img class='photo-img' src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>  
  <div class="info">
    <p class="info-item">
      <b>Likes </b><br>
      ${likes}
    </p>
    <p class="info-item">id=${id}</p>
    <p class="info-item">
      <b>Views </b><br>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments </b><br>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads </b><br>
      ${downloads}
    </p>
  </div>
</div>`;
      }
    )

    .join('');

  boxImagesEl.insertAdjacentHTML('beforeend', listImages);
}

// function pagePlus() {
//   page += 1;
// }
// function resetPage() {
//   page = 1;
// }
// function resetQuantityImg() {
//   quantityImg = 0;
// }

function clearMarkup() {
  boxImagesEl.innerHTML = '';
}

function messageError(message) {
  Notiflix.Notify.warning(message);
}

function messageInfo(message) {
  Notiflix.Notify.info(message);
}

var lightbox = new SimpleLightbox('.gallery a', {
  captions: false,

  captionsData: 'alt',
  captionDelay: 250,
});

function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;
  if (position >= threshold) {
    onClickButtonMore();
  }
}
function optionsScroll() {
  const { height: cardHeight } =
    boxImagesEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 0.2,
    behavior: 'smooth',
  });
}
