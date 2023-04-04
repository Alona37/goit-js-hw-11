import { PixabayAPI } from './pixabay-api';
import cardTemplate from '../src/templates/card-template.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  toTopBtn: document.querySelector('.to-top_icon'),
};

const pixabayAPI = new PixabayAPI();

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const onSearchSubmit = async event => {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements['searchQuery'].value.trim();
  pixabayAPI.searchQuery = searchQuery;

  try {
    const { data } = await pixabayAPI.fetchGallery();
    if (!data.hits.length) {
      erorrQuery();
      return;
    }
    clearGalleryEl();
    Notify.success(`Hooray! We found ${data.total} images.`);
    refs.galleryEl.innerHTML = cardTemplate(data.hits);
    loadMorBtnEnable();
    toTopBtnEnable();

    if (data.hits.length < pixabayAPI.per_page) {
      loadMorBtnDisable();
      accessQuery();
      return;
    }
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * -100,
      behavior: 'smooth',
    });
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
};

const onLoadMoreBtnClick = async () => {
  pixabayAPI.page += 1;

  try {
    const { data } = await pixabayAPI.fetchGallery();

    if (data.hits.length < pixabayAPI.per_page) {
      loadMorBtnDisable();
      endOfSearch();
      return;
    }
    refs.galleryEl.insertAdjacentHTML('beforeend', cardTemplate(data.hits));
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
};

refs.formEl.addEventListener('submit', onSearchSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
refs.toTopBtn.addEventListener('click', onTopScroll);

function clearGalleryEl() {
  refs.galleryEl.innerHTML = '';
}

function loadMorBtnDisable() {
  refs.loadMoreBtn.classList.add('is-hidden');
}
function loadMorBtnEnable() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
function toTopBtnEnable() {
  refs.toTopBtn.classList.remove('is-hidden');
}
function erorrQuery() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
function accessQuery() {
  Notify.success(`Hooray! We found ${data.total} images.`);
}

function endOfSearch() {
  Notify.info("We're sorry, but you've reached the end of search results.");
}

function onTopScroll() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
