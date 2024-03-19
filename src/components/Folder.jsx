export default function Folder({ name, onDrop, onDragOver, children }) {
  return (
    <div className='folder' onDrop={onDrop} onDragOver={onDragOver}>
      {name}
      {children}
    </div>
  );
}
