const BasePage = require('./basepage');
const { By } = require('selenium-webdriver');

class SukkulentyPage extends BasePage {
    async navigateToCategories() {
        await this.clickElement('//span[contains(text(), "КАТЕГОРИИ")]');
        await this.sleep(2000);
    }

    async selectSukkulentsCategory() {
        await this.clickElement('//span[contains(text(), "Суккуленты")]');
        await this.sleep(2000);
    }

    async sortByPopularity() {
        await this.clickElement("//select[@name='orderby']");
        await this.clickElement("//option[@value='popularity']");
        await this.sleep(2000);
    }

    async addToCart(productId) {
        await this.clickElement(`//a[contains(@class, 'add-to-cart-loop') and @data-product_id='${productId}']`);
        await this.sleep(2000);
        console.log('✔️ Продукт добавлен в корзину.');
    }

    async closeCart() {
        await this.clickElement("//div[contains(@class, 'wd-close-side') and contains(@class, 'wd-fill')]");
        await this.sleep(2000);
        console.log('✔️ Корзина закрыта.');
    }

    async searchForProduct(productName) {
        await this.typeText("//input[@class='s' and @name='s' and @placeholder='Поиск товаров']", productName);
        console.log('✔️ Поиск выполнен.');
        await this.sleep(2000);
    }

    async getThirdProductDetails() {
        const products = await this.findElements(".product-wrapper");
        if (products.length >= 3) {
            const thirdProduct = products[2];
            const productName = await thirdProduct.findElement(By.xpath(".//h3[@class='wd-entities-title']/a")).getText();
            const productPrice = await thirdProduct.findElement(By.xpath(".//span[@class='woocommerce-Price-amount amount']/bdi")).getText();
            console.log("Название третьего товара: " + productName);
            console.log("Цена третьего товара: " + productPrice);
        } else {
            console.log("Меньше трех товаров в результате поиска.");
        }
    }
}

module.exports = SukkulentyPage;
