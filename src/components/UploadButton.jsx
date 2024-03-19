export default function UploadButton({ onChange }) {
  return (
    <>
      <label htmlFor="add-image-input" className="button">New Image</label>
      <input
        type="file"
        onChange={onChange}
        accept=".png, .jpg, .jpeg"
        id="add-image-input"
        hidden={true}
      />
    </>
  )
}
