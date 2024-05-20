const assert = require("assert");
const { Builder, Browser, By } = require("selenium-webdriver");

let browserDriver = new Builder().forBrowser(Browser.EDGE).build();
let totalCount = 5;
let itemsLeft = 5;
startTodoTest();

const expectedCountMessage = (left, total) => `${left} of ${total} remaining`;
const fetchTextFromElement = async (element) => {
    const text = await element.getText();
    return text;
};

async function startTodoTest() {
  try {
    await browserDriver.get("https://lambdatest.github.io/sample-todo-app/");
    await browserDriver.manage().window().maximize();
    await browserDriver.sleep(1000);

    for (let index = 1; index <= totalCount; index++) {
      let statusElement = await browserDriver.findElement(
        By.xpath("//span[@class='ng-binding']")
      );
      let statusText = await fetchTextFromElement(statusElement);
      
      assert.equal(statusText, expectedCountMessage(itemsLeft, totalCount));
      let listItem = await browserDriver.findElement(
        By.xpath(`//input[@name='li${index}']/following-sibling::span`)
      );
      let listItemClass = await listItem.getAttribute("class");
      assert.equal(listItemClass, "done-false");
      await browserDriver.findElement(By.name("li" + index)).click();
      itemsLeft--;
      let updatedText = await fetchTextFromElement(statusElement);

      assert.equal(updatedText,  expectedCountMessage(itemsLeft, totalCount));
      await browserDriver.sleep(1000);
      listItemClass = await listItem.getAttribute("class");
      assert.equal(listItemClass, "done-true");
    }

    await browserDriver.findElement(By.id("sampletodotext")).sendKeys("Khakimova Dasha")
    await browserDriver.sleep(1000);
    await browserDriver.findElement(By.id("addbutton")).click();
    totalCount++;
    itemsLeft++;
    let newItem = await browserDriver.findElement(
      By.xpath("//input[@name='li6']/following-sibling::span")
    );
    let newItemText = await fetchTextFromElement(statusElement);
    let newItemClass = await newItem.getAttribute("class");
    let updatedStatusElement = await browserDriver.findElement(
      By.xpath("//span[@class='ng-binding']")
    );
    let updatedStatusText = await fetchTextFromElement(updatedStatusElement);
    
    assert.equal(updatedStatusText,  expectedCountMessage(itemsLeft, totalCount));
    assert.equal(newItemText, "Khakimova Dash");
    assert.equal(newItemClass, "done-false");
    await browserDriver.sleep(1000);
    await browserDriver.findElement(By.name("li6")).click();
    itemsLeft--;
    newItemClass = await newItem.getAttribute("class");
    assert.equal(newItemClass, "done-true");
    updatedStatusText = await fetchTextFromElement(updatedStatusElement);

    assert.equal(updatedStatusText, expectedCountMessage(itemsLeft, totalCount));
    await browserDriver.sleep(3000);
  } catch (error) {
    browserDriver.takeScreenshot().then(function (image) {
      require("fs").writeFileSync("screen_error.png", image, "base64");
    });
    
    console.error(error);
  } finally {
    await browserDriver.quit();
  }
}
