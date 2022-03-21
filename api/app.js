const express = require("express");
const http = require("http");
const cors = require("cors");
const port = 8800;
const dotenv = require("dotenv");
const {
  addWishListItem,
  authenticateAnonymously,
  getWishList,
  streamWishListItems,
} = require("./firebase");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000" },
});

const authRouter = require("./routes/auth");
const wishListRouter = require("./routes/wishList");

io.on("connection", async (socket) => {
  let error = true;
  jwt.verify(
    socket.handshake.auth.token,
    process.env.REACT_APP_JWT_PRIVATE_KEY,
    (err, decoded) => {
      if (err) {
        socket.emit("message", { status: "Not authorized" });
      } else {
        error = false;
      }
    }
  );
  if (!error) {
    try {
      await authenticateAnonymously();
      const subscribe = streamWishListItems(
        socket.handshake.query["wishListId"],
        (querySnapshot) => {
          updatedWishListItems = querySnapshot.docs.map((docSnapshot) => {
            return docSnapshot.data();
          });
          socket.emit("message", updatedWishListItems);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
});

// io.use(function (socket, next) {
//   console.log(socket.handshake.query.token);
//   if (socket.handshake.query && socket.handshake.query.token) {
//     jwt.verify(
//       socket.handshake.query.token,
//       process.env.REACT_APP_JWT_PRIVATE_KEY,
//       function (err, decoded) {
//         if (err) return next(new Error("Authentication error"));
//         socket.decoded = decoded;
//         next();
//       }
//     );
//   } else {
//     next(new Error("Authentication error"));
//   }
// }).on("connection", function (socket) {
//   // Connection now authenticated to receive further events
//   socket.on("message", function (message) {
//     io.emit("message", message);
//   });
// });

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/wishList", wishListRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log("Express server listening on: " + port);
});

module.exports = app;
