import { fetchImages } from './js/pixabay-api';
import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
} from './js/render-functions';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import './css/styles.css';

let query = '';
let page = 1;
const perPage = 15;

const searchForm = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  const searchInput = event.currentTarget.elements['searchQuery'];
  const searchValue = searchInput.value.trim();

  if (!searchValue) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term!',
      position: 'topRight',
    });
    return;
  }

  query = searchValue;
  page = 1;
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);

    if (!data || !data.hits) {
      iziToast.error({
        title: 'Error',
        message: 'Invalid API response',
        position: 'topRight',
      });
      hideLoader(); // ← ДОДАНО
      return;
    }

    if (data.hits.length === 0) {
      iziToast.warning({
        title: 'No results',
        message: 'Sorry, no images found. Try another search!',
        position: 'topRight',
      });
      hideLoader(); // ← ДОДАНО
      return;
    }

    renderGallery(data.hits);

    if (data.totalHits > perPage) {
      showLoadMoreBtn();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong while fetching data.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;
  hideLoadMoreBtn();
  showLoader(); // ← Лоадер замість кнопки

  try {
    const data = await fetchImages(query, page, perPage);

    renderGallery(data.hits, true);

    const totalPages = Math.ceil(data.totalHits / perPage);
    if (page < totalPages) {
      showLoadMoreBtn();
    } else {
      iziToast.info({
        title: 'End of results',
        message: 'You have reached the end of search results.',
        position: 'topRight',
      });
    }

    smoothScroll();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images.',
      position: 'topRight',
    });
    showLoadMoreBtn(); // ← Показати кнопку знову при помилці
  } finally {
    hideLoader();
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
