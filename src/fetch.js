import axios from 'axios';

export class ApiService {
  constructor() {
    this.inputValue = '';
    this.page = 1;
    this.quantityImg = 0;
  }

  async fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';

    const searchParams = new URLSearchParams({
      key: `33272220-12aa76911a3763f30e85ef70a`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    });
    return await axios
      .get(`${BASE_URL}?${searchParams}&q=${this.inputValue}&page=${this.page}`)
      .then(response => {
        return response.data;
      })
      .catch(error => messageError(error));
  }

  get value() {
    return this.inputValue;
  }

  set value(newValue) {
    this.inputValue = newValue;
  }

  pagePlus() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetQuantityImg() {
    this.quantityImg = 0;
  }
}
