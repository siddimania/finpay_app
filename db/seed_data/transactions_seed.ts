// run this command in terminal npx tsx db/seed_data/transactions_seed.ts    
import { transactions } from "@/db/schema/schema";
import { db, client } from "@/db/index";

async function transactionsSeed() {
  try {
    console.log("Starting database seeding.........");
    await db.insert(transactions).values([
      {
        transaction_id: "TXN-2083544029331", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-1783542863159", 
        amount: "500.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-01",
      },
      {
        transaction_id: "TXN-2083544029332", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-1783542873189", 
        amount: "700.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-02",
      },
      {
        transaction_id: "TXN-2083544029333", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-1783542873190", 
        amount: "600.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-02",
      },
      {
        transaction_id: "TXN-2083544029334", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-1783542873189", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-03",
      },
      {
        transaction_id: "TXN-2083544029335", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-1783542873191", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-04",
      },
      {
        transaction_id: "TXN-2083544029336", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-1783542873192", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-04",
      },
      {
        transaction_id: "TXN-2083544029337", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-1783542873193", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-07",
      },
      {
        transaction_id: "TXN-2083544029338", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-1783542873194", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-07",
      },
      {
        transaction_id: "TXN-2083544029339", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-1783542873195", 
        amount: "800.00",
        currency: "INR",  
        status: "SUCCESS",  
        payment_method: "UPI",
        payment_date: "2026-07-08",
      },
      {
        transaction_id: "TXN-2083544029340", 
        user_id: "8db4e69c-8727-4e41-a3b2-b7c7f23d40c3", 
        merchant_id: "MER-1783542873196", 
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
