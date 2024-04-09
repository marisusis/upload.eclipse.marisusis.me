import "./App.scss";
import React, { useRef, useReducer, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import UploadItemList from "./components/UploadItemList";
import itemsReducer from "./itemsReducer";

function App() {
  let callsignInputRef = useRef(null);
  let passwordInputRef = useRef(null);
  let [uploading, setUploading] = useState(false);
  let [currentUpload, setCurrentUpload] = useState(null);
  const [items, dispatch] = useReducer(itemsReducer, []);

  const uploadItems = async (items) => {
    for (let item of items) {
      try {
        item = {
          ...item,
          state: "uploading",
        };

        setCurrentUpload(item.file.name);

        dispatch({
          type: "update",
          item: item,
        });

        let response = await fetch(
          "/api/upload?" +
            new URLSearchParams({
              key: passwordInputRef.current.value,
              identifier: callsignInputRef.current.value.replace(" ", "_"),
              file: item.file.name,
            }),
        );

        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else if (response.status !== 200) {
          throw new Error("Internal error");
        }

        let json = await response.json();
        let xhr = new XMLHttpRequest();
        xhr.open("PUT", json.url, true);

        xhr.upload.onprogress = function (e) {
          if (e.lengthComputable) {
            dispatch({
              type: "update",
              item: {
                ...item,
                progress: {
                  loaded: e.loaded,
                  total: e.total,
                },
              },
            });
          }
        };

        xhr.send(item.file);

        await new Promise((resolve, reject) => {
          console.log("Awaiting upload");
          xhr.onload = resolve;
          xhr.onerror = reject;
        });

        dispatch({
          type: "update",
          item: {
            ...item,
            state: "uploaded",
          },
        });

        setTimeout(() => {
          dispatch({
            type: "remove",
            id: item.id,
          });
        }, 5000);
      } catch (e) {
        dispatch({
          type: "update",
          item: {
            ...item,
            state: "error",
            error: e,
          },
        });
      }
    }
  };

  const onUpload = () => {
    if (uploading) {
      return;
    }

    let populated_items = items.filter(
      (item) => item.file !== null && item.state !== "uploaded",
    );

    populated_items.forEach((item) => {
      dispatch({
        type: "update",
        item: {
          ...item,
          state: "queued",
        },
      });
    });

    uploadItems(populated_items).then(() => {
      setUploading(false);
    });

    setUploading(true);
  };

  const handleAddItem = (file) => {
    if (file) {
      dispatch({ type: "add", file: file });
    } else {
      dispatch({ type: "add" });
    }
  };

  const handleRemoveItem = (id) => {
    dispatch({ type: "remove", id: id });
  };
  const handleUpdateItem = (item) => {
    dispatch({ type: "update", item: item });
  };

  let uploadContent = <></>;

  if (uploading) {
    uploadContent = (
      <>
        <p>Uploading {currentUpload.substr(0, 50)}...</p>
      </>
    );
  } else {
    uploadContent = (
      <div className="d-flex justify-content-end formControl mb-1">
        <button
          className="btn center btn-lg btn-primary"
          style={{ width: "100px" }}
          onClick={onUpload}
        >
          Upload
        </button>
      </div>
    );
  }

  return (
    <Container
      style={{
        maxWidth: "800px",
      }}
      onDrop={(ev) => {
        ev.preventDefault();
        if (ev.dataTransfer.items) {
          // Use DataTransferItemList interface to access the file(s)
          [...ev.dataTransfer.items].forEach((item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === "file") {
              const file = item.getAsFile();
              dispatch({ type: "add", file: file });
            }
          });
        } else {
          // Use DataTransfer interface to access the file(s)
          [...ev.dataTransfer.files].forEach((file, i) => {
            dispatch({ type: "add", file: file });
          });
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      <h1
        className="card-header mt-3"
        style={{
          textAlign: "center",
        }}
      >
        Eclipse File Upload
      </h1>
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">Welcome to the eclipse file uploader!</h5>
          <p className="card-text">
            <p className="card-text">
              First, enter your callsign (preferred) or full name if you do not
              have a callsign. Then, select the files you want to upload. To add
              additional files, click the{" "}
              <span className="text-secondary">"Add file"</span> button. When
              all of your files are added, click the{" "}
              <span className="text-primary">"Upload"</span> button to upload
              your files.
              <br />
              <br />
              Please make sure to name your files using the requested
              convention:
              <br />
              <b>
                [callsign or name]_[frequency recorded in KHz]_[day of UTC month
                when the wav file starts]_[day of UTC month when the wav file
                ends].wav
              </b>
              <br />
              So, for a recording of the 7850 KHz CHU frequency at W8EDU that
              lasts from April 1 to April 15, you would name the file{" "}
              <b>w8edu_7850_1_15.wav</b>
              <br />
              <br />
              During or after your file upload,{" "}
              <a
                href="https://forms.gle/qwEaf722nB7JN7qS9"
                target="_blank"
                rel="noopener noreferrer"
              >
                please fill out this survey
              </a>{" "}
              to submit critical information about your station setup.{" "}
              <b>
                Your data submissions will not be used or credited unless you
                fill out the survey.
              </b>
              <br />
              <br />
              Please reach out to{" "}
              <a href="mailto:eclipse-research@case.edu">
                eclipse-research@case.edu
              </a>{" "}
              if you have any questions or concerns.
            </p>
          </p>
          <div className="gx-5 container mb-3">
            <div className="p-3">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Password
                </label>
                <input
                  className="form-control"
                  id="exampleFormControlInput1"
                  ref={passwordInputRef}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Callsign or Name
                </label>
                <input
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="e.g. ABC123"
                  ref={callsignInputRef}
                />
              </div>
              <div className="mb-3">
                <UploadItemList
                  items={items}
                  onRemoveItem={handleRemoveItem}
                  onUpdateItem={handleUpdateItem}
                  onAddItem={handleAddItem}
                />
              </div>

              {uploadContent}
            </div>
          </div>
          <p className="fs-6">
            <em>
              Made by <a href="https://github.com/marisusis">@marisusis</a> for
              the total solar eclipse on April 8, 2024.
            </em>
          </p>
        </div>
      </div>
    </Container>
  );
}

export default App;
