import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Setting from "../models/Setting.js";

dotenv.config();

const demoProducts = [
  {
    name: "Saffron Milk Cake",
    description: "Premium saffron-infused sponge layered with light cream and pistachio.",
    category: "Cakes",
    price: 899,
    stock: 20,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Belgian Chocolate Truffle",
    description: "Rich dark chocolate truffle cake with glossy ganache finish.",
    category: "Cakes",
    price: 1049,
    stock: 16,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Mango Velvet Cake",
    description: "Seasonal mango mousse cake with tropical fruit topping.",
    category: "Cakes",
    price: 949,
    stock: 15,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Croissant Butter Classic",
    description: "Flaky laminated pastry crafted with cultured butter.",
    category: "Pastries",
    price: 149,
    stock: 40,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Almond Cinnamon Roll",
    description: "Soft cinnamon roll finished with almond glaze.",
    category: "Pastries",
    price: 189,
    stock: 32,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Paneer Puff Masala",
    description: "Golden puff pastry filled with spiced paneer and herbs.",
    category: "Savories",
    price: 129,
    stock: 45,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Garlic Herb Focaccia",
    description: "Stone-baked focaccia with roasted garlic and rosemary.",
    category: "Breads",
    price: 249,
    stock: 22,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Multigrain Loaf",
    description: "Nutrient-rich multigrain bread, naturally fermented.",
    category: "Breads",
    price: 219,
    stock: 28,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Orange Zest Cookies",
    description: "Buttery cookies with natural orange zest and vanilla.",
    category: "Cookies",
    price: 199,
    stock: 60,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Choco Chunk Cookies",
    description: "Crisp-edged cookies loaded with premium chocolate chunks.",
    category: "Cookies",
    price: 229,
    stock: 52,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Hazelnut Brownie Box",
    description: "Fudgy brownies with toasted hazelnuts in a gift-ready box.",
    category: "Desserts",
    price: 349,
    stock: 30,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Vanilla Celebration Cupcakes",
    description: "Soft vanilla cupcakes with whipped orange-cream frosting.",
    category: "Cupcakes",
    price: 299,
    stock: 24,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1200&q=80"
  }
];

const seed = async () => {
  try {
    await connectDB();

    const shouldDestroy = process.argv.includes("--destroy");
    if (shouldDestroy) {
      await Promise.all([
        Order.deleteMany({}),
        Product.deleteMany({}),
        User.deleteMany({}),
        Setting.deleteMany({})
      ]);
      // eslint-disable-next-line no-console
      console.log("Demo data destroyed.");
      process.exit(0);
    }

    await Promise.all([
      Order.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({}),
      Setting.deleteMany({})
    ]);

    const [admin, customerA, customerB] = await User.create([
      {
        name: "Mama Admin",
        email: "admin@mama-bakery.com",
        password: "Admin@123",
        role: "admin"
      },
      {
        name: "Aarav Sharma",
        email: "aarav@example.com",
        password: "Customer@123",
        role: "customer"
      },
      {
        name: "Meera Kapoor",
        email: "meera@example.com",
        password: "Customer@123",
        role: "customer"
      }
    ]);

    const products = await Product.insertMany(demoProducts);

    await Setting.create({
      singletonKey: "global",
      upi: {
        enabled: true,
        upiId: "mama.bakery@okhdfcbank",
        phone: "+91 9876543210",
        instructions:
          "Scan the QR, complete payment, then click 'I have completed payment'. Orders are verified within 10-20 minutes.",
        qrImage:
          "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=1200&q=80"
      }
    });

    await Order.insertMany([
      {
        user: customerA._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            image: products[0].image,
            price: products[0].price,
            quantity: 1
          },
          {
            product: products[8]._id,
            name: products[8].name,
            image: products[8].image,
            price: products[8].price,
            quantity: 2
          }
        ],
        shippingAddress: {
          fullName: "Aarav Sharma",
          phone: "9000000001",
          line1: "12 Lake View Road",
          line2: "Near Sunrise Mall",
          city: "Panaji",
          state: "Goa",
          postalCode: "403001",
          notes: "Call before delivery."
        },
        subtotal: products[0].price + products[8].price * 2,
        deliveryFee: 49,
        total: products[0].price + products[8].price * 2 + 49,
        paymentMethod: "UPI",
        paymentStatus: "Pending Verification",
        paymentMeta: {
          transactionNote: "Paid via Google Pay at 10:21 AM"
        },
        orderStatus: "Pending"
      },
      {
        user: customerB._id,
        items: [
          {
            product: products[1]._id,
            name: products[1].name,
            image: products[1].image,
            price: products[1].price,
            quantity: 1
          }
        ],
        shippingAddress: {
          fullName: "Meera Kapoor",
          phone: "9000000002",
          line1: "45 Green Park",
          line2: "Apt 8B",
          city: "Margao",
          state: "Goa",
          postalCode: "403601",
          notes: ""
        },
        subtotal: products[1].price,
        deliveryFee: 49,
        total: products[1].price + 49,
        paymentMethod: "COD",
        paymentStatus: "Pending",
        orderStatus: "Confirmed"
      }
    ]);

    // eslint-disable-next-line no-console
    console.log("Seed completed.");
    // eslint-disable-next-line no-console
    console.log("Admin login: admin@mama-bakery.com / Admin@123");
    // eslint-disable-next-line no-console
    console.log("Customer login: aarav@example.com / Customer@123");
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
