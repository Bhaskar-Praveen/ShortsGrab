type Props = {
  url: string;
  platform: string;
};

export default function FakeDownloadButton({ url }: Props) {
  const handleDownload = async () => {
    if (!url) return;

    const res = await fetch("http://localhost:4000/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "shortsgrab.mp4";
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!url}
      style={{ marginTop: "16px" }}
    >
      Download Video
    </button>
  );
}
