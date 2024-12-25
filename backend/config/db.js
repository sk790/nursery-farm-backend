import mongoose from "mongoose";

const ConnectToMongo = () => {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "nursery" })
    .then((data) => {
      console.log(`Connected to mongo successfully ${data.connection.host}`);
    });
};
export default ConnectToMongo;
