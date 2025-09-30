import { connectToMongoDB, getCollection } from '../mongodb-client';
import { User, CreateUserData, UpdateUserData } from '../models/user';
import { Product, CreateProductData, UpdateProductData } from '../models/product';
import { Order, CreateOrderData, UpdateOrderData } from '../models/order';
import { Customer, CreateCustomerData, UpdateCustomerData } from '../models/customer';

// User Service
export class UserService {
  static async createUser(userData: CreateUserData): Promise<User> {
    const collection = await getCollection<User>('users');
    const user: User = {
      ...userData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  static async getUserById(id: string): Promise<User | null> {
    const collection = await getCollection<User>('users');
    return await collection.findOne({ _id: id as any });
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const collection = await getCollection<User>('users');
    return await collection.findOne({ email });
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    const collection = await getCollection<User>('users');
    return await collection.findOne({ username });
  }

  static async updateUser(id: string, userData: UpdateUserData): Promise<User | null> {
    const collection = await getCollection<User>('users');
    const updateData = { ...userData, updatedAt: new Date() };
    await collection.updateOne({ _id: id as any }, { $set: updateData });
    return await this.getUserById(id);
  }

  static async getAllUsers(): Promise<User[]> {
    const collection = await getCollection<User>('users');
    return await collection.find({}).toArray();
  }

  static async deleteUser(id: string): Promise<boolean> {
    const collection = await getCollection<User>('users');
    const result = await collection.deleteOne({ _id: id as any });
    return result.deletedCount > 0;
  }
}

// Product Service
export class ProductService {
  static async createProduct(productData: CreateProductData): Promise<Product> {
    const collection = await getCollection<Product>('products');
    const product: Product = {
      ...productData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await collection.insertOne(product);
    return { ...product, _id: result.insertedId };
  }

  static async getProductById(id: string): Promise<Product | null> {
    const collection = await getCollection<Product>('products');
    return await collection.findOne({ _id: id as any });
  }

  static async getProductBySku(sku: string): Promise<Product | null> {
    const collection = await getCollection<Product>('products');
    return await collection.findOne({ sku });
  }

  static async updateProduct(id: string, productData: UpdateProductData): Promise<Product | null> {
    const collection = await getCollection<Product>('products');
    const updateData = { ...productData, updatedAt: new Date() };
    await collection.updateOne({ _id: id as any }, { $set: updateData });
    return await this.getProductById(id);
  }

  static async getAllProducts(): Promise<Product[]> {
    const collection = await getCollection<Product>('products');
    return await collection.find({}).toArray();
  }

  static async getActiveProducts(): Promise<Product[]> {
    const collection = await getCollection<Product>('products');
    return await collection.find({ isActive: true }).toArray();
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const collection = await getCollection<Product>('products');
    const result = await collection.deleteOne({ _id: id as any });
    return result.deletedCount > 0;
  }
}

// Order Service
export class OrderService {
  static async createOrder(orderData: CreateOrderData): Promise<Order> {
    const collection = await getCollection<Order>('orders');
    const orderNumber = `ORD-${Date.now()}`;
    const order: Order = {
      ...orderData,
      orderNumber,
      status: 'pending',
      orderDate: new Date(),
      totalAmount: 0, // Will be calculated from items
      paidAmount: 0,
      balance: 0,
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await collection.insertOne(order);
    return { ...order, _id: result.insertedId };
  }

  static async getOrderById(id: string): Promise<Order | null> {
    const collection = await getCollection<Order>('orders');
    return await collection.findOne({ _id: id as any });
  }

  static async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const collection = await getCollection<Order>('orders');
    return await collection.findOne({ orderNumber });
  }

  static async updateOrder(id: string, orderData: UpdateOrderData): Promise<Order | null> {
    const collection = await getCollection<Order>('orders');
    const updateData = { ...orderData, updatedAt: new Date() };
    await collection.updateOne({ _id: id as any }, { $set: updateData });
    return await this.getOrderById(id);
  }

  static async getAllOrders(): Promise<Order[]> {
    const collection = await getCollection<Order>('orders');
    return await collection.find({}).toArray();
  }

  static async getOrdersByStatus(status: string): Promise<Order[]> {
    const collection = await getCollection<Order>('orders');
    return await collection.find({ status }).toArray();
  }

  static async deleteOrder(id: string): Promise<boolean> {
    const collection = await getCollection<Order>('orders');
    const result = await collection.deleteOne({ _id: id as any });
    return result.deletedCount > 0;
  }
}

// Customer Service
export class CustomerService {
  static async createCustomer(customerData: CreateCustomerData): Promise<Customer> {
    const collection = await getCollection<Customer>('customers');
    const customer: Customer = {
      ...customerData,
      status: 'active',
      currentBalance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalOrders: 0,
      totalSpent: 0,
    };
    const result = await collection.insertOne(customer);
    return { ...customer, _id: result.insertedId };
  }

  static async getCustomerById(id: string): Promise<Customer | null> {
    const collection = await getCollection<Customer>('customers');
    return await collection.findOne({ _id: id as any });
  }

  static async getCustomerByEmail(email: string): Promise<Customer | null> {
    const collection = await getCollection<Customer>('customers');
    return await collection.findOne({ email });
  }

  static async updateCustomer(id: string, customerData: UpdateCustomerData): Promise<Customer | null> {
    const collection = await getCollection<Customer>('customers');
    const updateData = { ...customerData, updatedAt: new Date() };
    await collection.updateOne({ _id: id as any }, { $set: updateData });
    return await this.getCustomerById(id);
  }

  static async getAllCustomers(): Promise<Customer[]> {
    const collection = await getCollection<Customer>('customers');
    return await collection.find({}).toArray();
  }

  static async getActiveCustomers(): Promise<Customer[]> {
    const collection = await getCollection<Customer>('customers');
    return await collection.find({ status: 'active' }).toArray();
  }

  static async deleteCustomer(id: string): Promise<boolean> {
    const collection = await getCollection<Customer>('customers');
    const result = await collection.deleteOne({ _id: id as any });
    return result.deletedCount > 0;
  }
}

