import { createTransport } from "../config/nodemailer.js";

export async function sendEmailVerification({ name, email, token }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

  // Send email
  const info = await transporter.sendMail({
    from: 'AppBarberShop <cuentas@appbarbershop.com>',
    to: email,
    subject: 'AppBarberShop - Confirma tu cuenta',
    html: `<p>Hola: ${name}, confirma tu cuenta en AppBarberShop<p>
    <p>Tu cuenta está casi lista, sólo debes confirmarla en el siguiente enlace:</p>    
    <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta</a>
    <p>Si tú no has creado esta cuenta, puedes ignorar este mensaje.</p>
    `
  })

}

export async function sendEmailPasswordReset({ name, email, token }) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

  // Send email
  const info = await transporter.sendMail({
    from: 'AppBarberShop <cuentas@appbarbershop.com>',
    to: email,
    subject: 'AppBarberShop - Restablece tu password',
    html: `<p>Hola: ${name}, has solicitado reemplazar tu password.<p>
    <p>Sigue el siguiente enlace para generar un nuevo password:</p>    
    <a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}">Restablecer Password</a>
    <p>Si tú no has solicitado esto, puedes ignorar este mensaje.</p>
    `
  })

}