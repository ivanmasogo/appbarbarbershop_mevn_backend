import mongoose from "mongoose";
import colors from "colors";

export const db = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    const url = `${db.connection.host}:${db.connection.port}`;
    console.log(
      colors.green("MongoDB conectado correctamente: ") + colors.blue.bold(url)
    );
  } catch (error) {
    console.log(colors.red(`Error: ${error.message}`));
    process.exit(1);
  }
};
