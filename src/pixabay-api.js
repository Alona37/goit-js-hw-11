import axios from 'axios';

export class PixabayAPI {
  #API_KEY = '34928874-e324b5cea01949ad05bb97180';
  #BASE_URL = 'https://pixabay.com/api/';
  #BASE_SEARCH_PARAMS = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  page = 1;
  per_page = 40;

  fetchGallery() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        ...this.#BASE_SEARCH_PARAMS,
        q: this.searchQuery,
        page: this.page,
        per_page: this.per_page,
      },
    });
  }
  catch(error) {
    console.error(error);
  }
}
