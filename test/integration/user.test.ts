import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import makeApp from "../../src/app";
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from "mongoose";
import Container from "typedi";
import { UserRepository } from "../../src/app/repositories/user.repository";
import { faker } from '@faker-js/faker'
import { UserDto } from "../../src/app/dtos/user.dto";
import { isSortedBy } from "../utils";

chai.use(chaiHttp);

// Mock the database connection method since we're gonna use an inmemory db configured in this file. Likewise swagger setup.
const app = makeApp(() => { }, () => { });

// I chose to use an in-memory database to be able to test the app without any external dependencies in any environment.
let mongoServer: MongoMemoryServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});


describe('GET /api/users', () => {
  const userRepository = Container.get(UserRepository);
  const userCreateDtos = Array(5).fill(0).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }));
  before(async () => {
    await Promise.all(userCreateDtos.map(userRepository.create));
  });

  it('should return a list of users sorted ascending by creation date', done => {
    chai.request(app)
      .get('/api/users?created=asc')
      .end((err, res) => {
        expect(res).to.have.status(200);
        const users = res.body;
        expect(users).to.be.an('array');
        expect(users).to.have.length(userCreateDtos.length);
        const sorted = isSortedBy(users, (user: UserDto) => new Date(user.createdAt).getTime(), 'asc');
        expect(sorted).to.be.true;
        done();
      });
  });

  it('should return a list of users sorted descending by creation date', done => {
    chai.request(app)
      .get('/api/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        const users = res.body;
        expect(users).to.be.an('array');
        expect(users).to.have.length(userCreateDtos.length);
        const sorted = isSortedBy(users, (user: UserDto) => new Date(user.createdAt).getTime(), 'desc');
        expect(sorted).to.be.true;
        done();
      });
  });
});

describe('POST /api/users', () => {
  afterEach(async () => {
    await mongoose.connection.collection('users').deleteMany({});
  });

  it('should create a new user and return it', done => {
    const user = { name: faker.person.fullName(), email: faker.internet.email() };
    chai.request(app)
      .post('/api/users')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.include.keys(['id', 'name', 'email', 'createdAt']);
        expect(res.body.name).to.equal(user.name);
        expect(res.body.email).to.equal(user.email);
        done();
      });
  });

  it('should return an error if name filed is missing', done => {
    const incompleteUser = { email: faker.internet.email() };
    chai.request(app)
      .post('/api/users')
      .send(incompleteUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('context').that.is.an('array').with.length.greaterThan(0);
        expect(res.body.context[0]).to.have.property('property').that.includes('name');
        expect(res.body.context[0]).to.have.property('constraints').that.have.property('isNotEmpty');
        done();
      });
  });

  it('should return an error if name is shorter than 2 characters', done => {
    const incompleteUser = { email: faker.internet.email() };
    chai.request(app)
      .post('/api/users')
      .send(incompleteUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('context').that.is.an('array').with.lengthOf(1);
        expect(res.body.context[0]).to.have.property('property').that.includes('name');
        expect(res.body.context[0]).to.have.property('constraints').that.have.property('isLength');
        done();
      });
  });

  it('should return an error if email field is missing', done => {
    const incompleteUser = { name: faker.person.fullName() };
    chai.request(app)
      .post('/api/users')
      .send(incompleteUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('context').that.is.an('array').with.lengthOf(1);
        expect(res.body.context[0]).to.have.property('property').that.includes('email');
        expect(res.body.context[0]).to.have.property('constraints').that.have.property('isNotEmpty');
        done();
      });
  });

  it('should return an error if both fields are missing', done => {
    const incompleteUser = {};
    chai.request(app)
      .post('/api/users')
      .send(incompleteUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('context').that.is.an('array').with.length.greaterThan(0);
        const emailErrorExists = res.body.context.some((error: any) => error.property.includes('email') && error.constraints.isNotEmpty);
        const nameErrorExists = res.body.context.some((error: any) => error.property.includes('name') && error.constraints.isNotEmpty);
        expect(emailErrorExists).to.be.true;
        expect(nameErrorExists).to.be.true;
        done();
      });
  });

  it('should return an error if an invalid json is sent', done => {
    const invalidJson = '{name: "John Doe" email: "john@doe.com"}'; // comma is missing between properties
    chai.request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(invalidJson)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').that.includes('Body Parser failed to parse request');
        done();
      });
  });

  it('should return an error if attempted to create a user with duplicate email', done => {

    const duplicateEmail = faker.internet.email();
    const userWithDuplicateEmail = { name: faker.person.fullName(), email: duplicateEmail };
    chai.request(app)
      .post('/api/users')
      .send(userWithDuplicateEmail)
      .end((err, res) => {
        expect(res).to.have.status(200);
        chai.request(app)
          .post('/api/users')
          .send(userWithDuplicateEmail)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message').that.includes('Unique constraint failed');
            done();
          });
      });
  })
});
