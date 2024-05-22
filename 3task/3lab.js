const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

const BrowserType = Browser.EDGE;
const URL = 'https://market.yandex.ru/';

let driver = new Builder().forBrowser(BrowserType).build();

class MainPage {
    constructor(driver) {
        this.driver = driver;
        this.locator = {
            hamburger: By.xpath("//div[@data-zone-name='catalog']"),
            laptopsAndComputers: By.xpath("//span[contains(text(), 'Ноутбуки и компьютеры')]"),
            laptopsUrl: By.xpath("//a[@href='/catalog--noutbuki/54544/list?hid=91013']")
        };
    }

    async openURL() {
        await this.driver.get(URL);
        await this.driver.manage().window().maximize();
        console.log('✔️ Перейти по ссылке');
        await this.driver.sleep(7000);
    }

    async navigateToLaptops() {
        await this.driver.findElement(this.locator.hamburger).click();
        await this.driver.sleep(5000);
        let laptopsAndComputers = await this.driver.findElement(this.locator.laptopsAndComputers);
        await this.driver.actions({ async: true }).move({ origin: laptopsAndComputers }).perform();
        await this.driver.sleep(1000);
        let laptopsUrl = await this.driver.findElement(this.locator.laptopsUrl);
        await laptopsUrl.click();
        console.log('✔️ Открыта страница с ноутбуками');
        await this.driver.sleep(3000);
    }
}

class LaptopsPage {
    constructor(driver) {
        this.driver = driver;
        this.locator = {
            firstFiveLaptops: By.xpath("//h3[@data-auto='snippet-title']"),
            addToCartButton: By.xpath("//div[@data-zone-name='cartButton']"),
            cartButton: By.xpath("//a[contains(@href, '/my/cart')]"),
            searchInput: By.xpath("//input[@id='header-search']"), 
            searchButton: By.xpath("//button[@type='submit']") 
        };
        this.variables = {
            nameLaptops: [],
            priceLaptops: [],
            secondLaptopName: "",
            secondLaptopPrice: ""
        };
    }


    async displayFirstFiveLaptops() {
      await this.driver.wait(until.elementsLocated(this.locator.firstFiveLaptops), 10000);
      let laptops = await this.driver.findElements(this.locator.firstFiveLaptops);
      for (let i = 0; i < Math.min(5, laptops.length); i++) {
          let name = await laptops[i].getText();
          let price = await laptops[i].findElement(By.xpath("//div[@data-auto-themename='listDetailed']//span[@data-auto='snippet-price-current']")).getText();
          this.variables.nameLaptops.push(name);
          this.variables.priceLaptops.push(price);
          console.log(`Название: ${name}, Цена: ${price}`);
          
          if (i === 1) { 
              this.variables.secondLaptopName = name;
              this.variables.secondLaptopPrice = price;
              
              console.log(`Второй элемент сохранён: Название - ${this.variables.secondLaptopName}, Цена - ${this.variables.secondLaptopPrice}`);
          }
      }
  }



    async rememberDevice() {
        console.log('Название второго ноутбука: ' + this.variables.secondLaptopName);
        console.log('Цена второго ноутбука: ' + this.variables.secondLaptopPrice);
        console.log('✔️ Информация о втором ноутбуке записана');
    }

    async deviceSearch() {
        await this.driver.findElement(this.locator.searchInput).sendKeys(this.variables.secondLaptopName);
        await this.driver.findElement(this.locator.searchButton).click();
        console.log('✔️ Поиск выполнен для: ' + this.variables.secondLaptopName);
        await this.driver.sleep(3000);
    }

    
    
    
    async addSecondLaptopToCart() {
    let laptops = await this.driver.findElements(this.locator.firstFiveLaptops);
    if (laptops.length > 1) {
        let cartButton = await laptops[1].findElement(By.xpath(".//ancestor::li//div[@data-zone-name='cartButton']//button"));

        await cartButton.click();
        console.log('✔️ Второй товар добавлен в корзину');
        await this.driver.sleep(3000);
    }
}


    async verifyCartContents() {
        await this.driver.findElement(this.locator.cartButton).click();
        console.log('✔️ Переход в корзину выполнен');
        await this.driver.sleep(3000);
        let cartItems = await this.driver.findElements(By.xpath("//article//h3[contains(., his.variables.secondLaptopName )]"    ));
        assert(cartItems.length > 0, 'Товар не найден в корзине');
        console.log('✔️ Товар верифицирован в корзине');
    }

    async modifyProductQuantity() {
        let increaseButton = await this.driver.findElement(By.xpath("//div[@data-baobab-name='increase']//button"));
        await increaseButton.click();
        console.log('✔️ Количество товара увеличено');
        await this.driver.sleep(2000);
    }

    async removeProductFromCart() {
        let removeButton = await this.driver.findElement(By.xpath("//div[@data-baobab-name='remove']//button"));
        await removeButton.click();
        console.log('✔️ Товар удален из корзины');
        await this.driver.sleep(2000);
    }
}

describe('Тестирование корзины Яндекс.Маркет', function () {
    this.timeout(100000); 
    let mainPage = new MainPage(driver);
    let laptopsPage = new LaptopsPage(driver);

    before(async function () {
        await mainPage.openURL();
        await mainPage.navigateToLaptops();
    });

    it('Просмотр первых пяти ноутбуков и добавление второго в корзину', async function () {
        await laptopsPage.displayFirstFiveLaptops();
        await laptopsPage.rememberDevice();
        await laptopsPage.addSecondLaptopToCart();
    });

    it('Проверка содержимого корзины, изменение количества и удаление товара', async function () {
        await laptopsPage.verifyCartContents();
        await laptopsPage.modifyProductQuantity();
        await laptopsPage.removeProductFromCart();
    });

    after(async function () {
        await driver.quit();
    });
});