const { Builder } = require('selenium-webdriver');
require('selenium-webdriver/edge');
const SukkulentyPage = require('../pages/4labpage');

(async function testCategoriesButton() {
    let driver = await new Builder().forBrowser('MicrosoftEdge').build();
    let page = new SukkulentyPage(driver);

    try {
        await page.openURL('https://sukkulenty1.ru/');
        await page.navigateToCategories();
        await page.selectSukkulentsCategory();
        await page.sortByPopularity();
        await page.addToCart('11365');
        await page.closeCart();
        await page.searchForProduct("Опунция");
        await page.getThirdProductDetails();
    } catch (error) {
        console.error('Произошла ошибка во время выполнения теста:', error);
    } finally {
        await driver.quit();
    }
})();

