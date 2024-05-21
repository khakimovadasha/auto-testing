const TimetablePage = require('../pages/2labpage');
const mocha = require('mocha');

const chai = require('chai');
const { assert } = require('chai');



mocha.describe('Timetable Navigation Test', async () => {
    const tp = new TimetablePage();

    before(async () => {
        await tp.openHomepage();
    });

    after(async () => {
        await tp.closeWebBrowser();
    });

    it('opens schedule page', async () => {
        await tp.navigateToSchedule();
    });

    it('opens schedule view page', async () => {
        await tp.accessScheduleLink();
    });

    it('fills in group', async () => {
        await tp.enterGroupNumber();
    });

    it('checks if needed group is there', async () => {
        assert.equal(await tp.verifyGroupPresence(), true);
    });

    it('goes to group schedule', async () => {
        await tp.selectGroupSchedule();
    });

    it('checks if current day is highlighted', async () => {
        assert.equal(await tp.checkCurrentDayHighlighted(), true);
    })
});
