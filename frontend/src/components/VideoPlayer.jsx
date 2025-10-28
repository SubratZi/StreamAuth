export default function VideoPlayer({ video }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">{video.title}</h2>
      <video
        src={video.url}
        controls
        className="w-full rounded shadow"
      />
    </div>
  );
}