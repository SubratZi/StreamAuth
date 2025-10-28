export default function VideoList({ videos, onSelect }) {
  return (
    <div className="space-y-2">
      {videos.map(video => (
        <div
          key={video.id}
          className="p-3 bg-white rounded shadow hover:bg-blue-50 cursor-pointer"
          onClick={() => onSelect(video)}
        >
          {video.title}
        </div>
      ))}
    </div>
  );
}
