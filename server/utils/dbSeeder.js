const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Food = require("../models/Food");
const User = require("../models/User");

const foodItems = [
  {
    name: "Burger",
    price: 60,
    category: "Fast Food",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    availabilityStatus: "available",
    isAvailable: true,
  },
  {
    name: "Pizza",
    price: 120,
    category: "Fast Food",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    availabilityStatus: "available",
    isAvailable: true,
  },
  {
    name: "Samosa",
    price: 20,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
    availabilityStatus: "available",
    isAvailable: true,
  },
  {
    name: "Sandwich",
    price: 50,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1528736235302-52922df5c122",
    availabilityStatus: "available",
    isAvailable: true,
  },
  {
    name: "Tea",
    price: 15,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
    availabilityStatus: "available",
    isAvailable: true,
  },
  {
    name: "Coffee",
    price: 30,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    availabilityStatus: "available",
    isAvailable: true,
  },
  {
    name: "Cold Drink",
    price: 40,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a",
    availabilityStatus: "available",
    isAvailable: true,
  },
  {
    name: "Noodles",
    price: 70,
    category: "Fast Food",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841",
    availabilityStatus: "available",
    isAvailable: true,
  },
];

const seedDatabaseIfNeeded = async () => {
  try {
    // 1. Seed food items if none exist
    const foodCount = await Food.countDocuments();
    if (foodCount === 0) {
      console.log("No food items found in the database. Seeding default foods...");
      await Food.insertMany(foodItems);
      console.log("Default food items seeded successfully.");
    } else {
      console.log(`Database already has ${foodCount} food items.`);
    }

    // 2. Create admin if not exists
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log(`Creating admin account with email: ${adminEmail}`);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin account created successfully.");
    } else {
      console.log("Admin account already exists.");
    }
  } catch (error) {
    console.error("Self-seeding database failed:", error);
  }
};

module.exports = { seedDatabaseIfNeeded };