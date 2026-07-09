// run this command in terminal npx tsx db/seed_data/transactions_seed.ts    
import { merchants } from "@/db/schema/schema";
import { db, client } from "@/db/index";

async function merchantsSeed() {
  try {
    console.log("Starting database seeding.........");
    await db.insert(merchants).values([
      {
        merchant_id: "MER-1783542863159", 
        merchant_name: "Dominos Pizza", 
        merchant_email: "dominos@gmail.com",
        merchant_phone: "990-345-7683",  
        merchant_address: "Delhi/NCr India",  
      },
      {
        merchant_id: "MER-1783542873189",
        merchant_name: "Starbucks",
        merchant_email: "starbucks@gmail.com",
        merchant_phone: "990-345-7684",
        merchant_address: "Mumbai India",
      },
      {
        merchant_id: "MER-1783542873190",
        merchant_name: "McDonald's",
        merchant_email: "mcdonalds@gmail.com",
        merchant_phone: "990-345-7685",
        merchant_address: "Bengaluru India",
      },
      {
        merchant_id: "MER-1783542873191",
        merchant_name: "KFC",
        merchant_email: "kfc@gmail.com",
        merchant_phone: "990-345-7686",
        merchant_address: "Hyderabad India",
      },
      {
        merchant_id: "MER-1783542873192",
        merchant_name: "Cafe Coffee Day",
        merchant_email: "ccd@gmail.com",
        merchant_phone: "990-345-7687",
        merchant_address: "Pune India",
      },
      {
        merchant_id: "MER-1783542873193",
        merchant_name: "Amazon",
        merchant_email: "amazon@gmail.com",
        merchant_phone: "990-345-7688",
        merchant_address: "Chennai India",
      },
      {
        merchant_id: "MER-1783542873194",
        merchant_name: "Flipkart",
        merchant_email: "flipkart@gmail.com",
        merchant_phone: "990-345-7689",
        merchant_address: "Kolkata India",
      },
      {
        merchant_id: "MER-1783542873195",
        merchant_name: "Zomato",
        merchant_email: "zomato@gmail.com",
        merchant_phone: "990-345-7690",
        merchant_address: "Jaipur India",
      },
      {
        merchant_id: "MER-1783542873196",
        merchant_name: "Swiggy",
        merchant_email: "swiggy@gmail.com",
        merchant_phone: "990-345-7691",
        merchant_address: "Ahmedabad India",
      },
      {
        merchant_id: "MER-1783542873197",
        merchant_name: "Big Bazaar",
        merchant_email: "bigbazaar@gmail.com",
        merchant_phone: "990-345-7692",
        merchant_address: "Lucknow India",
      },
    ]);
    console.log("Database seeded successfully!");
    if (typeof client.end === "function") {
      await client.end();
    }
  } catch (error) {
    console.log("Error seeding database:\n", error);
    if (typeof client.end === "function") {
      await client.end();
    }
    process.exit(1);
  }
}

merchantsSeed();
