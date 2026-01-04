interface FakeDownloadButtonProps {
  url: string;
}

export default function FakeDownloadButton({ url }: FakeDownloadButtonProps) {
  const download = () => {
    if (!url) {
      alert("Paste a URL first");
      return;
    }

    // Use relative URL - nginx proxies to backend
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}`;
    
    window.open(downloadUrl, '_blank');
  };

  return (
    <button
      onClick={download}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Download Video
    </button>
  );
}