'use strict';

const axios = require('axios');
const sprintf = require('sprintf-js').sprintf;

const urls = [
  'https://app.airfocus.io:8443/api/ping/system/cluster-node'
];
const maxDelay = 250;
const concurrentStreams = 1;
let nextId = 0;

function delayRandom(maxTicks, fn) {
  const ticks = Math.round(Math.random() * maxTicks);
  setTimeout(() => fn(), ticks);
}

function pickRandom(items) {
  const index = Math.round(Math.random() * (items.length - 1));
  return items[index];
}

function startRequestStream(index, maxTicks) {
  delayRandom(maxTicks, () => {
    const url = pickRandom(urls);
    const id = nextId++;

    return axios({
      method: 'POST',
      data: sprintf('ping-%010i', id),
      url,
      timestamp: process.hrtime()
    })
    .catch(res => res)
    .then(res => {
      if (res instanceof Error) {
        console.log(sprintf('[---]              > %s', res.message));
      } else {
        const duration = process.hrtime(res.config.timestamp);
        const durationMs = (duration[0] + duration[1] * 1e-9) * 1e3;

        console.log(sprintf('[%3i] %9.2f ms > %s', res.status, durationMs, res.data));
      }
      return startRequestStream(index, maxTicks);
    })
  });

  return null;
}

for (let i = 0; i < concurrentStreams; i++) {
  startRequestStream(i, maxDelay);
}
