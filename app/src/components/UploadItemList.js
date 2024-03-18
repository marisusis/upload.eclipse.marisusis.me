import React, { useRef, useEffect, useState } from "react";
import UploadItem from "./UploadItem";

export default function UploadItemList({
  items,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
}) {
  return (
    <>
      <label for="exampleFormControlInput1" class="form-label">
        Files
      </label>
      {items.map((item) => (
        <UploadItem
          item={item}
          onRemove={onRemoveItem}
          onUpdate={onUpdateItem}
        />
      ))}
      <div class="mb-3">
        <button class="btn btn-sm btn-light formControl" onClick={onAddItem}>
          Add file
        </button>
      </div>
    </>
  );
}
