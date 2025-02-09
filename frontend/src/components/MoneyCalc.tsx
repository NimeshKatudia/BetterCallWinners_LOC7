import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

const PINATA_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0MTRhMDkwMC1hNDNhLTQ5NmQtOGE2NS1jNDkwNjc0NmM3ZTgiLCJlbWFpbCI6Im5pbWVzaGthdHVkaWE5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwZWExMzUzZTI2MDVlZDEzYjcxYyIsInNjb3BlZEtleVNlY3JldCI6IjE0ZDBjOWRiZWZlZWQxYWFmZDVjMTQyOGI3ZWRjMDZhZDdlNzc4ZTM4ZTk2NzY4Zjc1YmVlNmZjMGQ4NmI0ZjIiLCJleHAiOjE3NzA2MTA2NTh9.b7NCUvE6AGz3mgQ27i7k-UqcuyW9wz-FVJ8-hyu6EAY";

const App: React.FC = () => {
  const [assetType, setAssetType] = useState("Property");
  const [value, setValue] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState("");

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Upload file to Pinata (IPFS)
  const uploadToPinata = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return null;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${PINATA_JWT}`, // Hardcoded JWT
          },
        }
      );

      console.log("✅ IPFS Upload Success:", response.data);
      setIpfsHash(response.data.IpfsHash);
      return response.data.IpfsHash;
    } catch (error: any) {
      console.error("❌ Error uploading to Pinata:", error.response?.data || error.message);
      alert("Error uploading ownership proof");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!assetType || !value || !privateKey || !selectedFile) {
      alert("Please fill in all the fields");
      return;
    }

    console.log("Submitting with:", { assetType, value, privateKey, selectedFile });

    // Upload file to Pinata
    const ipfsHash = await uploadToPinata();
    if (!ipfsHash) return;

    try {
      const wallet = new ethers.Wallet(privateKey);
      const signature = await wallet.signMessage(ipfsHash);

      console.log("✅ Signed Transaction:", signature);

      alert("Asset tokenized successfully!");
    } catch (error) {
      console.error("❌ Ethereum Signing Error:", error);
      alert("Error signing transaction.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Add New Asset</h2>

        <label className="block mb-2">Asset Type</label>
        <select
          value={assetType}
          onChange={(e) => setAssetType(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option>Property</option>
          <option>Vehicle</option>
          <option>Jewelry</option>
        </select>

        <label className="block mb-2">Value (in INR)</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Ownership Proof (Image)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Private Key (for signing)</label>
        <input
          type="password"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Tokenize and Add Asset"}
        </button>
      </div>
    </div>
  );
};

export default App;
