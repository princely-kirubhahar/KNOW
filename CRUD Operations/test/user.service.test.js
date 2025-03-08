// CERATED THIS FILE USING AI - Princely K

// test/services/users.service.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

// Mock dependencies
const dbMock = {
  query: sinon.stub(),
  run: sinon.stub()
};

const jwtAuthMock = {
  generateToken: sinon.stub().returns('mock-token')
};

const configMock = {
  LIST_PER_PAGE: 10
};

// Import the service with mocked dependencies
const userService = proxyquire('../../services/users.service', {
  '../services/database/sqlLiteDb': dbMock,
  '../constants': configMock,
  '../middleware/jwtAuthentication': jwtAuthMock
});

describe('Users Service', () => {
  beforeEach(() => {
    // Reset stubs before each test
    sinon.reset();
  });

  describe('getUsers', () => {
    it('should get users with the correct pagination', () => {
      // Arrange
      const mockUsers = [{ id: 1, userName: 'user1' }];
      dbMock.query.returns(mockUsers);
      
      // Act
      const result = userService.getUsers(2);
      
      // Assert
      expect(dbMock.query.calledOnce).to.be.true;
      expect(dbMock.query.firstCall.args[1]).to.deep.equal([10, 10]); // page 2, offset = 10
      expect(result.data).to.equal(mockUsers);
      expect(result.meta.page).to.equal(2);
    });

    it('should use default page if not provided', () => {
      // Arrange
      dbMock.query.returns([]);
      
      // Act
      const result = userService.getUsers();
      
      // Assert
      expect(dbMock.query.firstCall.args[1]).to.deep.equal([0, 10]); // page 1, offset = 0
      expect(result.meta.page).to.equal(1);
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', () => {
      // Arrange
      const mockUser = {
        userName: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        middleName: 'Middle',
        lastName: 'User'
      };
      const mockDbResponse = { lastID: 1 };
      dbMock.run.returns(mockDbResponse);
      
      // Act
      const result = userService.createUser(mockUser);
      
      // Assert
      expect(dbMock.run.calledOnce).to.be.true;
      expect(dbMock.run.firstCall.args[1]).to.deep.equal([
        'testuser', 'test@example.com', 'Test', 'Middle', 'User'
      ]);
      expect(result.data).to.equal(mockDbResponse);
      expect(result.meta).to.deep.equal(mockUser);
    });

    it('should handle database errors', () => {
      // Arrange
      const mockUser = { userName: 'testuser', email: 'test@example.com' };
      const mockError = new Error('Database error');
      dbMock.run.throws(mockError);
      
      // Act & Assert
      expect(() => userService.createUser(mockUser)).to.throw(mockError);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', () => {
      // Arrange
      const userId = 1;
      const mockDbResponse = { changes: 1 };
      dbMock.run.returns(mockDbResponse);
      
      // Act
      const result = userService.deleteUser(userId);
      
      // Assert
      expect(dbMock.run.calledOnce).to.be.true;
      expect(dbMock.run.firstCall.args[1]).to.deep.equal([userId]);
      expect(result.data).to.equal(mockDbResponse);
      expect(result.meta.id).to.equal(userId);
    });
  });

  describe('updateUser', () => {
    it('should update a user by id', () => {
      // Arrange
      const userId = 1;
      const mockUser = {
        userName: 'updateduser',
        email: 'updated@example.com',
        firstName: 'Updated',
        middleName: 'Middle',
        lastName: 'User'
      };
      const mockDbResponse = { changes: 1 };
      dbMock.run.returns(mockDbResponse);
      
      // Act
      const result = userService.updateUser(mockUser, userId);
      
      // Assert
      expect(dbMock.run.calledOnce).to.be.true;
      expect(dbMock.run.firstCall.args[1]).to.deep.equal([
        'updateduser', 'updated@example.com', 'Updated', 'Middle', 'User', userId
      ]);
      expect(result.data).to.equal(mockDbResponse);
      expect(result.meta.id).to.equal(userId);
      expect(result.meta.userName).to.equal(mockUser.userName);
    });
  });

  describe('login', () => {
    it('should return a token when user exists', () => {
      // Arrange
      const email = 'test@example.com';
      const mockUser = [{ id: 1, firstName: 'Test', lastName: 'User' }];
      dbMock.query.returns(mockUser);
      
      // Act
      const result = userService.login({ email });
      
      // Assert
      expect(dbMock.query.calledOnce).to.be.true;
      expect(dbMock.query.firstCall.args[1]).to.deep.equal([email]);
      expect(jwtAuthMock.generateToken.calledWith(mockUser[0])).to.be.true;
      expect(result).to.equal('mock-token');
    });

    it('should throw an error when user does not exist', () => {
      // Arrange
      const email = 'nonexistent@example.com';
      dbMock.query.returns([]);
      
      // Act & Assert
      try {
        userService.login({ email });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Unauthorized: User not found');
        expect(error.status).to.equal(401);
      }
    });
  });
});
