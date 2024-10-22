const db = require('../models/db');
const cloudUpload = require("../middlewares/cloudUpload");

exports.getProduct = async (req, res, next) => {
    try {
      const products = await db.Product.findMany();
      res.json(products);
    } catch (error) {
      next(error);
    }
  };
  
  exports.getProduct01 = async (req, res, next) => {
    try {
      const products = await db.Product.findMany();
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  exports.postProduct = async (req, res, next) => {
    try {
      const { name, description, price } = req.body;
      const file = req.file;
  
      // ตรวจสอบข้อมูลที่ได้รับ
      if (!name || !description || !price || !file) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // อัปโหลดไฟล์
      const imageUrl = await cloudUpload(file.path);
  
      // สร้างสินค้าในฐานข้อมูล
      const product = await db.Product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          img: imageUrl
        },
      });
  
      res.json({ message: "Product created successfully", product });
    } catch (error) {
      console.error('Error creating product:', error);
      next(error);
    }
  };

  