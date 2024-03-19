import { useState } from 'react'
import './App.css'
import { API_URL, API_KEY, BASE64_IMAGE_HEADER } from './constants'
import UploadButton from './components/UploadButton'
import loadImage, { LoadImageResult } from "blueimp-load-image"
import { v4 as uuidv4 } from 'uuid'

/////

const makeFolder = (name) => ({ id: uuidv4(), name });

const makeImage = ({ name, original, result, folderId }) => {
  return {
    id: uuidv4(),
    name,
    original, 
    result,
    folderId,
  };
};

const defaultFolder = makeFolder("Untitled");
const defaultState = {
  images: [],
  folders: [defaultFolder],
  current: null,
};

///////

function App() {
  const [state, setState] = useState(defaultState);
  const [draggingImageId, setDraggingImageId] = useState(null);

  const uploadImageToServer = (file) => {
    loadImage(file, {
      maxWidth: 400,
      maxHeight: 400,
      canvas: true,
    })
      .then(async (imageData) => {
        const image = imageData.image;
        const imageBase64 = image.toDataURL("image/png");
        const imageBase64Data = imageBase64.replace(BASE64_IMAGE_HEADER, "");
        const data = {
          image_file_b64: imageBase64Data,
        };
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-key": API_KEY,
          },
          body: JSON.stringify(data),
        });

        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        }

        const result = await response.json();
        const base64Result = BASE64_IMAGE_HEADER + result.result_b64;
        setState((state) => {
          const current = makeImage({
            name: file.name,
            original: imageBase64, 
            result: base64Result,
            folderId: defaultFolder.id,
          });
          return { 
            ...state, 
            current: current,
            images: [ ...state.images, current],
          };
        });
      })

      .catch((error) => {
        console.error(error);
      });
  };

  const handeFileSelected = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadImageToServer(e.target.files[0])
    } else {
      console.error("No file was picked")
    }
  }

  const handleSidebarImageClick = ({ id }) => {
    const image = state.images.find((image) => image.id == id);
    if (!image) return;

    setState((state) => ({ ...state, current: image }));
  }

  const handleCreateFolder = (e) => {
    setState((state) => {
      return ({ ...state, folders: [...state.folders, makeFolder("New Folder")] });
    });
  };

  const handleFolderDrop = (folder) => {
    setState((state) => {
      return ({
        ...state,
        images: state.images.map((image) => {
          if (image.id == draggingImageId) {
            return { ...image, folderId: folder.id };
          } else {
            return image;
          }
        })
      });
    });
  };

  const imagesByFolder = Object.groupBy(state.images, ({ folderId }) => folderId);

  const sidebarItems = state.folders.map((folder) => {
    return (<div key={folder.id} onDrop={(e) => handleFolderDrop(folder)} onDragOver={(e) => e.preventDefault()}>
      {folder.name}
      {imagesByFolder[folder.id] && imagesByFolder[folder.id].map((image) => {
        return (
          <div 
            className='sidebar-item' 
            key={image.id} 
            onClick={() => handleSidebarImageClick(image)}
            draggable={true}
            onDragStart={() => setDraggingImageId(image.id)}>
            {image.name}
          </div>
        )}
      )}
    </div>)
  });

  return (
    <div className='app'>
      <div className='sidebar'>
        <div><UploadButton onChange={handeFileSelected} /></div>
        {sidebarItems}
        <button onClick={handleCreateFolder}>Create Folder</button>
      </div>
      <div className='preview'>
        <div>
          <div>Original</div>
          <div className='preview-item'>
            {state.current && (<img src={state.current.original} />)}
          </div>
        </div>
        <div>
          <div>Processed</div>
          <div className='preview-item'>
            {state.current && (<img src={state.current.result} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
