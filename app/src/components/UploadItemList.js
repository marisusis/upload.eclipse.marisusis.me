import React, { useRef, useEffect, useState } from "react";
import UploadItem from "./UploadItem";

export default function UploadItemList({
  items,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
}) {
  let onSingle = () => {
    const ghost = document.createElement("input");
    ghost.setAttribute("type", "file");
    ghost.click();

    ghost.addEventListener("change", (e) => {
      for (let file of e.target.files) {
        onAddItem(file);
        ghost.remove();
      }
    });
  };

  let onMultiple = () => {
    const ghost = document.createElement("input");
    ghost.setAttribute("type", "file");
    ghost.multiple = true;
    ghost.click();

    ghost.addEventListener("change", (e) => {
      for (let file of e.target.files) {
        onAddItem(file);
        ghost.remove();
      }
    });
  };

  return (
    <>
      <label htmlFor="exampleFormControlInput1" className="form-label">
        Files
      </label>
      <div
      // className="card p-2"
      // style={{
      //   maxHeight: "300px",
      //   overflowY: "scroll",
      // }}
      >
        {items.map((item) => (
          <UploadItem
            item={item}
            key={item.id}
            onRemove={onRemoveItem}
            onUpdate={onUpdateItem}
          />
        ))}
        {items.length === 0 ? (
          <div className="text-secondary text-center">No files</div>
        ) : null}
      </div>
      <div className="mt-2">
        <button
          className="btn btn-sm btn-light formControl"
          onClick={onMultiple}
        >
          Add files
        </button>
      </div>
    </>
  );
}
