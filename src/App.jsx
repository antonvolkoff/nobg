import { useState } from 'react'
import './App.css'
import { API_URL, API_KEY, BASE64_IMAGE_HEADER } from './constants'
import UploadButton from './components/UploadButton'
import loadImage, { LoadImageResult } from "blueimp-load-image"
import { v4 as uuidv4 } from 'uuid'

const defaultState = {
  images: [],
  current: null,
}

function App() {
  const [state, setState] = useState(defaultState);

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
          const current = {
            id: uuidv4(),
            name: file.name,
            original: imageBase64, 
            result: base64Result
          }
          ;
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

  const sidebarItems = state.images.map((image) => {
    return (
      <div 
        className='sidebar-item' 
        key={image.id} 
        onClick={() => handleSidebarImageClick(image)}>
        {image.name}
      </div>
    )}
  );

  return (
    <div className='app'>
      <div className='sidebar'>
        <div><UploadButton onChange={handeFileSelected} /></div>
        {sidebarItems}
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
