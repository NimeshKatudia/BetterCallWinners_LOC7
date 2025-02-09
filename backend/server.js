const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Contract ABI
const contractABI = [
  "function tokenizeAsset(string memory ipfsHash, uint256 value) external returns (uint256)",
  "function getAsset(uint256 tokenId) external view returns (tuple(string ipfsHash, uint256 value, bool isCollateralized, address lender, uint256 loanAmount, uint256 dueDate, uint256 interestRate, bool isDefaulted))",
];

// Initialize provider and contract
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, provider);

// Tokenize asset endpoint
app.post("/api/tokenize", async (req, res) => {
  try {
    const { ipfsHash, value, privateKey } = req.body;
    const signer = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.tokenizeAsset(ipfsHash, value);
    const receipt = await tx.wait();

    res.json({
      success: true,
      data: {
        tokenId: receipt.events[0].args.tokenId.toString(),
        ipfsHash,
        value,
        transactionHash: receipt.hash,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});