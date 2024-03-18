import "./App.scss";
import React, { useRef, useReducer, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import UploadItem from "./components/UploadItem";
import ProgressBar from "react-bootstrap/ProgressBar";
import UploadItemList from "./components/UploadItemList";

function itemsReducer(items, action) {
  switch (action.type) {
    case "add": {
      return [
        ...items,
        {
          id: items.length > 0 ? items[items.length - 1].id + 1 : 0,
          file: null,
          progress: {
            loaded: 0,
            total: 0,
          },
          state: "idle",
        },
      ];
    }
    case "remove": {
      return items.filter((item) => item.id !== action.id);
    }
    case "update": {
      return items.map((item) => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
    }
    default: {
      console.error("Unknown action", action);
      return items;
    }
  }
}

function App() {
  let callsignInputRef = useRef(null);
  let passwordInputRef = useRef(null);
  let [uploading, setUploading] = useState(false);

  const uploadItems = async (items) => {
    for (let item of items) {
      try {
        item = {
          ...item,
          state: "uploading",
        };

        dispatch({
          type: "update",
          item: item,
        });

        let response = await fetch(
          "/api/upload?" +
            new URLSearchParams({
              key: passwordInputRef.current.value,
              user: callsignInputRef.current.value,
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
        console.error("Error uploading", e);
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

  const [items, dispatch] = useReducer(itemsReducer, [
    {
      state: "idle",
      id: 0,
      file: null,
      progress: {},
    },
  ]);

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

  const handleAddItem = () => {
    dispatch({ type: "add" });
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
        <p>Uploading...</p>
        {/* <ProgressBar
          striped
          variant="primary"
          animated
          now={uploadProgress}
          style={{
            height: "40px",
          }}
          label={`Uploading...`}
        ></ProgressBar> */}
      </>
    );
  } else {
    uploadContent = (
      <div class="d-flex justify-content-end formControl mb-1">
        <button
          class="btn center btn-lg btn-primary"
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
    >
      <h1
        className="card-header mt-5"
        style={{
          textAlign: "center",
        }}
      >
        Eclipse File Upload
      </h1>
      <div className="card mt-5">
        <div class="card-body">
          <h5 class="card-title">Welcome to the eclipse file uploader!</h5>
          <p class="card-text">
            First enter your callsign, then select the files you want to upload.
            To add additional files, click the{" "}
            <span class="text-secondary">"Add file"</span> button. When you're
            ready, click the <span class="text-primary">"Upload"</span> button
            to upload your files. If you added a field by mistake, don't worry.
            If no file is selected, the field will be ignored.
            <b> Please make sure to name your files in a descriptive manner.</b>
          </p>
          <div className="gx-5 container mb-3">
            <div className="card p-3">
              <div className="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Password
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="exampleFormControlInput1"
                  ref={passwordInputRef}
                />
              </div>
              <div className="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Callsign or Name
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
          <p class="fs-6">
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
