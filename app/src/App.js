import "./App.scss";
import React, { useRef, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import UploadItem from "./components/UploadItem";

function App() {
  let callsignInputRef = useRef(null);
  let uploadButtonRef = useRef(null);
  let addFilesButtonRef = useRef(null);
  let uploads_ref = useRef(null);

  useEffect(() => {
    let button = uploadButtonRef.current;
    const callsignInput = callsignInputRef.current;

    let onClick = () => {
      console.log(`Uploading files from ${callsignInput.value}...`);
    };

    button.addEventListener("click", onClick);

    return () => {
      button.removeEventListener("click", onClick);
    };
  }, [uploadButtonRef, callsignInputRef]);

  useEffect(() => {
    const button = addFilesButtonRef.current;

    const onClick = () => {
      console.debug("Adding file upload field...");
    };

    button.addEventListener("click", onClick);

    return () => {
      button.removeEventListener("click", onClick);
    };
  }, [addFilesButtonRef]);

  let onClose = (id) => {
    console.debug(`Creating close handler for file upload ${id}`);
    return () => {
      console.log(`Closing ${id}`);
    };
  };

  let fields = [
    <UploadItem onClose={onClose(1)} />,
    <UploadItem onClose={onClose(1)} />,
    <UploadItem onClose={onClose(1)} />,
    <UploadItem onClose={onClose(1)} />,
    <UploadItem onClose={onClose(1)} />,
  ];

  return (
    <Container>
      <div className="card">
        <h1 className="card-header">Eclipse File Upload</h1>
        <div class="card-body">
          <h5 class="card-title">Welcome to the eclipse file uploader!</h5>
          <p class="card-text">
            First enter your callsign, then select the files you want to upload.
            To add additional files, click the "Add file" button. When you're
            ready, click the "Upload" button to upload your files. If you added
            a field by mistake, don't worry. If no file is selected, the field
            will be ignored.
          </p>
          <div ref={uploads_ref} className="gx-5 container mb-3">
            <div className="card p-3">
              <div className="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Callsign
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="exampleFormControlInput1"
                  placeholder="e.g. ABC123"
                  ref={callsignInputRef}
                />
              </div>
              <div class="mb-3">
                {fields}
                <div class="mb-3">
                  <button
                    class="btn btn-sm btn-light formControl"
                    ref={addFilesButtonRef}
                  >
                    Add file
                  </button>
                </div>
              </div>
              <div class="d-flex justify-content-end formControl">
                <button
                  class="btn center btn-lg btn-primary"
                  style={{ width: "100px" }}
                  ref={uploadButtonRef}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default App;
