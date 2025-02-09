// src/App.tsx
import React, { useState } from "react";
import axios from "axios";
import { TrendingUp, Plus, X } from "lucide-react";

interface Asset {
  id: number;
  type: string;
  description: string;
  location: string;
  condition: string;
  value: number;
  loan: string;
  insurance: string;
  ownershipProof: string;
  tokenId?: string;
  privateKey: string;
}

interface CalculatorProps {
  title: string;
  children: React.ReactNode;
}

const CalculatorCard: React.FC<CalculatorProps> = ({ title, children }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
      {title}
    </h3>
    {children}
  </div>
);

const formatRupees = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-[50rem] w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 1,
      type: "Financial",
      description: "Equity shares in blue-chip companies",
      location: "NSE/BSE",
      value: 100000,
      condition: "New",
      loan: "No",
      insurance: "No",
      ownershipProof: "",
      privateKey: "",
    },
  ]);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    type: "",
    description: "",
    location: "",
    value: 0,
    condition: "",
    loan: "",
    insurance: "",
    ownershipProof: "",
    privateKey: "",
  });

  // Upload file to Pinata and update newAsset.ownershipProof with the returned IPFS hash.
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pinataMetadata", JSON.stringify({ name: file.name }));
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
        }
      );
      setNewAsset((prevAsset) => ({
        ...prevAsset,
        ownershipProof: response.data.IpfsHash,
      }));
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      alert("Error uploading ownership proof");
    }
  };

  // Call your backend to tokenize the asset.
  const tokenizeAsset = async (
    ipfsHash: string,
    value: number,
    privateKey: string
  ) => {
    try {
      const response = await axios.post("http://localhost:3001/api/tokenize", {
        ipfsHash,
        value,
        privateKey,
      });
      return response.data;
    } catch (error) {
      console.error("Error tokenizing asset:", error);
      throw error;
    }
  };

  // Add a new asset after tokenization.
  const addAsset = async () => {
    if (
      newAsset.type &&
      newAsset.description &&
      newAsset.location &&
      newAsset.value &&
      newAsset.condition &&
      newAsset.loan &&
      newAsset.insurance &&
      newAsset.ownershipProof &&
      newAsset.privateKey
    ) {
      try {
        const response = await tokenizeAsset(
          newAsset.ownershipProof,
          newAsset.value,
          newAsset.privateKey
        );

        setAssets([
          ...assets,
          {
            id: assets.length + 1,
            type: newAsset.type,
            description: newAsset.description,
            location: newAsset.location,
            value: newAsset.value,
            condition: newAsset.condition,
            loan: newAsset.loan,
            insurance: newAsset.insurance,
            ownershipProof: newAsset.ownershipProof,
            tokenId: response.tokenId, // adjust based on your API response structure
            privateKey: newAsset.privateKey,
          } as Asset,
        ]);

        // Reset new asset form
        setNewAsset({
          type: "",
          description: "",
          location: "",
          value: 0,
          condition: "",
          loan: "",
          insurance: "",
          ownershipProof: "",
          privateKey: "",
        });
        setIsModalOpen(false);
      } catch (error) {
        console.error("Asset tokenization failed:", error);
        alert("Failed to tokenize asset");
      }
    } else {
      alert("Please fill in all the fields");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
        <TrendingUp className="h-6 w-6 mr-2 text-indigo-500" />
        Manage Your Assets
      </h2>

      {/* Button to open the Add Asset Modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center"
      >
        <Plus className="mr-2" /> Add New Asset
      </button>

      {/* List of Assets */}
      {assets.length > 0 ? (
        <div className="space-y-4">
          {assets.map((asset) => (
            <div key={asset.id} className="border p-4 rounded-lg shadow-sm">
              <p>
                <strong>Type:</strong> {asset.type}
              </p>
              <p>
                <strong>Description:</strong> {asset.description}
              </p>
              <p>
                <strong>Location:</strong> {asset.location}
              </p>
              <p>
                <strong>Value:</strong> {formatRupees(asset.value)}
              </p>
              <p>
                <strong>Ownership Proof (IPFS Hash):</strong>{" "}
                {asset.ownershipProof || "N/A"}
              </p>
              {asset.tokenId && (
                <p>
                  <strong>Token ID:</strong> {asset.tokenId}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No assets available.</p>
      )}

      {/* Add Asset Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Add New Asset
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {/* Asset Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Asset Type
            </label>
            <select
              value={newAsset.type}
              onChange={(e) =>
                setNewAsset({ ...newAsset, type: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Type</option>
              <option value="Property">Property</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Equipment">Equipment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={newAsset.description}
              onChange={(e) =>
                setNewAsset({ ...newAsset, description: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter asset description"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={newAsset.location}
              onChange={(e) =>
                setNewAsset({ ...newAsset, location: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter asset location"
            />
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Value (in INR)
            </label>
            <input
              type="number"
              value={newAsset.value || 0}
              onChange={(e) =>
                setNewAsset({ ...newAsset, value: Number(e.target.value) })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter asset value"
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Condition
            </label>
            <input
              type="text"
              value={newAsset.condition}
              onChange={(e) =>
                setNewAsset({ ...newAsset, condition: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter asset condition"
            />
          </div>

          {/* Loan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan
            </label>
            <input
              type="text"
              value={newAsset.loan}
              onChange={(e) =>
                setNewAsset({ ...newAsset, loan: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter loan details if any"
            />
          </div>

          {/* Insurance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Insurance
            </label>
            <input
              type="text"
              value={newAsset.insurance}
              onChange={(e) =>
                setNewAsset({ ...newAsset, insurance: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter insurance details if any"
            />
          </div>

          {/* Ownership Proof */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ownership Proof (Image)
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            {newAsset.ownershipProof && (
              <p className="text-sm text-green-500 mt-2">
                IPFS Hash: {newAsset.ownershipProof}
              </p>
            )}
          </div>

          {/* Private Key */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Private Key (for signing)
            </label>
            <input
              type="password"
              value={newAsset.privateKey}
              onChange={(e) =>
                setNewAsset({ ...newAsset, privateKey: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter your wallet private key"
            />
          </div>
        </div>
        <button
          onClick={addAsset}
          className="mt-6 w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Tokenize and Add Asset
        </button>
      </Modal>
    </div>
  );
};

export default App;
