export default function Preview({ original, result }) {
  if (original) {
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
  } else {
    return (
      <div className="preview">
        Click "New Image" to start
      </div>
    );
  }
}
