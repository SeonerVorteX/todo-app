import { Dispatch, SetStateAction } from "react";

export interface Todo {
  id: string;
  title: string;
  content: string;
  isCompleted: boolean;
}

export class TodoManager {
  private todos: Todo[] = [];
  private setTodos: Dispatch<SetStateAction<Todo[]>>;
  private token?: string;

  constructor(
    todoList: Todo[] = [],
    setTodos: Dispatch<SetStateAction<Todo[]>>
  ) {
    this.todos = todoList;
    this.setTodos = setTodos;
    this.token = localStorage.getItem("token") || "";
  }

  get length() {
    return this.todos.length;
  }

  add({
    title,
    content,
    isCompleted,
  }: {
    title: string;
    content: string;
    isCompleted?: boolean;
  }) {
    fetch("http://localhost:3001/v1/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ title, content, isCompleted }),
    })
      .then(async (res) => {
        if (res.ok) {
          const todos = await res.json();
          this.todos = todos;
          this.setTodos([...this.todos]);
        }
      })
      .catch((err) => console.error(err));
  }

  remove(id: string) {
    fetch(`http://localhost:3001/v1/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const todos = await res.json();
          this.todos = todos;
          this.setTodos([...this.todos]);
        }
      })
      .catch((err) => console.error(err));
  }

  edit(id: string, title: string, content: string, isCompleted?: boolean) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.title = title;
      todo.content = content;
      if (isCompleted === false || isCompleted === true) {
        todo.isCompleted = isCompleted;
      }

      if (content === "") return this.remove(id);
    }
    fetch(`http://localhost:3001/v1/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ title, content, isCompleted }),
    })
      .then(async (res) => {
        if (res.ok) {
          const todos = await res.json();
          this.todos = todos;
          this.setTodos([...this.todos]);
        }
      })
      .catch((err) => console.error(err));
  }

  getTodos() {
    return this.todos;
  }

  fetchTodos() {
    fetch("http://localhost:3001/v1/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const todos = await res.json();
          this.todos = todos;
          this.setTodos([...this.todos]);
        }
      })
      .catch((err) => console.error(err));
  }
}
