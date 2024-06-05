const puppeteer = require('puppeteer');
const { createAlert } = require('./alertService');
const { modentoUrl, apiKey } = require('./config');
const { connectDB, initDB, insertSite, querySite,deleteSite } = require('./database')


const scrapeModento = async () => {
  let browser;

  const db = await connectDB()
  await initDB(db)

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(modentoUrl, { waitUntil: 'networkidle2' });

    const rawData = await page.evaluate(() => {
      let data = [];
      let table = document.querySelector('table');

      for (let i = 1; i < table.rows.length; i++) {
        let objCells = table.rows.item(i).cells;
        let values = [];

        for (let j = 0; j < objCells.length; j++) {
          let text = objCells.item(j).innerText.toLowerCase();
          if (j == 1) {
            text = text.replace(/-/g, '').replace(/^emergencydentalof/, '').replace(/^emergencydental/, '');
          }
          values.push(text);
        }
        data.push({ i, values });
      }
      return data;
    });

    await browser.close();

    for (const row of rawData) {
      const [_, name, , , connectionStatus] = row.values;
      if (name !== "wisconsinsmiles") {
        console.log(`${name} ${connectionStatus}`);

        const siteData = await querySite(db, name);

        if (connectionStatus !== 'connected') {
          try {
            if (!siteData) {
              // Site is not in the database, create alert and insert new site with notified set to 1
              await createAlert(name, modentoUrl);
              await insertSite(db, name, 1);
            } else if (!siteData.notified) {
              // Site is in the database but not notified, create alert and update notified status
              await createAlert(name, modentoUrl);
              await insertSite(db, name, 1); // This assumes insertSite will update if the site already exists
            }
          } catch (error) {
            console.error('Error handling site disconnection:', error);
          }
        } else if(siteData){
          deleteSite(db,name)
        }
      }
    }
  } catch (error) {
    console.error('Error scraping Modento:', error);
    if (browser) {
      await browser.close();
    }
  }

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
};

module.exports = { scrapeModento };
