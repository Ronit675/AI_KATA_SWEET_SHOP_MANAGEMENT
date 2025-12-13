import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import User from '../models/User';
import Sweet from '../models/Sweet';
import jwt from 'jsonwebtoken';

describe('Sweets API', () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let adminId: string;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop-test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Sweet.deleteMany({});
    
    // Create regular user
    const user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });
    userId = user._id.toString();
    userToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret');

    // Create admin user
    const admin = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });
    adminId = admin._id.toString();
    adminToken = jwt.sign({ userId: adminId }, process.env.JWT_SECRET || 'fallback-secret');
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet (admin only)', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Gulab Jamun',
          category: 'Indian',
          price: 50,
          quantity: 100,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('sweet');
      expect(response.body.sweet.name).toBe('Gulab Jamun');
      expect(response.body.sweet.category).toBe('Indian');
      expect(response.body.sweet.price).toBe(50);
      expect(response.body.sweet.quantity).toBe(100);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Gulab Jamun',
          category: 'Indian',
          price: 50,
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Gulab Jamun',
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 if price is negative', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Gulab Jamun',
          category: 'Indian',
          price: -10,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Gulab Jamun', category: 'Indian', price: 50, quantity: 100 },
        { name: 'Rasgulla', category: 'Indian', price: 40, quantity: 80 },
      ]);
    });

    it('should get all sweets (authenticated)', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sweets');
      expect(response.body.sweets.length).toBe(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/sweets');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Gulab Jamun', category: 'Indian', price: 50, quantity: 100 },
        { name: 'Rasgulla', category: 'Indian', price: 40, quantity: 80 },
        { name: 'Chocolate Cake', category: 'Western', price: 200, quantity: 50 },
      ]);
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=gulab')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.sweets.length).toBe(1);
      expect(response.body.sweets[0].name).toBe('Gulab Jamun');
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Indian')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.sweets.length).toBe(2);
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=45&maxPrice=55')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.sweets.length).toBe(1);
      expect(response.body.sweets[0].name).toBe('Gulab Jamun');
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100,
      });
      sweetId = sweet._id.toString();
    });

    it('should update a sweet (admin only)', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 60,
          quantity: 150,
        });

      expect(response.status).toBe(200);
      expect(response.body.sweet.price).toBe(60);
      expect(response.body.sweet.quantity).toBe(150);
    });

    it('should return 404 if sweet not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 60,
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100,
      });
      sweetId = sweet._id.toString();
    });

    it('should delete a sweet (admin only)', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      
      const deletedSweet = await Sweet.findById(sweetId);
      expect(deletedSweet).toBeNull();
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100,
      });
      sweetId = sweet._id.toString();
    });

    it('should purchase a sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 5,
        });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(95);
    });

    it('should purchase 1 sweet by default if quantity not provided', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(99);
    });

    it('should return 400 if insufficient stock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 200,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Insufficient stock');
    });

    it('should return 404 if sweet not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .post(`/api/sweets/${fakeId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 100,
      });
      sweetId = sweet._id.toString();
    });

    it('should restock a sweet (admin only)', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: 50,
        });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(150);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          quantity: 50,
        });

      expect(response.status).toBe(403);
    });

    it('should return 400 if quantity is missing', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
    });
  });
});

