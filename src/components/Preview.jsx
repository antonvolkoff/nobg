export default function Preview({ original, result }) {
  return (
    <div className="preview">
      <div>
        <div className="preview-title">Original</div>
        <div className="preview-item">
          <img src={original} />
        </div>
      </div>
      <div>
        <div className="preview-title">Processed</div>
        <div className="preview-item">
          <img src={result} />
        </div>
      </div>
    </div>
  );
}
