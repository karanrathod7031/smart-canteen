const mongoose = require("mongoose");
require("dotenv").config();

const Food = require("./models/Food");

const foodItems = [
  {
    name: "Burger",
    price: 60,
    category: "Fast Food",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    name: "Pizza",
    price: 120,
    category: "Fast Food",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
  },
  {
    name: "Samosa",
    price: 20,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
  },
  {
    name: "Sandwich",
    price: 50,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1528736235302-52922df5c122",
  },
  {
    name: "Tea",
    price: 15,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
  },
  {
    name: "Coffee",
    price: 30,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
  },
  {
    name: "Cold Drink",
    price: 40,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a",
  },
  {
    name: "Noodles",
    price: 70,
    category: "Fast Food",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841",
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    await Food.deleteMany();
    console.log("Old food data deleted");

    await Food.insertMany(foodItems);
    console.log("New food data inserted");

    mongoose.connection.close();
    console.log("Seeding complete");
  } catch (error) {
    console.log("Seeding error:", error);
    mongoose.connection.close();
  }
};

seedData();