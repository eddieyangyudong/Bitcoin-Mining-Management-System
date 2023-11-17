import supertest from 'supertest';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import app from './BitcoinMiningManagementServer'; // Replace with the actual path to your app

describe('Bitcoin Mining Management Server', () => {

  // Test for user signup
  describe('POST /signup', () => {
    it('should create a new user and return status 201', (done) => {
      supertest(app)
        .post('/signup')
        .send({ username: 'newuser', password: 'password123' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(201);
          expect(res.text).to.equal('User created successfully.');
          done();
        });
    });

    it('should not create a user that already exists and return status 409', (done) => {
      supertest(app)
        .post('/signup')
        .send({ username: 'newuser', password: 'password123' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(409);
          expect(res.text).to.equal('User already exists.');
          done();
        });
    });
  });

  // Test for user login
  describe('POST /login', () => {
    it('should log in an existing user and return a JWT token', (done) => {
      supertest(app)
        .post('/login')
        .send({ username: 'newuser', password: 'password123' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should reject invalid credentials with status 401', (done) => {
      supertest(app)
        .post('/login')
        .send({ username: 'newuser', password: 'wrongpassword' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('Invalid credentials.');
          done();
        });
    });
  });

  // Test for getting index data
  describe('GET /index', () => {
    it('should return index data with status 200', (done) => {
      supertest(app)
        .get('/index')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  // Test for getting mining hardware data
  describe('GET /mininghardware', () => {
    it('should return mining hardware data with status 200', (done) => {
      supertest(app)
        .get('/mininghardware')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe('POST /miningHardware', () => {
    it('should add new mining hardware and return status 200', (done) => {
      const newHardware = {
        name: 'New Miner',
        location: 'New Location',
        hashRate: '50 TH/S'
      };
  
      supertest(app)
        .post('/miningHardware')
        .send(newHardware)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal("New Miner");
          done();
        });
    });
  
    it('should not add hardware with a name that already exists and return status 400', (done) => {
      const duplicateHardware = {
        name: 'Antminer S1', // Assuming this name already exists
        location: 'Another Location',
        hashRate: '60 TH/S'
      };
  
      supertest(app)
        .post('/miningHardware')
        .send(duplicateHardware)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('Name Antminer S1 already exists.');
          done();
        });
    });
  });

  describe('PUT /miningHardware/:id', () => {
    it('should update existing hardware and return status 200', (done) => {
        const updatedHardware = {
          name: 'Updated Miner',
          location: 'Updated Location',
          hashRate: '55 TH/S'
        };
        const hardwareIdToUpdate = 1;
    
        supertest(app)
          .put(`/miningHardware/${hardwareIdToUpdate}`)
          .send(updatedHardware)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            done();
          });
      });
  
    it('should return status 400 if hardware does not exist', (done) => {
      const invalidId = 9999; // Non-existing ID
      const hardwareData = {
        name: 'Non-Existent Miner',
        location: 'Some Location',
        hashRate: '45 TH/S'
      };
  
      supertest(app)
        .put(`/miningHardware/${invalidId}`)
        .send(hardwareData)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          expect(res.text).to.equal(`id: ${invalidId} doesn't exist.`);
          done();
        });
    });
  });


  describe('DELETE /miningHardware/:id', () => {
    it('should delete hardware and return status 200', (done) => {
      const hardwareIdToDelete = 1; 
  
      supertest(app)
        .delete(`/miningHardware/${hardwareIdToDelete}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
    });
  
    it('should return status 400 if hardware does not exist', (done) => {
      const invalidId = 9999; // Non-existing ID
  
      supertest(app)
        .delete(`/miningHardware/${invalidId}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

});


