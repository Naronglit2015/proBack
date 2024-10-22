// const admin = require('firebase-admin');
// const serviceAccount = require('../path/to/your/firebaseConfig.json');
// const { v4: uuidv4 } = require('uuid'); // สำหรับสร้างชื่อไฟล์ที่ไม่ซ้ำกัน

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'gs://pro-aclub.appspot.com' // แทนที่ด้วยชื่อ bucket ของคุณ
// });

// const bucket = admin.storage().bucket();

// exports.updateProfile1 = async (req, res, next) => {
//   const { username, phoneNumber, imgProfileUrl } = req.body;
//   const userId = req.user.id;

//   try {
//     if (!username && !phoneNumber && !req.file && !imgProfileUrl) {
//       return next(new Error("No data to update"));
//     }

//     let updateData = {};

//     if (username) {
//       updateData.username = username;
//     }

//     if (phoneNumber) {
//       updateData.phoneNumber = phoneNumber;
//     }

//     if (req.file) {
//       const fileName = `profile-${userId}-${uuidv4()}${path.extname(req.file.originalname)}`;
//       const file = bucket.file(fileName);

//       await file.save(req.file.buffer, {
//         metadata: {
//           contentType: req.file.mimetype,
//         },
//         public: true,
//         validation: 'md5'
//       });

//       updateData.imgprofile = file.publicUrl();
//     } else if (imgProfileUrl) {
//       updateData.imgprofile = imgProfileUrl;
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: updateData
//     });

//     res.json({ msg: 'Profile updated successfully', user: updatedUser });
//   } catch (err) {
//     next(err);
//   }
// };
