const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const db = require("../models/db");
const { PrismaClient } = require('@prisma/client');
const cloudUpload = require("../middlewares/cloudUpload");

const prisma = new PrismaClient();

exports.register = async (req, res, next) => {
  const { username, password, confirmPassword, email,phoneNumber,imgprofile } = req.body;
  try {
    // validation
    if (!(username && password && confirmPassword)) {
      return next(new Error("Fulfill all inputs"));
    }
    if (confirmPassword !== password) {
      throw new Error("confirm password not match");
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);
    const data = {
      username,
      password : hashedPassword,
      email,
      phoneNumber,
      imgprofile
    };

    const rs = await db.user.create({ data  })
    console.log(rs)

    res.json({ msg: 'Register successful' })
  } catch (err) {
    next(err);
  }
};



exports.login = async (req, res, next) => {
  const {username, password} = req.body
  try {
    // validation
    if( !(username.trim() && password.trim()) ) {
      throw new Error('username or password must not blank')
    }
    // find username in db.user
    const user = await db.user.findFirstOrThrow({ where : { username }})
    // check password
    const pwOk = await bcrypt.compare(password, user.password)
    if(!pwOk) {
      throw new Error('invalid login')
    }
    // issue jwt token 
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })
    console.log(token)
    res.json({token : token})
  }catch(err) {
    next(err)
  }
};



exports.getme = (req,res,next) => {
  res.json(req.user)
}



exports.getUser = async (req, res, next) => {
  try {
    const User = await db.User.findMany();
    res.json(User);
  } catch (error) {
    next(error);
  }
};

// แก้ไขฟังก์ชัน getUser ใน backend
exports.getUser01 = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10); // แปลง userId เป็นตัวเลข
    const user = await db.User.findUnique({
      where: {
        id: userId // ส่งค่า userId ที่แท้จริงเข้าไป
      }
    });
    if (user) {
      res.json(user); // ส่งข้อมูลผู้ใช้กลับไป
    } else {
      res.status(404).json({ message: 'User not found' }); // ส่งข้อผิดพลาด 404 หากไม่พบผู้ใช้
    }
  } catch (error) {
    next(error); // ส่งข้อผิดพลาดไปยัง middleware สำหรับการจัดการข้อผิดพลาด
  }
};



exports.updateProfile = async (req, res, next) => {
  const { username, phoneNumber } = req.body;
  const file = req.file;

  const userId = req.user.id; // Ensure authentication middleware is in place

  try {
    // Validate input
    if (!username && !phoneNumber && !file) {
      return next(new Error("No data to update"));
    }

    // Prepare data to update
    const updateData = {};

    // Update fields if provided
    if (username) updateData.username = username;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    // Handle file upload if a file is provided
    if (file) {
      // Upload the file to cloud storage and get the URL
      const imageUrl = await cloudUpload(file.path);
      updateData.imgprofile = imageUrl;
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    res.json({ msg: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    next(err);
  }
};



exports.updateUser = async (req, res, next) => {
  const { username, email, phoneNumber, password, role } = req.body;
  const file = req.file;
  const userId = parseInt(req.params.userId, 10);

  try {
    if (!username && !email && !phoneNumber && !file && !password && !role) {
      return res.status(400).json({ error: "No data to update" });
    }

    const updateData = {};

    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUsername && existingUsername.id !== userId) {
        return res.status(400).json({ error: "Username already in use" });
      }

      updateData.username = username;
    }

    if (email) updateData.email = email;

    if (phoneNumber !== undefined) {
      updateData.phoneNumber = String(phoneNumber);
    }

    if (file) {
      try {
        const imageUrl = await cloudUpload(file.path);
        updateData.imgprofile = imageUrl;
      } catch (uploadError) {
        return res.status(500).json({ error: "File upload failed" });
      }
    }


    if (role) {
      const validRoles = ['USER', 'STAFF', 'ADMIN'];
      if (validRoles.includes(role)) {
        updateData.role = role;
      } else {
        return res.status(400).json({ error: "Invalid role value" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({ msg: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    next(err);
  }
};



exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the user to be deleted
    const user = await db.User.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Proceed to delete the user
    await db.User.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
