import { SyntheticEvent, useEffect, useState } from "react";
import "./styles.css";
import TodoCard from "./TodoCard";
import { Todo, TodoManager } from "@/managers/TodoManager";

export default () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoList, setTodoList] = useState<Todo[]>(todos);
  const manager = new TodoManager(todos, setTodos);

  useEffect(() => {
    manager.fetchTodos();
  }, []);

  useEffect(() => {
    setTodoList(todos);
  }, [todos]);

  const onEdit = (
    id: string,
    title: string,
    content: string,
    isCompleted?: boolean
  ) => {
    manager.edit(
      id,
      title.trim().replace(/\s+/g, " "),
      content.trim().replace(/\s+/g, " "),
      isCompleted
    );
  };

  const search = (e: SyntheticEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    if (!query) return setTodoList(manager.getTodos());

    const results = todos.filter((todo) =>
      todo.title.toLowerCase().includes(query.toLowerCase())
    );

    setTodoList(results);
  };

  const addTodo = () => {
    manager.add({
      title: "Todo Title",
      content: "Todo Description",
      isCompleted: false,
    });
  };

  return (
    <div className="container app">
      <div className="search">
        <input
          onInput={search}
          className="search-bar"
          type="text"
          placeholder="Search..."
        />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

      <div className="todos">
        {todoList.map((todo, index) => (
          <TodoCard
            key={index}
            id={todo.id}
            title={todo.title}
            onEdit={onEdit}
            content={todo.content}
            manager={manager}
            isCompleted={todo.isCompleted}
          />
        ))}
        <div className="card create">
          <div className="icon" onClick={addTodo}>
            <i className="fa-solid fa-plus"></i>
          </div>
        </div>
      </div>
    </div>
  );
};
