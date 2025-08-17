import React, { useState } from 'react';
import axios from 'axios';

// Constants
const TYPES = [
  { label: "DPP", value: "dpps" },
  { label: "Board Paper", value: "papers" }
];
const CLASSES = ["9th", "10th", "11th", "12th"];
const SUBJECTS = [
  "mathematics",
  "physics",
  "chemistry",
  "biology"
];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// SelectBox for concise usage below
function SelectBox({ label, value, setValue, options }) {
  return (
    <select value={value} onChange={e => setValue(e.target.value)} style={selectStyle}>
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || capitalize(opt)}
        </option>
      ))}
    </select>
  );
}

export default function PDFUploader() {
  // PDF upload state
  const [fileType, setFileType] = useState("dpps");
  const [className, setClassName] = useState("10th");
  const [subject, setSubject] = useState("mathematics");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Video topic upload state
  const [videoClass, setVideoClass] = useState("10th");
  const [videoSubject, setVideoSubject] = useState("mathematics");
  const [videoTopic, setVideoTopic] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoSuccess, setVideoSuccess] = useState(false);

  // Text DPP upload state
  const [dppClass, setDppClass] = useState("10th");
  const [dppSubject, setDppSubject] = useState("mathematics");
  const [dppTitle, setDppTitle] = useState("");
  const [dppContent, setDppContent] = useState("");
  const [dppDate, setDppDate] = useState(new Date().toISOString().split('T')[0]);
  const [dppSuccess, setDppSuccess] = useState(false);

  const resetForm = () => {
    setFile(null);
    setFileUrl("");
    setUploading(false);
    setVideoTopic("");
    setVideoUrl("");
    setVideoSuccess(false);
    setDppTitle("");
    setDppContent("");
    setDppDate(new Date().toISOString().split('T')[0]);
    setDppSuccess(false);
  };

  // Handle PDF Upload
  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file.");
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setUploading(true);
      const endpoint = `http://localhost:5000/api/upload/${fileType}/${className}/${subject}`;
      const res = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFileUrl(res.data.fileUrl);
    } catch {
      alert("Upload failed. Please check your server.");
    } finally {
      setUploading(false);
    }
  };

  // Handle Video Topic Upload
  const handleVideoUpload = async () => {
    if (!videoTopic || !videoUrl) return alert("Please enter both topic and video link.");
    try {
      await axios.post("http://localhost:5000/api/upload/video", {
        className: videoClass,
        subject: videoSubject,
        topic: videoTopic,
        url: videoUrl,
      });
      setVideoSuccess(true);
      setVideoTopic("");
      setVideoUrl("");
    } catch {
      alert("❌ Failed to upload video link.");
    }
  };

  // Handle Text DPP Upload
  const handleDppUpload = async () => {
    if (!dppTitle || !dppContent || !dppDate) return alert("Please enter title, content, and date.");
    try {
      await axios.post("http://localhost:5000/api/upload/dpp", {
        className: dppClass,
        subject: dppSubject,
        title: dppTitle,
        content: dppContent,
        date: dppDate,
      });
      setDppSuccess(true);
      setDppTitle("");
      setDppContent("");
      setDppDate(new Date().toISOString().split('T')[0]);
    } catch {
      alert("❌ Failed to upload DPP.");
    }
  };

  // --- UI ---
  return (
    <div style={containerStyle}>
      {/* PDF Upload Section */}
      <h2 style={{ color: "#004aad", fontWeight: 900, marginBottom: 20 }}>📤 Upload PDF</h2>
      <div style={dropdownWrap}>
        <SelectBox label="Type" value={fileType} setValue={setFileType} options={TYPES} />
        <SelectBox label="Class" value={className} setValue={setClassName} options={CLASSES.map(e => ({ label: e, value: e }))} />
        <SelectBox label="Subject" value={subject} setValue={setSubject} options={SUBJECTS.map(sub => ({ label: capitalize(sub), value: sub }))} />
      </div>
      <input
        type="file"
        accept="application/pdf"
        onChange={e => { setFile(e.target.files[0]); setFileUrl(""); }}
        style={{ margin: "16px 0" }}
      />
      <button onClick={handleUpload} style={uploadBtnStyle} disabled={uploading || !file}>
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
      {fileUrl && (
        <div style={{ marginTop: 30 }}>
          <h4 style={{ color: "#0057b8" }}>✅ Uploaded Successfully!</h4>
          <a href={fileUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: "#22a6f1" }}>View in new tab</a>
          <iframe
            src={fileUrl + "#toolbar=0"}
            width="100%"
            height="400px"
            title="Uploaded PDF Preview"
            style={iframeStyle}
          />
        </div>
      )}

      {/* VIDEO TOPIC SECTION */}
      <hr style={{ margin: '44px 0 28px 0', borderTop: '1px dashed #ccc' }} />
      <h2 style={{ color: "#004aad", fontWeight: 900, marginBottom: 16 }}>🎥 Upload Course Video Topic</h2>
      <div style={{ ...dropdownWrap, marginBottom: 16 }}>
        <SelectBox label="Class" value={videoClass} setValue={setVideoClass} options={CLASSES.map(e => ({ label: e, value: e }))} />
        <SelectBox label="Subject" value={videoSubject} setValue={setVideoSubject} options={SUBJECTS.map(sub => ({ label: capitalize(sub), value: sub }))} />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 18 }}>
        <input
          type="text"
          placeholder="Topic name"
          value={videoTopic}
          onChange={e => setVideoTopic(e.target.value)}
          style={{ ...selectStyle, width: "240px" }}
        />
        <input
          type="url"
          placeholder="YouTube Video Link"
          value={videoUrl}
          onChange={e => setVideoUrl(e.target.value)}
          style={{ ...selectStyle, width: "280px" }}
        />
      </div>
      <button
        onClick={handleVideoUpload}
        style={{ ...uploadBtnStyle, background: "#00c897" }}
        disabled={!videoTopic || !videoUrl}
      >
        Upload Video Link
      </button>
      {videoSuccess && (
        <p style={{ color: "#00aa55", marginTop: 16 }}>
          ✅ Video has been uploaded. It will appear in the Courses Page under Grade {videoClass} &rarr; {capitalize(videoSubject)}.
        </p>
      )}

      {/* TEXT DPP SECTION */}
      <hr style={{ margin: '44px 0 28px 0', borderTop: '1px dashed #ccc' }} />
      <h2 style={{ color: "#004aad", fontWeight: 900, marginBottom: 16 }}>📝 Upload Text DPP</h2>
      <div style={{ ...dropdownWrap, marginBottom: 16 }}>
        <SelectBox label="Class" value={dppClass} setValue={setDppClass} options={CLASSES.map(e => ({ label: e, value: e }))} />
        <SelectBox label="Subject" value={dppSubject} setValue={setDppSubject} options={SUBJECTS.map(sub => ({ label: capitalize(sub), value: sub }))} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
        <input
          type="text"
          placeholder="DPP Title (e.g., Day 1: Quadratic Equations)"
          value={dppTitle}
          onChange={e => setDppTitle(e.target.value)}
          style={{ ...selectStyle, width: "100%" }}
        />
        <input
          type="date"
          value={dppDate}
          onChange={e => setDppDate(e.target.value)}
          style={{ ...selectStyle, width: "100%" }}
        />
        <textarea
          placeholder="Enter DPP content here... (Questions, problems, etc.)"
          value={dppContent}
          onChange={e => setDppContent(e.target.value)}
          style={{ ...selectStyle, width: "100%", minHeight: "120px", resize: "vertical", fontFamily: "inherit" }}
        />
      </div>
      <button
        onClick={handleDppUpload}
        style={{ ...uploadBtnStyle, background: "#ff6b35" }}
        disabled={!dppTitle || !dppContent || !dppDate}
      >
        Upload Text DPP
      </button>
      {dppSuccess && (
        <p style={{ color: "#00aa55", marginTop: 16 }}>
          ✅ Text DPP has been uploaded. It will appear in the DPPs section under Grade {dppClass} &rarr; {capitalize(dppSubject)}.
        </p>
      )}

      {(fileUrl || videoSuccess || dppSuccess) && (
        <div style={{ marginTop: 40 }}>
          <button onClick={resetForm} style={{ ...uploadBtnStyle, background: "#cfe8fa", color: "#004aad" }}>
            Upload Another
          </button>
        </div>
      )}
    </div>
  );
}

// --- STYLES ---
const containerStyle = {
  maxWidth: 540,
  margin: "48px auto",
  background: "#fff",
  borderRadius: 18,
  boxShadow: "0 4px 30px #22a6f11a",
  padding: 36,
  textAlign: "center"
};
const selectStyle = {
  padding: "9px 22px",
  border: "2px solid #cfd9f2",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "1.02em",
  color: "#003366"
};
const dropdownWrap = {
  marginBottom: 18,
  display: "flex",
  gap: 12,
  justifyContent: "center",
  flexWrap: "wrap"
};
const uploadBtnStyle = {
  padding: "11px 32px",
  background: "#22a6f1",
  color: "#fff",
  fontWeight: 800,
  fontSize: "1.08em",
  border: "none",
  borderRadius: "13px",
  boxShadow: "0 1.5px 7px #22a6f131",
  cursor: "pointer"
};
const iframeStyle = {
  margin: "18px 0",
  border: "1.8px solid #22a6f1",
  borderRadius: "10px",
  boxShadow: "0 2px 15px #22a6f122"
};
