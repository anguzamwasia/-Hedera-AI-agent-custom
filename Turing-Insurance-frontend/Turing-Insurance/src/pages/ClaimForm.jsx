import { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import pic1 from '../assets/pic1.jpg';

const ClaimForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    policyNumber: '',
    incidentDate: '',
    description: '',
    amount: '',
  });

  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [document, setDocument] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [photoURL, setPhotoURL] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [documentURL, setDocumentURL] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.size <= 20 * 1024 * 1024) {
      if (type === 'photo') setPhoto(file);
      else if (type === 'video') setVideo(file);
      else if (type === 'document') setDocument(file);
    } else {
      alert('File size must be less than 20MB');
    }
  };

  const uploadFile = (file, path) => {
    return new Promise((resolve, reject) => {
      const fileRef = ref(storage, `${path}/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedPhotoURL = '';
      let uploadedVideoURL = '';
      let uploadedDocumentURL = '';

      if (photo) {
        uploadedPhotoURL = await uploadFile(photo, 'claims/photos');
        setPhotoURL(uploadedPhotoURL);
      }

      if (video) {
        uploadedVideoURL = await uploadFile(video, 'claims/videos');
        setVideoURL(uploadedVideoURL);
      }

      if (document) {
        uploadedDocumentURL = await uploadFile(document, 'claims/documents');
        setDocumentURL(uploadedDocumentURL);
      }

      const finalData = {
        ...formData,
        photoURL: uploadedPhotoURL,
        videoURL: uploadedVideoURL,
        documentURL: uploadedDocumentURL,
      };

      console.log('📦 Submitted Claim:', finalData);
      alert('✅ Claim submitted successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: `url(${pic1})` }}
    >
      <div className="backdrop-blur-md bg-white/80 rounded-xl shadow-xl p-10 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-[#0052CC] mb-8 text-center">
          Submit Insurance Claim
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Policy Number</label>
            <input
              type="text"
              name="policyNumber"
              required
              value={formData.policyNumber}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Incident Date</label>
            <input
              type="date"
              name="incidentDate"
              required
              value={formData.incidentDate}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Claim Amount</label>
            <input
              type="number"
              name="amount"
              required
              value={formData.amount}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'photo')}
              className="mt-1"
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium">Upload Dashboard Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'video')}
              className="mt-1"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium">Upload Supporting Document</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e, 'document')}
              className="mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0052CC] text-white py-3 rounded-lg font-semibold hover:bg-[#0041a8] transition"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Submit Claim'}
          </button>
        </form>

        {/* Previews */}
        {photoURL && (
          <img
            src={photoURL}
            alt="Uploaded Photo"
            className="mt-4 rounded-lg w-full max-h-60 object-cover"
          />
        )}
        {videoURL && (
          <video
            controls
            src={videoURL}
            className="mt-4 w-full max-h-60 rounded-lg"
          />
        )}
        {documentURL && (
          <div className="mt-4">
            <a
              href={documentURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Uploaded Document
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimForm;
