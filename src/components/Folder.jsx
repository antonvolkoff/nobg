export default function Folder({ name, deletable, onDrop, onDragOver, onDelete, children }) {
  return (
    <div className="folder" onDrop={onDrop} onDragOver={onDragOver}>
      <div className="folder-name">
        {name}
        {deletable && (<span className="delete" onClick={onDelete}> Delete</span>)}
      </div>
      {children}
    </div>
  );
}
