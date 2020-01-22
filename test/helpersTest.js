const { assert } = require('chai');
const getUserByEmail = require('../helpers').getUserByEmail;

const testUsers = {
  "1": {
    id: '1',
    email: 'test@email.com',
    password: 'abc'
  },
  "2": {
    id: '2',
    email: 'test2@email.com',
    password: 'def'
  },
  "3": {
    id: '3',
    email: 'test3@email.com',
    password: 'ghi'
  }
};

describe('getUserByEmail', () => {
  it("should return a user with valid email", () => {
    const user1 = getUserByEmail('test@email.com', testUsers);
    const user2 = getUserByEmail('test3@email.com', testUsers);
    assert.equal(user1, "1");
    assert.equal(user2, "3");
  });
  it('should return undefined for nonexistant email', () => {
    const nonUser = getUserByEmail('a@b', testUsers);
    assert.isUndefined(nonUser);
  });
});