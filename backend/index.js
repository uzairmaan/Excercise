const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwtKey = "HelloWorld";
const Activity = require("./Schema");
const User = require("./SignupSchema");
const BodyPArser = require("body-parser");
app.use(BodyPArser.json());
app.use(cors());

mongoose.connect(
  "mongodb://127.0.0.1:27017/GoPerformance",
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (err) {
      console.log("DB not connected");
    } else {
      console.log("DB connected");
    }
  }
);
app.get("/show", verifyToken, (req, res) => {
  Activity.find((err, Activities) => {
    if (err) {
      res.send(err);
    } else {
      res.send(Activities);
    }
  });
});

// app.post("/create", (req, res) => {
//   const activity = new Activity(req.body);
//   activity.save((err, activity) => {
//     if (err) res.send(err);
//     else {
//       res.send("Data Inserted Successfully");
//     }
//   });
// });
app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, Users) => {
    if (Users) {
      if (req.body.password != Users.password) {
        res.status(403).send("Incorrect Password");
      } else if (
        req.body.email == Users.email &&
        req.body.password == Users.password
      ) {
        jwt.sign({ Users }, jwtKey, { expiresIn: "5m" }, (err, token) => {
          if (err) {
            res.status(401).send(err);
          } else {
            res.status(200).send({ Users, auth: token });
          }
        });
        // res.status(200).send(Users);
      }
    } else {
      res.status(401).send(err);
    }
  });
});
function verifyToken(req, res, next) {
  var token = req.headers.authorization;
  if (token) {
    token = token.split(" ")[1];

    jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send("Your token is not valid");
      } else {
        next();
      }
    });
  } else {
    res.status(402).send("Please Add token");
  }
}
app.post("/useractivity", verifyToken, (req, res) => {
  if (req.body.user) {
    const activity = new Activity(req.body);

    activity.save((err, activity) => {
      if (err) res.send(err);
      else {
        res.send("Data Inserted Successfully");
      }
    });
  }
});
// app.post("/getactivities", (req, res) => {
//   Activity.find({ user: req.body.user }, (err, activity) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(activity);
//     }
//   });
// });

app.post("/getactivities", verifyToken, (req, res) => {
  Activity.find({ user: req.body })
    .populate("user", "name")
    .exec((err, activity) => {
      if (err) {
        res.send(err);
      } else {
        res.send(activity);
      }
    });
});
app.post("/signup", (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      res.status(401).send("User Already Exists");
    } else {
      res.status(201).send("Registered Successfully");
    }
  });
});

app.delete("/delete/:id", verifyToken, (req, res) => {
  Activity.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("data deleted successfully");
    }
  });
});

app.put("/update/:id", verifyToken, (req, res) => {
  Activity.updateOne(
    { _id: req.params.id },
    {
      name: req.body.name,
      description: req.body.description,
      duration: req.body.duration,
      activityType: req.body.activityType,
      date: req.body.date,
    },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Updated Successfully");
      }
    }
  );
});

app.listen(4000, (err) => {
  if (err) {
    console.log("Not Listening");
  } else {
    console.log("SuccessFully Listening");
  }
});
