const { Builder, Browser } = require("selenium-webdriver");

class WebPage {
  async navigate(url) {
    global.driver = new Builder().forBrowser(Browser.CHROME).build();
    driver.manage().setTimeouts({ implicit: 5000 });
    await driver.get(url);
  }

  async typeText(locator, text) {
    await driver.findElement(locator).sendKeys(text);
  }

  async retrieveText(locator) {
    return await driver.findElement(locator).getText();
  }

  async select(locator) {
    await driver.findElement(locator).click();
  }

  async captureScreenshot(fileName) {
    driver.takeScreenshot().then((img) => {
      require("fs").writeFileSync(fileName, img, "base64");
    });
  }

  async shutdownBrowser(delay = 0) {
    if (delay) await driver.sleep(delay);
    await driver.quit();
  }
}

module.exports = WebPage;
