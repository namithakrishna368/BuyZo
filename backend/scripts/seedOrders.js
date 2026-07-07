import 'dotenv/config';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found to associate orders with.');
      process.exit(1);
    }

    const products = await Product.find().limit(5);
    if (products.length === 0) {
      console.log('No products found.');
      process.exit(1);
    }

    await Order.deleteMany({});
    console.log('Deleted existing orders.');

    const mockOrders = [];
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    
    // Generate 20 random orders over the last 30 days
    for (let i = 0; i < 20; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 3) + 1;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const price = product.price;
      
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));

      mockOrders.push({
        user: adminUser._id,
        orderItems: [
          {
            name: product.name,
            qty,
            image: product.images[0] || '',
            price,
            product: product._id,
          },
        ],
        shippingAddress: {
          address: '123 Fake Street',
          city: 'Mumbai',
          postalCode: '400001',
          country: 'India',
        },
        paymentMethod: 'Card',
        itemsPrice: price * qty,
        taxPrice: (price * qty) * 0.18,
        shippingPrice: 0,
        totalPrice: (price * qty) * 1.18,
        isPaid: status !== 'Pending',
        paidAt: status !== 'Pending' ? orderDate : null,
        isDelivered: status === 'Delivered',
        deliveredAt: status === 'Delivered' ? orderDate : null,
        status,
        createdAt: orderDate,
        updatedAt: orderDate,
      });
    }

    await Order.insertMany(mockOrders);
    console.log(`Successfully seeded ${mockOrders.length} mock orders.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedOrders();
