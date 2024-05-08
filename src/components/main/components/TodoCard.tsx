import { TodoManager } from "@/Managers/TodoManager";
import "./styles.css";
import { SyntheticEvent, useEffect, useState } from "react";

interface TodoCardProps {
  id: string;
  title: string;
  content: string;
  isCompleted: boolean;
  onEdit: (
    id: string,
    title: string,
    content: string,
    isCompleted: boolean
  ) => void;
  manager: TodoManager;
}

export default ({ id, title, content, onEdit, manager }: TodoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content);
  const [editableTitle, setEditableTitle] = useState(title);
  const [emptyTitle, setEmptyTitle] = useState(false);
  const maxTitleLength = 20;

  useEffect(() => {
    if (!title && !content) {
      setEditableContent("Type your content here");
      setEditableTitle("Title");
      setIsEditing(true);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleContentChange = (e: SyntheticEvent<HTMLDivElement>) => {
    setEditableContent(e.currentTarget.textContent || "");
  };

  const handleTitleChange = (e: SyntheticEvent<HTMLDivElement>) => {
    if (
      e.currentTarget.textContent?.length &&
      e.currentTarget.textContent?.length > maxTitleLength
    )
      return;

    setEditableTitle(e.currentTarget.textContent || "");
    setEmptyTitle(!e.currentTarget.textContent?.length);
  };

  const handleSave = () => {
    onEdit(id, editableTitle, editableContent, !editableContent ? false : true);
    setIsEditing(false);
  };

  const handleDelete = () => {
    manager.remove(id);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditing]);
  return (
    <div className="card todo">
      <div className="content">
        <h3
          className={`todo-title ${isEditing ? "editing" : ""}`}
          contentEditable={isEditing}
          onInput={handleTitleChange}
        >
          {title}
        </h3>
        <div
          className={`todo-content ${isEditing ? "editing" : ""}`}
          contentEditable={isEditing}
          onInput={handleContentChange}
        >
          <p>{content}</p>
        </div>
      </div>
      <div className="buttons">
        {isEditing ? (
          <i
            className={`fa-solid fa-floppy-disk save ${
              emptyTitle ? "disable" : ""
            }`}
            onClick={emptyTitle ? () => {} : handleSave}
          ></i>
        ) : (
          <i className="fa-solid fa-edit edit" onClick={handleEdit}></i>
        )}
        <i className="fa-solid fa-trash-can delete" onClick={handleDelete}></i>
      </div>
    </div>
  );
};
