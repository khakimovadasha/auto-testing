const WebPage = require("./basepage");
const { By } = require("selenium-webdriver");


const URL = "https://lambdatest.github.io/sample-todo-app/";

class ToDoPage extends WebPage {
  constructor(remaining, total) {
    super();
    this.remaining = remaining;
    this.total = total;
  }

  async loadPage() {
    await this.navigate(URL);
  }

  async verifyRemainingTasks() {
    const expectedText = `${this.remaining} of ${this.total} remaining`;
    const actualText = await this.retrieveText(By.xpath('//span[@class="ng-binding"]'));
    return actualText === expectedText;
  }

  async fetchTask(i) {
    return await driver.findElement(By.xpath(`//input[@name='li${i}']/following-sibling::span`));
  }

  async checkTaskInactive(task) {
    return (await task.getAttribute("class")) === "done-false";
  }

  async activateTask(i) {
    let input = await driver.findElement(By.name("li" + i));
    await input.click();
    this.remaining--;
  }

  async checkTaskActive(task) {
    return (await task.getAttribute("class")) === "done-true";
  }

  async addTask(text) {
    await this.typeText(By.id("sampletodotext"), text);
    await this.select(By.id("addbutton"));
    this.remaining++;
    this.total++;
  }
}

module.exports = ToDoPage;
