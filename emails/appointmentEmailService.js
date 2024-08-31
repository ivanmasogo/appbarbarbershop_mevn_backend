import { createTransport } from "../config/nodemailer.js";

export async function sendEmailNewAppointment({date, time}) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

   // Send email
   const info = await transporter.sendMail({
    from: 'AppBarberShop <citas@appbarbershop.com>',
    to: 'admin@appbarbershop.com',
    subject: 'AppBarberShop - Nueva Cita',
    text: 'AppBarberShop - Nueva Cita',
    html: `<p>Hola: Admin, tienes una nueva cita.<p>
    <p>La cita será el ${date} a las ${time} horas.</p>
    `
  })
}

export async function sendEmailUpdateAppointment({date, time}) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

   // Send email
   const info = await transporter.sendMail({
    from: 'AppBarberShop <citas@appbarbershop.com>',
    to: 'admin@appbarbershop.com',
    subject: 'AppBarberShop - Cita Actualizada',
    text: 'AppBarberShop - Cita Actualizada',
    html: `<p>Hola: Admin, un usuario ha modificado una cita.<p>
    <p>La nueva cita será el ${date} a las ${time} horas.</p>
    `
  })
}

export async function sendEmailCancelledAppointment({date, time}) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

   // Send email
   const info = await transporter.sendMail({
    from: 'AppBarberShop <citas@appbarbershop.com>',
    to: 'admin@appbarbershop.com',
    subject: 'AppBarberShop - Cita Eliminada',
    text: 'AppBarberShop - Cita Eliminada',
    html: `<p>Hola: Admin, un usuario ha eliminado una cita.<p>
    <p>La cita estaba programada para el ${date} a las ${time} horas.</p>
    `
  })
}