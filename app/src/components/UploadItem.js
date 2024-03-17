import React, { useRef, useEffect, useState } from "react";

export default function UploadItem({ onClose }) {
  const input_ref = useRef(null);
  const button_ref = useRef(null);

  useEffect(() => {
    const inputElement = input_ref.current;

    let onChange = (event) => {
      console.log(event);
    };

    inputElement.addEventListener("change", onChange);

    return () => {
      inputElement.removeEventListener("change", onChange);
    };
  }, [input_ref]);

  useEffect(() => {
    const buttonElement = button_ref.current;

    let onClick = (event) => {
      onClose();
    };

    buttonElement.addEventListener("click", onClick);

    return () => {
      buttonElement.removeEventListener("click", onClick);
    };
  }, [button_ref, onClose]);

  return (
    <div class="row gy-2 gx-3 mb-3">
      <div className="col col-auto">
        <input
          className="form-control form-control"
          ref={input_ref}
          type="file"
          id="formFileMultiple"
          style={{
            minWidth: "400px",
            width: "100%",
          }}
        />
      </div>
      <div className="col col-auto">
        <button
          ref={button_ref}
          type="button"
          className="btn btn-outline-danger"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
