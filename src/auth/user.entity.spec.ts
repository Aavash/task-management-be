import { User } from './user.entity';

const bcrypt = require('bcrypt');

describe('User Entity', () => {

  let user:User;
  beforeEach(() => {
    user = new User;
    user.password = 'testPassword';
    user.salt = 'testSalt';
    bcrypt.hash = jest.fn();
  });

  describe('validatePassword', () => {
    it('returns true if valid password', async () => {
      bcrypt.hash.mockReturnValue('testPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('123456');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt');
      expect(result).toBeTruthy()
    });

    it('returns false if invalid password', async () => {
      bcrypt.hash.mockReturnValue('wrongTestPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('wrongTestPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('wrongTestPassword', 'testSalt');
      expect(result).toBeFalsy()
    });
  })
});