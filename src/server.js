import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/db.js';
import routes from './routes/index.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from "./routes/order.routes.js"
import paymentRoutes from './routes/payment.routes.js'

dotenv.config();
console.log("MONGO_URI from .env =>", process.env.MONGO_URI);
const app = express();

app.use(cors());
app.use(express.json());

// Routes 
app.use('/api', routes)
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes)

app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
