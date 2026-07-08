// run this command in terminal npx tsx db/seed_data/transactions_seed.ts    
import { transactions } from "@/db/schema/schema";
import { db, client } from "@/db/index";

async function transactionsSeed() {
  try {
    console.log("Starting database seeding.........");
    await db.insert(transactions).values([
      {
        transaction_id: "TXN-10021", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-920", 
        amount: "500.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-01",
      },
      {
        transaction_id: "TXN-10022", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-920", 
        amount: "700.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-02",
      },
      {
        transaction_id: "TXN-10023", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-920", 
        amount: "600.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-02",
      },
      {
        transaction_id: "TXN-10024", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-920", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-03",
      },
      {
        transaction_id: "TXN-10025", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-920", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-04",
      },
      {
        transaction_id: "TXN-10026", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-920", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-04",
      },
      {
        transaction_id: "TXN-10027", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-920", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-07",
      },
      {
        transaction_id: "TXN-10028", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-920", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-07",
      },
      {
        transaction_id: "TXN-10029", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-920", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-08",
      },
      {
        transaction_id: "TXN-10030", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-920", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-09",
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

transactionsSeed();
