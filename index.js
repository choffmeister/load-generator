'use strict';

const axios = require('axios');

const urls = [
  'http://192.168.99.100:8080/api/ping/auth/foobar',
  'http://192.168.99.100:8080/api/ping/users/foobar',
  'http://192.168.99.100:8081/api/ping/auth/foobar',
  'http://192.168.99.100:8081/api/ping/users/foobar'
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
        timestamp: process.hrtime()
      });
    })
    .catch(res => res)
    .then(res => {
      if (res instanceof Error) {
        console.log(`[${index}] --- >   ${res.message}`);
      } else {
        const duration = process.hrtime(res.config.timestamp);
        console.log(`[${index}] ${res.status} > ${res.data} (${(duration[0] + duration[1] * 1e-9) * 1e3} ms)`);
      }
      return startRequestStream(index, maxTicks);
    });
}

for (let i = 0; i < concurrentStreams; i++) {
  startRequestStream(i, maxDelay);
}
