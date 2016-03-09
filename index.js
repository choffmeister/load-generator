'use strict';

const axios = require('axios');

const urls = [
  'https://sparkling-cherry.myepages.io/',
  'https://sparkling-cherry.myepages.io/cart',
  'https://sparkling-cherry.myepages.io/legal/Delivery-information',

  'https://sparkling-cherry.myepages.io/app.bundle.js',
  'https://sparkling-cherry.myepages.io/style.bundle.css',

  'https://sparkling-cherry.myepages.io/category/56D9401F-9833-9448-C03F-D5809A92E038',
  'https://sparkling-cherry.myepages.io/category/56D9401F-64E0-1C55-A9B7-D5809A92E038',

  'https://sparkling-cherry.myepages.io/product/56D9401D-F1F0-901E-CC79-D5809A92E050',
  'https://sparkling-cherry.myepages.io/product/56D9401D-17FB-33CF-0B8F-D5809A92E0F6',

  'https://sparkling-cherry.myepages.io/api/pages/startpage?shop=sparkling-cherry',
  'https://sparkling-cherry.myepages.io/api/products/56D9401D-17FB-33CF-0B8F-D5809A92E0F6?shop=sparkling-cherry',
  'https://sparkling-cherry.myepages.io/api/categories/56D9401F-9833-9448-C03F-D5809A92E038?shop=sparkling-cherry',
  'https://sparkling-cherry.myepages.io/api/products?shop=sparkling-cherry&sort=price-asc&resultsPerPage=12&page=1&categoryId=56D9401F-9833-9448-C03F-D5809A92E038',

  'https://sparkling-cherry.myepages.io/storage/images/image?shop=sparkling-cherry&remote=https:%2F%2Fr2d2.epages.com%2FWebRoot%2FStore%2FShops%2Fsparkling-cherry%2FProducts%2Fshirt-round-woman-beige.jpg&width=620&height=620',
  'https://sparkling-cherry.myepages.io/storage/images/image?shop=sparkling-cherry&remote=https:%2F%2Fr2d2.epages.com%2FWebRoot%2FStore%2FShops%2Fsparkling-cherry%2FProducts%2Fshirt-round-woman-beige.jpg&width=272&height=272',
  'https://sparkling-cherry.myepages.io/storage/images/image?shop=sparkling-cherry&remote=https:%2F%2Fr2d2.epages.com%2FWebRoot%2FStore%2FShops%2Fsparkling-cherry%2FProducts%2Ftop-woman-blue.jpg&width=272&height=272',
  'https://sparkling-cherry.myepages.io/storage/images/image?shop=sparkling-cherry&remote=https:%2F%2Fr2d2.epages.com%2FWebRoot%2FStore%2FShops%2Fsparkling-cherry%2FProducts%2Fpolo-woman-blue.jpg&width=272&height=272'
];
const maxDelay = 1000;
const concurrentStreams = 4;

function delayRandom(maxTicks) {
  const ticks = Math.round(Math.random() * maxTicks);
  return new Promise(resolve => setTimeout(() => resolve(), ticks));
}

function pickRandom(items) {
  const index = Math.round(Math.random() * (items.length - 1));
  return items[index];
}

function startRequestStream(index, maxTicks) {
  return delayRandom(maxTicks)
    .then(() => {
      const url = pickRandom(urls);
      return axios({
        method: 'GET',
        url,
        headers: {
          'X-Benchmark': 'load-generator'
        }
      });
    })
    .catch(res => console.log(res) || res)
    .then(res => {
      console.log(`[${index}] ${res.status} ${res.config.url}`);
      return startRequestStream(index, maxTicks);
    });
}

for (let i = 0; i < concurrentStreams; i++) {
  startRequestStream(i, maxDelay);
}
