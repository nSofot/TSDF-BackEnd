import express from "express";
import {
  createAttendanceRecord,
  getAllAttendanceRecords,
  getAttendanceRecordsByMemberId
} from "../controllers/attendanceRecordController.js";

const attendanceRecordRouter = express.Router();

attendanceRecordRouter.post("/", createAttendanceRecord);
attendanceRecordRouter.get("/", getAllAttendanceRecords);
attendanceRecordRouter.get("/member/:memberId", getAttendanceRecordsByMemberId);

export default attendanceRecordRouter;