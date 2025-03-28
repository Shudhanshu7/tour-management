import Booking from "../models/Booking.js";

//create new booking
export const createBooking = async (req, res) => {
  const newBooking = new Booking(req.body);
  try {
    const savedBooking = await newBooking.save();

    res.status(200).json({
      success: true,
      message: "Your tour is booked",
      data: savedBooking,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Booking failed" });
  }
};

//get single booking
export const getBooking = async (req, res) => {
  const id = req.params.id;

  try {
    const Book = await Booking.findById(id);
    res.status(200).json({
      success: true,
      message: "Successful",
      data: Book,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

//get all booking
export const getAllBooking = async (req, res) => {
  
    try {
        const Books = await Booking.find();

      res.status(200).json({
        success: true,
        message: "Successful",
        data: Books,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
