import axios from 'axios';
import { getCacheData, hasCacheKey, putCacheStorage } from '../utils/cache';

const BASE_URL = 'https://api.clinicaltrialskorea.com/';
const API_VERSION = 'api/v1/';

class ApiClient {
  #options = {};

  constructor(options) {
    this.#options.HOST = options.HOST.replace(/(.*)(\/$)/, '$1');
  }

  async #request(method, path, data) {
    let url = `${this.#options.HOST}/${path}`;

    const config = {
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    config.data = JSON.stringify(data);

    try {
      const response = await axios.request(config);
      return response;
    } catch (e) {
      if (e.response) throw e.response;
      throw e;
    }
  }

  async #get(path) {
    return await this.#request('GET', path);
  }

  async getCachedKeywords(keyword) {
    const URL = `${BASE_URL}${API_VERSION}search-conditions/?name=${keyword}`;
    const cacheStorage = await caches.open('keyword');
    const cacheBoolean = await hasCacheKey(cacheStorage, URL);

    if (cacheBoolean) return getCacheData(cacheStorage, keyword, URL);
    else return putCacheStorage(cacheStorage, keyword, URL);
  }

  async getKeywords(keyword) {
    console.info('calling api');
    return await this.#get(`search-conditions/?name=${keyword}`);
  }
}

export const apiClient = new ApiClient({
  HOST: API_VERSION,
});
