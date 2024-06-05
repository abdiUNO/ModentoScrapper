const { scrapeModento } = require('./scraper');

const runScraperEveryInterval = (intervalMinutes) => {
  scrapeModento();
  setInterval(scrapeModento, intervalMinutes * 60 * 1000);
};

runScraperEveryInterval(5);
