const { Builder, Browser } = require('selenium-webdriver');

module.exports = class WebPage {
    async navigateTo(url) {
        global.driver = new Builder().forBrowser(Browser.EDGE).build();
        driver.manage().setTimeouts({implicit: 5000});
        await driver.get(url);
    }

    async getTextFromElement(locator) {
        return await driver.findElement(locator).getText();
    }

    async typeText(locator, text) {
        await driver.findElement(locator).sendKeys(text);
    }

    async performClick(locator) {
        await driver.findElement(locator).click();
    }

    async captureScreen(fileName) {
        driver.takeScreenshot().then((img) => {
            require('fs').writeFileSync(fileName, img, 'base64')
        });
    }

    async closeWebBrowser(delay = 0) {
        if (delay) await driver.sleep(delay);
        await driver.quit();
    }
}
