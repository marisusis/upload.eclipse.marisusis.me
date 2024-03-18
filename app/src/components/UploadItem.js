import React, { useRef, useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { formatSize } from "../util/size";

export default function UploadItem({ item, onRemove, onUpdate }) {
  const input_ref = useRef(null);

  let removeButton = (
    <button
      onClick={() => onRemove(item.id)}
      type="button"
      className="btn btn-outline-danger btn-sm formControl"
    >
      Remove
    </button>
  );

  let content = null;
  if (item.state === "idle") {
    content = (
      <>
        <div className="col col-md-10 col-sm-9 col-xs-12">
          <div className="text-bg-light  d-flex justify-content-between rounded border p-2">
            <span>
              {item.file.name.substr(0, 40)}
              {item.file.name.length > 40 ? "..." : ""}
            </span>
            <span className="text-secondary">{formatSize(item.file.size)}</span>
          </div>
        </div>
        <div className="col col-md-2 col-sm-3 col-xs-1 d-flex align-items-center justify-content-center">
          <div>{removeButton}</div>
        </div>
      </>
    );
  } else if (item.state === "uploading") {
    content = (
      <>
        <div className="col col-md-12 col-sm-12 col-xs-12">
          <ProgressBar
            striped
            variant="secondary"
            animated
            now={(item.progress.loaded / item.progress.total) * 100}
            style={{
              height: "40px",
            }}
            label={
              formatSize(item.progress.loaded) +
              " / " +
              formatSize(item.progress.total)
            }
          ></ProgressBar>
        </div>
      </>
    );
  } else if (item.state === "uploaded") {
    content = (
      <>
        <div className="col col-md-12 col-sm-12 col-xs-12">
          <div className="text-bg-light border-success text-success rounded border p-2">
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
        <div className="col col-md-2 col-sm-3 col-xs-1  d-flex align-items-center justify-content-center">
          {removeButton}
        </div>
      </>
    );
  } else if (item.state === "queued") {
    content = (
      <div className="col col-md-12 col-sm-12 col-xs-12">
        {/* <input
          className="form-control form-control"
          ref={input_ref}
          type="text"
          id="formFileMultiple"
          style={{
            width: "100%",
          }}
          disabled
          placeholder={`Queued: ${item.file.name}`}
        /> */}
        <div className="text-bg-light text-secondary d-flex justify-content-between rounded border p-2">
          <span>
            Queued: {item.file.name.substr(0, 40)}
            {item.file.name.length > 40 ? "..." : ""}
          </span>
          <span className="text-secondary">{formatSize(item.file.size)}</span>
        </div>
      </div>
    );
  }

  return <div className="row gy-2 gx-3 mb-3">{content}</div>;
}
