const puppeteer = require("puppeteer");
let page;
let browser = null;

module.exports = context => {
  const logger = context.logger
  context.headless = {

    launchHeadless: async (host, remoteDebugPort) => {
      browser = await puppeteer.launch({
        args: [`--remote-debugging-port=${remoteDebugPort}`, `--disable-gpu`]
      });
      logger.log(`Headless has been launched`);
      page = await browser.newPage();
      await page.setUserAgent("5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36");
      await page.goto(`http://${host}/runtime.html`);
      logger.log(`Headless page goto http://${host}/runtime.html`);
    },
    
    closeHeadless: async () => {
      if (page) {
        await page.close();
      }
      if (browser) {
        await browser.close();
      }
      browser = null;
      logger.log(`Cloased headless`);
    }

  }
};
