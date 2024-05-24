const { By, Key, until, WebDriver } = require('selenium-webdriver');

class BasePage {
    constructor(driver) {
        this.driver = driver;
    }

    async openURL(url) {
        await this.driver.get(url);
        await this.driver.manage().window().maximize();
    }

    async findElement(xpath) {
        return await this.driver.findElement(By.xpath(xpath));
    }

    async findElements(cssSelector) {
        return await this.driver.findElements(By.css(cssSelector));
    }

    async clickElement(xpath) {
        const element = await this.driver.findElement(By.xpath(xpath));
        await element.click();
    }

    async typeText(xpath, text, clear = true) {
        const element = await this.findElement(xpath);
        if (clear) await element.clear();
        await element.sendKeys(text, Key.ENTER);
    }

    async sleep(duration) {
        await this.driver.sleep(duration);
    }
}

module.exports = BasePage;
