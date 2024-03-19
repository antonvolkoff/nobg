export default function UploadButton({ onChange }) {
  return (
    <input
      type="file"
      onChange={onChange}
      accept=".png, .jpg, .jpeg"
    />
  )
}
