import React, { useRef, useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

export default function UploadItem({ item, onRemove, onUpdate }) {
  const input_ref = useRef(null);
  let content = null;
  if (item.state == "idle") {
    content = (
      <>
        <div className="col col-md-10 col-sm-9 col-xs-12">
          <input
            className="form-control form-control"
            ref={input_ref}
            type="file"
            id="formFileMultiple"
            style={{
              width: "100%",
            }}
            onChange={(e) => {
              onUpdate({
                ...item,
                file: e.target.files[0],
              });
            }}
          />
        </div>
        <div className="col col-md-2 col-sm-3 col-xs-1">
          <button
            onClick={() => onRemove(item.id)}
            type="button"
            className="btn btn-link"
          >
            Remove
          </button>
        </div>
      </>
    );
  } else if (item.state === "uploading") {
    content = (
      <div className="col col-md-12 col-sm-12 col-xs-12">
        <ProgressBar
          striped
          variant="secondary"
          animated
          now={(item.progress.loaded / item.progress.total) * 100}
          style={{
            height: "40px",
          }}
          label={item.progress.loaded + " / " + item.progress.total}
        ></ProgressBar>
      </div>
    );
  } else if (item.state === "uploaded") {
    content = (
      <>
        <div className="col col-md-12 col-sm-12 col-xs-12">
          <div class="text-bg-light border-success text-success rounded border p-2">
            Uploaded {item.file.name.substr(0, 30)}
            {item.file.name.length > 30 ? "..." : ""}
          </div>
        </div>
      </>
    );
  } else if (item.state === "error") {
    content = (
      <>
        <div className="col col-md-10 col-sm-9 col-xs-12">
          <div className="text-bg-light border-danger text-danger rounded border p-2">
            Error uploading {item.file.name.substr(0, 20)}...:
            {item.error.toString()}
          </div>
        </div>
        <div className="col col-md-2 col-sm-3 col-xs-1">
          <button
            onClick={() => onRemove(item.id)}
            type="button"
            className="btn btn-link"
          >
            Remove
          </button>
        </div>
      </>
    );
  } else if (item.state === "queued") {
    content = (
      <div className="col col-md-12 col-sm-12 col-xs-12">
        <input
          className="form-control form-control"
          ref={input_ref}
          type="text"
          id="formFileMultiple"
          style={{
            width: "100%",
          }}
          disabled
          placeholder={`Queued: ${item.file.name}`}
        />
      </div>
    );
  }

  return <div class="row gy-2 gx-3 mb-3">{content}</div>;
}
