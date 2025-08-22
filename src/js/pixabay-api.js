import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '51776456-27ec020609b15dc1d566099b7';

export async function fetchImages(query, page = 1, perPage = 15) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
