const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");

app.use(express.json());

let users = JSON.parse(fs.readFileSync("./database/user.json", "utf-8"));

// Lấy thông tin tất cả người dùng
app.get("/api/v1/users", (req, res) => {
  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});

// API lấy thông tin một người dùng theo Id
app.get("/api/v1/users/:id", (req, res) => {
  console.log(req.params);

  const id = parseInt(req.params.id);
  // tìm kiếm id
  const user = users.find((el) => el.id === id);
  if (user != null) {
    res.status(200).json({
      status: "true",
      data: user,
    });
  } else {
    res.status(404).json({
      status: "false",
      message: "User not found",
    });
  }
});

// Api thêm mới người dùng

app.post("/api/v1/users", (req, res) => {
  //   console.log(req.body);
  //   res.send("Done");
  // Tạo một id mới
  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);

  users.push(newUser);
  fs.writeFile(
    "./database/user.json",
    "utf-8",
    JSON.stringify(users),
    (err) => {
      if (err) throw err;
      res.status(201).json({
        status: "success",
        data: {
          user: newUser,
        },
      });
    }
  );
});

// API xóa người dùng theo Id
app.delete("/api/v1/users/:id", (req, res) => {
  console.log(req.params);

  let id = parseInt(req.params.id);

  if (id > users.length) {
    return res.status(404).json({
      status: "false",
      message: "id not found",
    });
  } else {
    let newUser = users.filter((user) => user.id !== id);
    users = newUser;
    res.status(200).json({
      status: "delete success",
      data: {
        user: id,
      },
    });
  }
});

// Sửa user theo id
app.patch("/api/v1/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Tìm người dùng theo id
  const user = users.find((user) => user.id === id);

  // Kiểm tra nếu không tìm thấy người dùng, trả về lỗi 404
  if (!user) {
    return res.status(404).json({
      status: "false",
      message: "User not found",
    });
  }

  // Cập nhật thông tin người dùng
  user.name = req.body.name;
  user.username = req.body.username;
  user.email = req.body.email;
  user.address = req.body.address;
  user.phone = req.body.phone;
  user.website = req.body.website;
  user.company = req.body.company;

  // Lưu thông tin người dùng vào file user.json
  fs.writeFile("./database/user.json", JSON.stringify(users), (err) => {
    if (err) throw err;
    res.status(200).json({
      status: "update success",
      data: {
        user: user,
      },
    });
  });
});

// tìm kiếm
app.get("/api/v1/users/search", (req, res) => {
  const name = req.query.name;

  if (!name) {
    res.status(404).json({
      status: "false",
      message: "Invalid name provided",
    });
  } else {
    // Tìm người dùng theo tên
    const filteredUsers = users.find((user) =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );

    // Trả về kết quả tìm kiếm
    res.status(200).json({
      status: "success",
      data: {
        users: filteredUsers,
      },
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
