const db = require("../models/db");
const cloudUpload = require("../middlewares/cloudUpload");

exports.purchaseProduct = async (req, res, next) => {
  try {
    const { name, description, price, table, quantity, paymentMethod,img, status ,imgcredit} = req.body;
    const userId = req.user.id;
    const file = req.file; 

    // console.log("fsfaf",imgcredit, img)

    const imagePromise = req.files.map((file) => {
      return cloudUpload(file.path);
    });
    const imageUrlArray = await Promise.all(imagePromise);
    const imageUrl = imageUrlArray[0];

    const purchase = await db.purchase.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        table: String(table),
        quantity: parseFloat(quantity), // เพิ่ม quantity เข้าไป
        payment: paymentMethod, // เพิ่ม payment เข้าไป
        userId: userId,
        img: img,
        status:"1",
        imgcredit : imageUrl,
        
      },
    });

    res.json({ message: "Purchase successful", purchase });
  } catch (error) {
    next(error);
  }
};


exports.getpurchase = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN" || req.user.role === "STAFF") {
      const purchases = await db.purchase.findMany();
      res.json(purchases);
    } else {
      const purchases = await db.purchase.findMany({
        where: {
          userId: req.user.id,
        },
      });
      res.json(purchases);
    }
  } catch (error) {
    next(error);
  }
};

exports.deletePurchase = async (req, res, next) => {
  try {
    const purchaseId = req.params.id;
    
    // ตรวจสอบว่ามี purchase นี้อยู่หรือไม่
    const purchase = await db.purchase.findUnique({
      where: {
        id: parseInt(purchaseId)
      }
    });
    
    // ถ้าไม่มี purchase ให้ส่งข้อความว่าไม่พบ purchase นี้
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    
    // ลบ purchase
    await db.purchase.delete({
      where: {
        id: parseInt(purchaseId)
      }
    });
    
    res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.purchaseFinish = async (req, res, next) => {
  try {
    const { name, description, price, table, quantity, paymentMethod,img } = req.body;
    const userId = req.user.id;

    const purchaseFinish = await db.purchase.create({
      data: {
        name,
        description,
        price,
        table: String(table),
        quantity: parseFloat(quantity), // เพิ่ม quantity เข้าไป
        payment: paymentMethod, // เพิ่ม payment เข้าไป
        userId,
        img,
      },
    });

    res.json({ message: "Purchase successful", purchase });
  } catch (error) {
    next(error);
  }
};


exports.Finish2 = async (req, res, next) => {
  try {
    const { id: purchaseId, status } = req.body;
    const userId = req.user.id;

    // ตรวจสอบบทบาทของผู้ใช้
    if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const updatedPurchase = await db.purchase.update({
      where: {
        id: purchaseId,
      },
      data: {
        status: status,
      },
    });

    res.json({ message: "Purchase status updated", purchase: updatedPurchase });
  } catch (error) {
    next(error);
  }
};
