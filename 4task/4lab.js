const { Builder, By, Key, until, Browser } = require('selenium-webdriver');
require('selenium-webdriver/edge');

const BrowserType = Browser.EDGE;

async function testCategoriesButton() {
  let driver = await new Builder().forBrowser(BrowserType).build();
  await driver.manage().window().maximize();

  try {
    await driver.get('https://sukkulenty1.ru/');
    await driver.sleep(2000);

    let categoriesButton = await driver.findElement(By.xpath('//span[contains(text(), "КАТЕГОРИИ")]'));
    await categoriesButton.click();
    await driver.sleep(2000);

    let succulentsLink = await driver.findElement(By.xpath('//span[contains(text(), "Суккуленты")]'));
    await succulentsLink.click();
    await driver.sleep(2000);

    let dropdown = await driver.findElement(By.name("orderby"));
    await dropdown.click();
    let popularOption = await driver.findElement(By.xpath("//option[@value='popularity']"));
    await popularOption.click();
    await driver.sleep(2000);

    let addToCartButton = await driver.findElement(By.xpath("//a[contains(@class, 'add-to-cart-loop') and @data-product_id='11365']"));
    await addToCartButton.click();
    await driver.sleep(2000);
    console.log('✔️ Продукт добавлен в корзину.');

    let closeCartButton = await driver.findElement(By.xpath("//div[contains(@class, 'wd-close-side') and contains(@class, 'wd-fill')]"));
    await closeCartButton.click();
    await driver.sleep(2000);
    console.log('✔️ Корзина закрыта.');

    let searchInput = await driver.findElement(By.xpath("//input[@class='s' and @name='s' and @placeholder='Поиск товаров']"));
    await searchInput.clear();
    await searchInput.sendKeys("Опунция", Key.ENTER); 
    await driver.sleep(2000);
    console.log('✔️ Поиск выполнен.');

    let products = await driver.findElements(By.css(".product-wrapper"));
    if (products.length >= 3) {
      let thirdProduct = products[2];

      let productName = await thirdProduct.findElement(By.xpath(".//h3[@class='wd-entities-title']/a")).getText();
      let productPrice = await thirdProduct.findElement(By.xpath(".//span[@class='woocommerce-Price-amount amount']/bdi")).getText();
      
      console.log("Название третьего товара: " + productName);
      console.log("Цена третьего товара: " + productPrice);

      let productLink = await thirdProduct.findElement(By.css("a.product-image-link"));
      await productLink.click();
      console.log("✔️ Переход на страницу третьего товара выполнен.");

      await driver.sleep(2000);  
      

    } else {
      console.log("Меньше трех товаров в результате поиска.");
    }

  } catch (error) {
    console.error('Произошла ошибка во время выполнения теста:', error);
  } finally {
    await driver.quit();
  }
}

testCategoriesButton();
