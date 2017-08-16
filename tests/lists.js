/* eslint-env mocha */
// These are Chimp globals */
/* globals browser assert */

const countLeagues = () => {
  browser.waitForExist('.league-player');
  const elements = browser.elements('.league-player');
  return elements.value.length;
};

describe('list ui', () => {
  beforeEach(() => {
    browser.url('http://localhost:3000');
  });

  it('can create a list @watch', () => {
    const initialCount = countLists();

    browser.click('.link-league-new');

    assert.equal(countLists(), initialCount + 1);
  });
});
