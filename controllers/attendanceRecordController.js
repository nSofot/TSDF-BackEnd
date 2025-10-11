import AttendanceRecord from "../models/attendanceRecord.js";

export const createAttendanceRecord = async (req, res) => {
  console.log(req.body);
  try {
    const attendanceData = req.body; // Expecting an array of objects [{ date, memberId, isPresent }, ...]

    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({ error: "No attendance records provided" });
    }

    const savedRecords = await AttendanceRecord.insertMany(attendanceData);
    res.status(201).json({
      message: "Attendance records saved successfully",
      count: savedRecords.length,
      records: savedRecords,
    });
  } catch (error) {
    console.error("Error saving attendance records:", error);
    res.status(500).json({ error: "Failed to save attendance records" });
  }
};


export const getAttendanceRecordsByMemberId = async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const records = await AttendanceRecord.find({ memberId });
    res.json(records);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
};


export const getAllAttendanceRecords = async (req, res) => {
  try {
    const records = await AttendanceRecord.find();
    res.json(records);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
}