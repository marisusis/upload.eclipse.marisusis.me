import logo from "./logo.svg";
import "./App.scss";
import React, { useRef, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";

function App() {
  let input_ref = useRef(null);
  let button_ref = useRef(null);
  let [files, setFiles] = useState([]);

  useEffect(() => {
    let input = input_ref.current;

    let onChange = (event) => {
      console.log("Files selected:", event.target.files);
      setFiles(event.target.files);
    };

    input.addEventListener("change", onChange);

    return () => {
      input.removeEventListener("change", onChange);
    };
  }, [input_ref]);

  useEffect(() => {
    let input = input_ref.current;

    let onChange = (event) => {
      console.log("Files selected:", event.target.files);
      setFiles(event.target.files);
    };

    input.addEventListener("change", onChange);

    return () => {
      input.removeEventListener("change", onChange);
    };
  }, [input_ref]);

  useEffect(() => {
    let button = button_ref.current;

    let onClick = () => {
      console.log("Uploading files...");

      if (files.length === 0) {
        console.log("No files to upload");
        return;
      }

      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        console.log("Uploading file:", file.name);
        console.debug("File:", file);

        fetch(
          "/api/upload?" +
            new URLSearchParams({
              key: "yoy",
              file: file.name,
            }),
        )
          .then((response) => {
            console.log("Response:", response);
            return response.json();
          })
          .then((data) => {
            console.log("Signed url: ", data.url);
            return fetch(data.url, {
              method: "PUT",
              body: file,
              cors: "cors",
            });
          })
          .then((response) => {
            console.log("Upload complete:", response);
            console.log("Code:", response.status);
          });
      }
    };

    button.addEventListener("click", onClick);

    return () => {
      button.removeEventListener("click", onClick);
    };
  }, [button_ref, files]);

  return (
    <Container>
      <h1>Eclipse File Upload</h1>
      <p>Node ID: ET1003</p>
      <div class="mb-3">
        <label for="formFileMultiple" className="form-label">
          Files
        </label>
        <input
          ref={input_ref}
          class="form-control"
          type="file"
          id="formFileMultiple"
          multiple
        />
      </div>
      <div class="mb-3">
        <button class="btn btn-primary" ref={button_ref}>
          Upload
        </button>
      </div>
    </Container>
  );
}

export default App;
