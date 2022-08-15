const uf = module.exports;

uf.timeSince = time => {
  let t = {
    ms: 1,
    sec: 1000,
    min: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 86400000,
    month: 1000 * 60 * 60 * 24 * 30,
    year: 1000 * 60 * 60 * 24 * 365,
  };
  let timeSinceNow = Date.now() - new Date(time);
  if (timeSinceNow <= 0) {
    return 'now';
  }
  let formatted = '';
  let i = 0;
  while (!formatted) {
    if (Math.floor(timeSinceNow / t[Object.keys(t).reverse()[i]])) {
      formatted = `${Math.floor(
        timeSinceNow / t[Object.keys(t).reverse()[i]],
      )} ${Object.keys(t).reverse()[i]}`;
    }
    i = i + 1;
  }
  return formatted;
};

uf.formatBytes = bytes => {
  let b = {
    mB: 1000000,
    kB: 1000,
    B: 1,
  };
  let formatted = '';
  let i = 0;
  while (!formatted) {
    if (Math.floor(bytes / b[Object.keys(b)[i]])) {
      formatted = `${(bytes / b[Object.keys(b)[i]]).toFixed(1)}${
        Object.keys(b)[i]
      }`;
    }
    i++;
  }
  return formatted;
};

uf.formatCount = num => {
  if (num > 999999) {
    return (num / 1000000).toFixed(1) + 'm';
  }
  if (num > 999) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num;
};
