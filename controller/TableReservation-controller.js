const db = require("../models/db");

exports.createTableReservation = async (req, res, next) => {
  try {
    const { tableNumber, status, date } = req.body;
    let userId, username;

    // ตรวจสอบว่ามีข้อมูลผู้ใช้อยู่ใน req.user หรือไม่
    if (req.user) {
      userId = req.user.id;
      username = req.user.username;
    } else {
      // ถ้าไม่มีข้อมูลผู้ใช้ใน req.user ให้ตรวจสอบว่ามี userId ส่งมากับ req.body หรือไม่
      if (!req.body.userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      userId = req.body.userId;

      // หาข้อมูลผู้ใช้จาก userId ที่ส่งมา
      const user = await db.user.findUnique({
        where: {
          id: userId
        }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      username = user.username;
    }

    // แปลงรูปแบบวันที่ที่รับมาให้มีเวลาเป็น 00:00:00 เพื่อไม่รวมเวลา
    const formattedDate = new Date(date + "T00:00:00Z");

    // ตรวจสอบว่ามีการจองโต๊ะซ้ำในวันที่และหมายเลขโต๊ะเดียวกันหรือไม่
    const existingReservation = await db.TableReservation.findFirst({
      where: {
        tableNumber: tableNumber, // ใช้ tableNumber เป็น string
        date: formattedDate,
        userId: { not: userId } // ตรวจสอบการจองโต๊ะที่มีหมายเลขเดียวกันโดยไม่สนใจ userId เดิม
      }
    });

    if (existingReservation) {
      return res.status(400).json({ message: "Table already reserved by another user on the same date." });
    }

    // สร้างการจองใหม่
    const tableReservation = await db.TableReservation.create({
      data: {
        user: { connect: { id: userId } }, // เชื่อมต่อผู้ใช้โดยใช้ userId
        tableNumber: tableNumber, // ใช้ tableNumber เป็น string
        status: "1",
        date: formattedDate, // ใช้รูปแบบวันที่ที่ผ่านการแปลงแล้ว
        username, // เพิ่ม username ในข้อมูลการจองโต๊ะ
        
      },
    });

    res.status(201).json({ message: "Table reservation created successfully", tableReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTableReservation = async (req, res, next) => {
  try {
    let tableReservation;

    if (req.user.role === "ADMIN") {
      // ถ้าเป็นผู้ดูแลระบบ (ADMIN) ให้แสดงการจองทั้งหมด
      tableReservation = await db.TableReservation.findMany();
    } else if (req.user.role === "STAFF") {
      // ถ้าเป็น STAFF ให้แสดงข้อมูลการจองทั้งหมด พร้อมรายละเอียด
      tableReservation = await db.TableReservation.findMany({
        include: {
          user: { // สมมุติว่ามีความสัมพันธ์กับโมเดล User เพื่อดึงชื่อผู้ใช้
            select: { username: true }
          }
        }
      });
    } else {
      // ถ้าเป็นผู้ใช้ทั่วไป ให้แสดงการจองเฉพาะของตัวเอง แต่จะแสดงเฉพาะหมายเลขโต๊ะของการจองทั้งหมด
      const allReservations = await db.TableReservation.findMany({
        select: {
          tableNumber: true
        }
      });

      const userReservations = await db.TableReservation.findMany({
        where: {
          userId: req.user.id
        }
      });

      // แปลงหมายเลขโต๊ะเป็นสตริง
      const formattedAllReservations = allReservations.map(reservation => ({
        ...reservation,
        tableNumber: reservation.tableNumber
      }));

      const formattedUserReservations = userReservations.map(reservation => ({
        ...reservation,
        tableNumber: reservation.tableNumber
      }));

      tableReservation = [...formattedAllReservations, ...formattedUserReservations];
    }

    res.json(tableReservation);
  } catch (error) {
    next(error);
  }
};

exports.getTableReservation01 = async (req, res, next) => {
  try {
    // ดึงเฉพาะหมายเลขโต๊ะที่มีค่า (tableNumber ที่ไม่ใช่ null)
    const tableReservation = await db.TableReservation.findMany({
      select: {
        tableNumber: true
      },
      where: {
        tableNumber: {
          not: null
        }
      }
    });

    // ส่งข้อมูลกลับไปยังผู้ใช้
    res.json(tableReservation);
  } catch (error) {
    next(error);
  }
};


exports.getTableReservation02 = async (req, res, next) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Fetch table reservations for the authenticated user
    const tableReservations = await db.TableReservation.findMany({
      where: { userId: req.user.id },
      select: { tableNumber: true }
    });

    // Send response
    res.json(tableReservations);
  } catch (error) {
    next(error);
  }
};

exports.deleteTableReservation = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the reservation to be deleted
    const tableReservation = await db.TableReservation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!tableReservation) {
      return res.status(404).json({ message: "Table reservation not found" });
    }

    // Proceed to delete the reservation
    await db.TableReservation.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: "Table reservation deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.UpdateTableStatus = async (req, res, next) => {
  try {
    const { id: tableId, status } = req.body;

    // ตรวจสอบบทบาทของผู้ใช้
    if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // ตรวจสอบว่ามีข้อมูลที่ตรงตาม id ที่ส่งมาหรือไม่
    const existingTable = await db.TableReservation.findUnique({
      where: { id: tableId },
    });

    if (!existingTable) {
      return res.status(404).json({ message: 'Table reservation not found' });
    }

    // อัปเดตสถานะของโต๊ะ
    const updatedTable = await db.TableReservation.update({
      where: { id: tableId },
      data: { status: status },
    });

    res.json({ message: "Table status updated", table: updatedTable });
  } catch (error) {
    next(error);
  }
};

exports.UpdateTableStatus01 = async (req, res, next) => {
  try {
    const { id: tableId } = req.body;

    // ตรวจสอบบทบาทของผู้ใช้
    if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // ตรวจสอบว่ามีข้อมูลที่ตรงตาม id ที่ส่งมาหรือไม่
    const existingTable = await db.TableReservation.findUnique({
      where: { id: tableId },
    });

    if (!existingTable) {
      return res.status(404).json({ message: 'Table reservation not found' });
    }

    // อัปเดตสถานะของโต๊ะ
    const updatedTable = await db.TableReservation.update({
      where: { id: tableId },
      data: { 
        tableNumber: "", // ตั้งค่า tableNumber เป็นค่าว่าง
        confirmbooking: existingTable.tableNumber // เปลี่ยนค่า confirmbooking เป็นค่าเดิมของ tableNumber
      },
    });

    res.json({ message: "Table status updated", table: updatedTable });
  } catch (error) {
    next(error);
  }
};
