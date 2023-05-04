const http = require("http");
const parser = require("./src/utils/parser");
const Io = require("./src/utils/Io");
const Todos = new Io("./db/todo.json");
const Todo = require("./src/models/Todo");

http
  .createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.url === "/todo" && req.method === "POST") {
      try {
        req.body = await parser(req);
        const { title, text } = req.body;
        const todos = await Todos.read();
        const id = (todos[todos.length - 1]?.id || 0) + 1;
        const isCompleted = "progress";
        const date = new Date();
        const newTodo = new Todo(id, title, text, date, isCompleted);

        const data = todos.length ? [...todos, newTodo] : [newTodo];

        Todos.write(data);

        res.writeHead(201);
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.log(error);
      }
    } else if (req.url === "/todo" && req.method === "GET") {
      const todos = await Todos.read();
      res.end(JSON.stringify(todos));
    } else if (req.url === "/todo/get" && req.method === "GET") {
      try {
        const todos = await Todos.read();
        req.body = await parser(req);
        const id = req.body.id;
        const finded = todos.find((el) => el.id === id);
        res.writeHead(201);
        res.end(JSON.stringify(finded));
      } catch (error) {
        res.writeHead(403);
        res.end(JSON.stringify({ message: "This todo is not found" }));
      }
    } else if (req.url === "/todo/put" && req.method === "PUT") {
      try {
        const todos = await Todos.read();
        req.body = await parser(req);
        const id = req.body.id;
        console.log(id);
        const { title, text, isCompleted } = req.body;
        const idx = todos.findIndex((el) => el.id == id);
        const changedBlog = {
          id: todos[idx].id,
          title: title || todos[idx].title,
          text: text || todos[idx].text,
          date: todos[idx].date,
          isCompleted: isCompleted || todos[idx].isCompleted,
        };
        todos[idx] = changedBlog;
        res.writeHead(200);
        Todos.write([...todos]);
        if (idx != -1) {
          res.end(JSON.stringify({ status: "Ok" }));
        } else {
          res.writeHead(200);
          res.end(JSON.stringify({ status: "error" }));
        }
      } catch (error) {
        res.end(JSON.stringify({ status: "This todo not found" }));
        console.log(error);
      }
    } else if (req.url === "/todo/isCompleted" && req.method === "PUT") {
      try {
        const todos = await Todos.read();
        req.body = await parser(req);
        const id = req.body.id;
        console.log(id);
        const { title, text, isCompleted } = req.body;
        const idx = todos.findIndex((el) => el.id == id);
        const changedBlog = {
          id: todos[idx].id,
          title: title || todos[idx].title,
          text: text || todos[idx].text,
          date: todos[idx].date,
          isCompleted: isCompleted || todos[idx].isCompleted,
        };
        todos[idx] = changedBlog;
        res.writeHead(200);
        Todos.write([...todos]);
        if (idx != -1) {
          res.end(JSON.stringify({ status: "Ok" }));
        } else {
          res.writeHead(200);
          res.end(JSON.stringify({ status: "error" }));
        }
      } catch (error) {
        res.writeHead(403);
        res.end(JSON.stringify({ status: "This todo not found" }));
      }
    } else if (req.url === "/todo/delete" && req.method === "DELETE") {
      try {
        const todos = await Todos.read();
        req.body = await parser(req);
        const id = req.body.id;
        const idx = todos.findIndex((el) => el.id == id);
        if (idx != -1) {
          todos.splice(idx, 1);
          Todos.write(todos);
          res.writeHead(200);
          res.end(JSON.stringify({ status: "Ok" }));
        } else {
          Todos.write(todos);
          res.writeHead(403);
          res.end(JSON.stringify({ status: "This todo not found" }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  })
  .listen(1818);
