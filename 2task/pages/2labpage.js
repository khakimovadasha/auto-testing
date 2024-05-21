const WebPage = require('./basepage');
const { By, Key } = require('selenium-webdriver');
const { assert } = require('chai');

class TimetablePage extends WebPage {
    async openHomepage() {
        await this.navigateTo('https://mospolytech.ru/');
    }

    async navigateToSchedule() {
        await this.performClick(By.xpath('//ul[@class="user-nav__list"]//a[@href="/obuchauschimsya/raspisaniya/"]'));
        await driver.sleep(1500);
    }

    async accessScheduleLink() {
        this.originalWindow = await driver.getWindowHandle();
        await this.performClick(By.xpath('//a[@href="https://rasp.dmami.ru/"]'));
        await driver.sleep(1000);
    }

    async enterGroupNumber() {
        const windows = await driver.getAllWindowHandles();
        for (const handle of windows) {
            if (handle !== this.originalWindow) {
                await driver.switchTo().window(handle);
            }
        }

        await this.typeText(By.xpath('//input[@class="groups"]'), '221-321');
        await driver.findElement(By.xpath('//input[@class="groups"]')).sendKeys(Key.ENTER);
    }

    async verifyGroupPresence() {
        return !!await driver.findElement(By.xpath('//div[@id="221-321"]'));
    }

    async selectGroupSchedule() {
        await this.performClick(By.xpath('//div[@id="221-321"]'));
    }

    async checkCurrentDayHighlighted() {
        return (await driver.findElement(By.xpath(`//div[@class="schedule-week"]/child::div[position()=${new Date().getDay()}]`)).getAttribute('class')).includes('schedule-day_today');
    }
}

module.exports = TimetablePage;
