import User from "../models/User.js";
import { sendEmailVerification, sendEmailPasswordReset } from "../emails/authEmailService.js";
import { generateJWT, uniqueId } from "../utils/index.js";

const register = async (req, res) => {
  // Validate all fields
  if (Object.values(req.body).includes("")) {
    const error = new Error("Todos los campos son obligatorios.");

    return res.status(400).json({
      msg: error.message,
    });
  }

  const { email, password, name } = req.body;

  // Avoid duplicate registrations
  const userExist = await User.findOne({ email });

  if (userExist) {
    const error = new Error("Usuario ya registrado.");
    return res.status(400).json({
      msg: error.message,
    });
  }

  // Validate password length
  const MIN_PASSWORD_LENGTH = 8;
  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    const error = new Error(
      `El password debe tener mínimo ${MIN_PASSWORD_LENGTH} caracteres.`
    );
    return res.status(400).json({
      msg: error.message,
    });
  }

  try {
    const user = new User(req.body);
    const result = await user.save();

    const { name, email, token } = result;

    sendEmailVerification({
      name,
      email,
      token,
    });

    res.json({
      msg: "El usuario se ha creado correctamente. Revisa tu email.",
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyAccount = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error("Token no válido.");
    return res.status(401).json({ msg: error.message });
  }

  // If the token is valid, confirm the account
  try {
    user.verified = true;
    user.token = "";
    await user.save();
    res.json({ msg: "Usuario confirmado correctamente." });
  } catch (error) {}
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("El usuario no existe.");
    return res.status(401).json({ msg: error.message });
  }

  // Check if the user has already confirmed their account
  if (!user.verified) {
    const error = new Error("Tu cuenta no ha sido verificada aún.");
    return res.status(401).json({ msg: error.message });
  }

  // Check the password
  if (await user.checkPassword(password)) {
    const token = generateJWT(user._id);
    res.json({
      msg: "Usuario Autenticado.",
      token,
    });
  } else {
    const error = new Error("El password es incorrecto.");
    return res.status(401).json({ msg: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if the password exists
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("El usuario no existe.");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = uniqueId();
    const result = await user.save();

    await sendEmailPasswordReset({
      name: result.name,
      email: result.email,
      token: result.token
    })

    res.json({
      msg: 'Hemos enviado un email con las instrucciones.'
    })
  } catch (error) {
      console.log(error);
  }
};

const verifyPasswordResetToken = async (req, res) => {
  const { token } = req.params;

  const isValidToken = await User.findOne({ token});
  if(!isValidToken){
    const error = new Error("Hubo un error, token no válido.");
    return res.status(400).json({msg: error.message});
  }
  res.json({msg:"Token válido."});
}

const updatePassword = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ token});
  if(!user){
    const error = new Error("Hubo un error, token no válido.");
    return res.status(400).json({msg: error.message});
  }

  const { password } = req.body;

  try {
    user.token = '';
    user.password = password;
    await user.save();
    res.json({
      msg: 'Password modificado correctamente.'
    })
  }catch(error){
    console.log(error)
  }

}

const user = async (req, res) => {
  const { user } = req;
  res.json(user);
};

const admin = async (req, res) => {
  const { user } = req;
  if(!user.admin){
    const error = new Error("Acción no válida");
    return res.status(403).json({msg: error.message});
  }
  res.json(user);
};

export { 
  register, 
  verifyAccount, 
  login, 
  forgotPassword, 
  verifyPasswordResetToken, 
  updatePassword, 
  user, 
  admin 
};
