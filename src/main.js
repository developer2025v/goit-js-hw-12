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

console.log('DEBUG: searchForm =', searchForm);
console.log('DEBUG: loadMoreBtn =', loadMoreBtn);

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();
  console.log('DEBUG: onSearch triggered ✅');

  console.log(
    'DEBUG: event.currentTarget.elements =',
    event.currentTarget.elements
  );
  const searchInput = event.currentTarget.elements['searchQuery'];

  if (!searchInput) {
    console.error('❌ ERROR: searchQuery input not found у формі');
    return;
  }

  const searchValue = searchInput.value.trim();
  console.log('DEBUG: searchValue =', searchValue);

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
    console.log('DEBUG: fetchImages response =', data);

    if (!data || !data.hits) {
      console.error('❌ ERROR: API response is invalid');
      return;
    }

    if (data.hits.length === 0) {
      iziToast.warning({
        title: 'No results',
        message: 'Sorry, no images found. Try another search!',
        position: 'topRight',
      });
      return;
    }

    renderGallery(data.hits);

    if (data.totalHits > perPage) {
      showLoadMoreBtn();
    }
  } catch (error) {
    console.error('❌ ERROR in onSearch:', error);
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
  console.log('DEBUG: onLoadMore triggered ✅');
  page += 1;
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);
    console.log('DEBUG: fetchImages response (load more) =', data);

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
    console.error('❌ ERROR in onLoadMore:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images.',
      position: 'topRight',
    });
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
