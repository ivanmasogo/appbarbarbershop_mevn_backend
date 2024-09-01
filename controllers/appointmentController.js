import { parse, formatISO, startOfDay, endOfDay, isValid } from "date-fns";
import { fromZonedTime  } from "date-fns-tz";
import Appointment from "../models/Appointment.js";
import { validateObjectId, handleNotFoundError, formatDate } from "../utils/index.js";
import { sendEmailNewAppointment, sendEmailUpdateAppointment, sendEmailCancelledAppointment } from "../emails/appointmentEmailService.js";

const createAppointment = async (req, res) => {
  const appointment = req.body;
  appointment.user = req.user._id.toString();

  try {
    const newAppointment = new Appointment(appointment);
    const result = await newAppointment.save();

    await sendEmailNewAppointment({
      date: formatDate(result.date),
      time: result.time
    });

    res.json({
      msg: "Reserva realizada correctamente.",
    });
  } catch (error) {
    console.log(error);
  }
};

const getAppointmentByDate = async (req, res) => {
  const { date } = req.query;

  const timeZone = 'Europe/Madrid';

  const localDate = parse(date, 'dd/MM/yyyy', new Date());

  if (!isValid(localDate)) {
    const error = new Error("Fecha no válida");
    return res.status(400).json({ msg: error.message });
  }

  const startDateUtc = fromZonedTime(startOfDay(localDate), timeZone);
  const endDateUtc = fromZonedTime(endOfDay(localDate), timeZone);

  const startDateIso = formatISO(startDateUtc);
  const endDateIso = formatISO(endDateUtc);

  const appointments = await Appointment.find({
    date: {
      $gte: startDateIso,
      $lte: endDateIso,
    },
  }).select("time");

  res.json(appointments);
};

const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  // Validate by Object Id
  if (validateObjectId(id, res)) return;

  // Validate existence
  const appointment = await Appointment.findById(id).populate('services');
  if (!appointment) {
    return handleNotFoundError("La cita no existe", res);
  }

  // Check if the id of the user authenticated and the request is the same
  if (appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error("No tienes los permisos.");
    return res.status(403).json({ msg: error.message });
  }

  //Return appointment
  res.json(appointment);
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;

  // Validate by Object Id
  if (validateObjectId(id, res)) return;

  // Validate existence
  const appointment = await Appointment.findById(id).populate('services');
  if (!appointment) {
    return handleNotFoundError("La cita no existe", res);
  }

  // Check if the id of the user authenticated and the request is the same
  if (appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error("No tienes los permisos.");
    return res.status(403).json({ msg: error.message });
  }

  const { date, time, totalAmount, services } = req.body;
  appointment.date = date;
  appointment.time = time;
  appointment.totalAmount = totalAmount;
  appointment.services = services;

  try {
    const result = await appointment.save();

    await sendEmailUpdateAppointment({
      date: formatDate(result.date),
      time: result.time
    });

    res.json({
      msg: 'Cita Actualizada Correctamente.'
    })
  } catch(error) {
    console.log(error);
  }
}

const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  // Validate by Object Id
  if (validateObjectId(id, res)) return;

  // Validate existence
  const appointment = await Appointment.findById(id).populate('services');
  if (!appointment) {
    return handleNotFoundError("La cita no existe", res);
  }

  // Check if the id of the user authenticated and the request is the same
  if (appointment.user.toString() !== req.user._id.toString()) {
    const error = new Error("No tienes los permisos.");
    return res.status(403).json({ msg: error.message });
  }

  // Save neccessary data before deleting 
  const appointmentDetails = {
    date: appointment.date,
    time: appointment.time
  }

  try {
    const result = await appointment.deleteOne();

    await sendEmailCancelledAppointment({
      date: formatDate(appointmentDetails.date),
      time: appointmentDetails.time
    });
    

    res.json({ msg: 'Cita eliminada.' });
  } catch(error) {
    console.log(error);
  }

}

export { createAppointment, getAppointmentByDate, getAppointmentById, updateAppointment, deleteAppointment };
