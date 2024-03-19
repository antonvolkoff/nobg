export default function Folder({ name, onDrop, onDragOver, children }) {
  return (
    <div className='folder' onDrop={onDrop} onDragOver={onDragOver}>
      <div className='folder-name'>{name}</div>
      {children}
    </div>
  );
}
