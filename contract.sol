// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RWAToken is ERC721, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Asset {
        string ipfsHash;        // IPFS hash of the asset documentation
        uint256 value;         // Estimated value in ETH
        bool isCollateralized; // Whether the asset is being used as collateral
        address lender;        // Address of the lender if collateralized
        uint256 loanAmount;    // Amount of the loan if collateralized
        uint256 dueDate;      // Loan due date if collateralized
        uint256 interestRate; // Annual interest rate in basis points (1% = 100)
        bool isDefaulted;      // Whether the loan has defaulted
    }

    // Reputation scores (0-100)
    mapping(address => uint256) public reputation;
    // Mapping from token ID to Asset details
    mapping(uint256 => Asset) public assets;
    // Mapping from address to total loans given/taken
    mapping(address => uint256) public totalLoansGiven;
    mapping(address => uint256) public totalLoansTaken;

    event AssetTokenized(uint256 indexed tokenId, address indexed owner, string ipfsHash, uint256 value);
    event LoanCreated(uint256 indexed tokenId, address indexed lender, address indexed borrower, uint256 amount);
    event LoanRepaid(uint256 indexed tokenId, address indexed lender, address indexed borrower, uint256 amount);
    event AssetLiquidated(uint256 indexed tokenId, address indexed lender, address indexed borrower);
    event ReputationUpdated(address indexed user, uint256 newScore);

    constructor() ERC721("Real World Asset Token", "RWAT") Ownable(msg.sender) {}

    function tokenizeAsset(
        string memory ipfsHash,
        uint256 value
    ) external returns (uint256) {
        require(value > 0, "Asset must have positive value");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        assets[newTokenId] = Asset({
            ipfsHash: ipfsHash,
            value: value,
            isCollateralized: false,
            lender: address(0),
            loanAmount: 0,
            dueDate: 0,
            interestRate: 0,
            isDefaulted: false
        });

        _safeMint(msg.sender, newTokenId);
        
        // Initialize reputation if first time user
        if (reputation[msg.sender] == 0) {
            reputation[msg.sender] = 50; // Start with neutral reputation
        }

        emit AssetTokenized(newTokenId, msg.sender, ipfsHash, value);
        return newTokenId;
    }

    function createLoan(
        uint256 tokenId,
        uint256 loanAmount,
        uint256 durationDays,
        uint256 interestRate
    ) external payable nonReentrant {
        require(ownerOf(tokenId) != msg.sender, "Lender cannot be owner");
        require(!assets[tokenId].isCollateralized, "Asset already collateralized");
        require(msg.value == loanAmount, "Sent ETH must match loan amount");
        require(loanAmount <= assets[tokenId].value, "Loan exceeds asset value");
        require(interestRate <= 5000, "Interest rate too high"); // Max 50%
        
        Asset storage asset = assets[tokenId];
        asset.isCollateralized = true;
        asset.lender = msg.sender;
        asset.loanAmount = loanAmount;
        asset.dueDate = block.timestamp + (durationDays * 1 days);
        asset.interestRate = interestRate;

        totalLoansGiven[msg.sender] += loanAmount;
        totalLoansTaken[ownerOf(tokenId)] += loanAmount;

        // Transfer loan amount to borrower
        payable(ownerOf(tokenId)).transfer(loanAmount);

        emit LoanCreated(tokenId, msg.sender, ownerOf(tokenId), loanAmount);
    }

    function repayLoan(uint256 tokenId) external payable nonReentrant {
        Asset storage asset = assets[tokenId];
        require(asset.isCollateralized, "No active loan");
        require(!asset.isDefaulted, "Loan has defaulted");
        
        uint256 interest = calculateInterest(asset.loanAmount, asset.interestRate, asset.dueDate);
        uint256 totalDue = asset.loanAmount + interest;
        require(msg.value >= totalDue, "Insufficient repayment");

        // Reset loan data
        asset.isCollateralized = false;
        asset.lender = address(0);
        asset.loanAmount = 0;
        asset.dueDate = 0;
        asset.interestRate = 0;

        // Transfer repayment to lender
        payable(asset.lender).transfer(totalDue);

        // Update reputation
        _updateReputation(ownerOf(tokenId), true);
        _updateReputation(asset.lender, true);

        emit LoanRepaid(tokenId, asset.lender, ownerOf(tokenId), totalDue);
    }

    function liquidateAsset(uint256 tokenId) external nonReentrant {
        Asset storage asset = assets[tokenId];
        require(asset.isCollateralized, "No active loan");
        require(msg.sender == asset.lender, "Only lender can liquidate");
        require(block.timestamp > asset.dueDate, "Loan not yet due");
        require(!asset.isDefaulted, "Already defaulted");

        asset.isDefaulted = true;
        
        // Transfer asset ownership to lender
        _transfer(ownerOf(tokenId), asset.lender, tokenId);

        // Update reputation
        _updateReputation(ownerOf(tokenId), false);

        emit AssetLiquidated(tokenId, asset.lender, ownerOf(tokenId));
    }

    function calculateInterest(
        uint256 principal,
        uint256 interestRate,
        uint256 dueDate
    ) public view returns (uint256) {
        uint256 timeElapsed = block.timestamp > dueDate ? 
            dueDate - block.timestamp : block.timestamp - dueDate;
        uint256 yearInSeconds = 365 days;
        
        return (principal * interestRate * timeElapsed) / (10000 * yearInSeconds);
    }

    function _updateReputation(address user, bool positive) internal {
        uint256 currentRep = reputation[user];
        
        if (positive) {
            reputation[user] = currentRep < 90 ? currentRep + 10 : 100;
        } else {
            reputation[user] = currentRep > 10 ? currentRep - 10 : 0;
        }

        emit ReputationUpdated(user, reputation[user]);
    }

    // View functions
    function getAsset(uint256 tokenId) external view returns (Asset memory) {
        return assets[tokenId];
    }

    function getReputation(address user) external view returns (uint256) {
        return reputation[user];
    }
}