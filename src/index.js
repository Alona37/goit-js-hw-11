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
  pixabayAPI.page = 1;
  clearGalleryEl();
  loadMorBtnDisable();
  toTopBtnDisable();

  try {
    const { data } = await pixabayAPI.fetchGallery();

    if (!data.hits.length) {
      erorrQuery();
      clearGalleryEl();
      return;
    }

    if (data.hits.length < pixabayAPI.per_page) {
      refs.galleryEl.innerHTML = cardTemplate(data.hits);
      loadMorBtnDisable();
      return;
    }

    Notify.success(`Hooray! We found ${data.total} images.`);
    refs.galleryEl.innerHTML = cardTemplate(data.hits);
    loadMorBtnEnable();
    toTopBtnEnable();

    lightbox.refresh();
    scrollPage();
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
      refs.galleryEl.insertAdjacentHTML('beforeend', cardTemplate(data.hits));
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

function loadMorBtnDisable() {
  refs.loadMoreBtn.classList.add('is-hidden');
}
function loadMorBtnEnable() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
function toTopBtnEnable() {
  refs.toTopBtn.classList.remove('is-hidden');
}
function toTopBtnDisable() {
  refs.toTopBtn.classList.add('is-hidden');
}
function clearGalleryEl() {
  refs.galleryEl.innerHTML = '';
}

function erorrQuery() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
function endOfSearch() {
  Notify.info("We're sorry, but you've reached the end of search results.");
}

function scrollPage() {
  const { height: cardHeight } =
    refs.galleryContainer.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onTopScroll() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
