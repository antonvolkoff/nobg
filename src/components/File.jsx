export default function File({ name, onClick, onDragStart }) {
  return (
    <div
      className='file'
      onClick={onClick}
      draggable={true}
      onDragStart={onDragStart}>
      {name}
    </div>
  );
}
