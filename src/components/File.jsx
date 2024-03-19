export default function File({ name, onClick, onDragStart, isCurrent }) {
  return (
    <div
      className={`file ${isCurrent ? 'current' : ''}`}
      onClick={onClick}
      draggable={true}
      onDragStart={onDragStart}>
      {name}
    </div>
  );
}
