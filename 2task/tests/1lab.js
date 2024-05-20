const ToDoPage = require("../pages/1labpage");
const Mocha = require('mocha'); 
const { describe, before, after, it } = Mocha;
const { assert } = require('chai')

const handleErrors = (action, handler) => {
    return async () => {
      try {
        await action();
      } catch (error) {
        console.error(error);
        handler();
      }
    };
  };

describe("ToDo List Test Suite", function () {
  const todoPage = new ToDoPage(5,5);

  before(async () => {
    await todoPage.loadPage();
  });

  after(async () => {
    await todoPage.shutdownBrowser();
  });

  it("Validates remaining tasks", handleErrors(async () => {
    assert.isTrue(
      await todoPage.verifyRemainingTasks(),
      "Remaining tasks mismatch expected value"
    );
  }, async () => await todoPage.captureScreenshot('error')));

  it("Ensures the first task is incomplete", handleErrors(async () => {
    const firstTask = await todoPage.fetchTask(1);
    assert.isTrue(
      await todoPage.checkTaskInactive(firstTask),
      "First task should be inactive initially"
    );
  }, async () => await todoPage.captureScreenshot('error')));

  it("Activates the first task and checks the update", handleErrors(async () => {
    const firstTask = await todoPage.fetchTask(1);
    await todoPage.activateTask(1);
    assert.isTrue(
      await todoPage.checkTaskActive(firstTask),
      "First task should be active after activation"
    );
    assert.isTrue(
      await todoPage.verifyRemainingTasks(),
      "Remaining tasks did not update as expected"
    );
  }, async () => await todoPage.captureScreenshot('error')));

  it("Processes other tasks and checks state transitions", handleErrors(async () => {
    for (let i = 2; i <= todoPage.total; i++) {
        const task = await todoPage.fetchTask(i);
        assert.isFalse(
          await todoPage.checkTaskActive(task),
          `Task ${i} should be inactive initially`
        );
        await todoPage.activateTask(i);
        assert.isTrue(
          await todoPage.checkTaskActive(task),
          `Task ${i} did not activate properly`
        );
        assert.isTrue(
          await todoPage.verifyRemainingTasks(),
          "Remaining tasks did not update as expected"
        );
      }
  }, async () => await todoPage.captureScreenshot('error')));

  it("Adds a new task", handleErrors(async () => {
    await todoPage.addTask("Khakimova Dasha 221-321");
    const newTask = await todoPage.fetchTask(todoPage.total);
    assert.isFalse(
      await todoPage.checkTaskActive(newTask),
      "New task should be inactive initially"
    );
    assert.isTrue(
      await todoPage.verifyRemainingTasks(),
      "Remaining tasks did not update correctly after adding a task"
    );
  }, async () => await todoPage.captureScreenshot('error')));

  it("Activates the newly added task", handleErrors(async () => {
    await todoPage.activateTask(todoPage.total);
    assert.isTrue(
      await todoPage.verifyRemainingTasks(),
      "Remaining tasks did not update as expected after activation"
    );
  }, async () => await todoPage.captureScreenshot('error')));
});
