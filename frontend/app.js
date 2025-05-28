// Global variables
let web3;
let userAccount;
let supplyChainContract;
let accessControlContract;

const SUPPLY_CHAIN_ADDRESS = "0x7670F6A56f640E0bea122D298B1de56D6161781C";
const ACCESS_CONTROL_ADDRESS = "0x2A55310Fe301313F44D1912CdBeeF2054426d8a3";


const SUPPLY_CHAIN_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_accessControlAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "addedBy",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "ProductAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum SupplyChain.Status",
				"name": "newStatus",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newLocation",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "updatedBy",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "StatusUpdated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "accessControl",
		"outputs": [
			{
				"internalType": "contract AccessControl",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			}
		],
		"name": "addProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allProductIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllProductIds",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "getProductDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "currentLocation",
				"type": "string"
			},
			{
				"internalType": "enum SupplyChain.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "addedBy",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum SupplyChain.Status",
				"name": "_status",
				"type": "uint8"
			}
		],
		"name": "getStatusString",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalProducts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "productCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "currentLocation",
				"type": "string"
			},
			{
				"internalType": "enum SupplyChain.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "addedBy",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "enum SupplyChain.Status",
				"name": "_newStatus",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "_newLocation",
				"type": "string"
			}
		],
		"name": "updateStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const ACCESS_CONTROL_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "admin",
				"type": "address"
			}
		],
		"name": "AdminAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "admin",
				"type": "address"
			}
		],
		"name": "AdminRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "UserAuthorized",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "UserRevoked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_admin",
				"type": "address"
			}
		],
		"name": "addAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "admins",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "authorizeUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "authorizedUsers",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "isAdmin",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "isAuthorized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_admin",
				"type": "address"
			}
		],
		"name": "removeAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "revokeUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

// Status mapping for display
const STATUS_NAMES = {
    0: "Manufactured",
    1: "In Transit", 
    2: "At Retailer",
    3: "Sold",
    4: "Delivered"
};

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    console.log("Initializing Supply Chain DApp...");
    
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed');
        setupEventListeners();
    } else {
        showError('MetaMask is not installed. Please install MetaMask to use this DApp.');
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Connect wallet button
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    
    // Add product form
    document.getElementById('addProductForm').addEventListener('submit', addProduct);
    
    // Update status form
    document.getElementById('updateStatusForm').addEventListener('submit', updateProductStatus);
    
    // Search product button
    document.getElementById('searchProduct').addEventListener('click', getProductDetails);
    
    // Load all products button
    document.getElementById('loadAllProducts').addEventListener('click', loadAllProducts);
    
    // Access control buttons
    document.getElementById('authorizeUser').addEventListener('click', authorizeUser);
    document.getElementById('revokeUser').addEventListener('click', revokeUser);
}

/**
 * Connect to MetaMask wallet
 */
async function connectWallet() {
    try {
        showLoading("Connecting to MetaMask...");
        
        // Request account access
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        
        // Initialize Web3
        web3 = new Web3(window.ethereum);
        userAccount = accounts[0];
        
        // Get network info
        const networkId = await web3.eth.net.getId();
        const networkName = getNetworkName(networkId);
        
        // Update UI
        updateWalletInfo(userAccount, networkName);
        
        // Initialize contracts
        initializeContracts();
        
        showSuccess("Wallet connected successfully!");
        
    } catch (error) {
        console.error("Error connecting wallet:", error);
        showError("Failed to connect wallet: " + error.message);
    }
}

/**
 * Initialize smart contracts
 */
function initializeContracts() {
    try {
        // Initialize contracts (You need to replace with actual addresses and ABIs)
        if (SUPPLY_CHAIN_ADDRESS !== "YOUR_SUPPLY_CHAIN_CONTRACT_ADDRESS_HERE" && SUPPLY_CHAIN_ABI.length > 0) {
            supplyChainContract = new web3.eth.Contract(SUPPLY_CHAIN_ABI, SUPPLY_CHAIN_ADDRESS);
            accessControlContract = new web3.eth.Contract(ACCESS_CONTROL_ABI, ACCESS_CONTROL_ADDRESS);
            console.log("Contracts initialized successfully");
        } else {
            showError("Please update contract addresses and ABIs in the JavaScript file");
        }
    } catch (error) {
        console.error("Error initializing contracts:", error);
        showError("Failed to initialize contracts");
    }
}

/**
 * Add a new product to the supply chain
 */
async function addProduct(event) {
    event.preventDefault();
    
    if (!supplyChainContract) {
        showError("Contract not initialized. Please connect wallet and check contract addresses.");
        return;
    }
    
    try {
        // Get form data
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productLocation = document.getElementById('productLocation').value;
        
        // Validate inputs
        if (!productName || !productDescription || !productLocation) {
            showError("Please fill in all required fields");
            return;
        }
        
        showLoading("Adding product to blockchain...");
        
        // Call smart contract function
        const result = await supplyChainContract.methods
            .addProduct(productName, productDescription, productLocation)
            .send({ from: userAccount });
        
        // Show success message
        showSuccess(`Product added successfully! Transaction Hash: ${result.transactionHash}`);
        
        // Clear form
        document.getElementById('addProductForm').reset();
        
        // Update transaction status
        updateTransactionStatus(result.transactionHash, "Product Added");
        
    } catch (error) {
        console.error("Error adding product:", error);
        showError("Failed to add product: " + error.message);
    }
}

/**
 * Update product status and location
 */
async function updateProductStatus(event) {
    event.preventDefault();
    
    if (!supplyChainContract) {
        showError("Contract not initialized. Please connect wallet and check contract addresses.");
        return;
    }
    
    try {
        // Get form data
        const productId = document.getElementById('updateProductId').value;
        const newStatus = document.getElementById('newStatus').value;
        const newLocation = document.getElementById('newLocation').value;
        
        // Validate inputs
        if (!productId || newStatus === "" || !newLocation) {
            showError("Please fill in all required fields");
            return;
        }
        
        showLoading("Updating product status...");
        
        // Call smart contract function
        const result = await supplyChainContract.methods
            .updateStatus(productId, newStatus, newLocation)
            .send({ from: userAccount });
        
        // Show success message
        showSuccess(`Product status updated successfully! Transaction Hash: ${result.transactionHash}`);
        
        // Clear form
        document.getElementById('updateStatusForm').reset();
        
        // Update transaction status
        updateTransactionStatus(result.transactionHash, "Status Updated");
        
    } catch (error) {
        console.error("Error updating product status:", error);
        showError("Failed to update product status: " + error.message);
    }
}

/**
 * Get product details by ID
 */
async function getProductDetails() {
    if (!supplyChainContract) {
        showError("Contract not initialized. Please connect wallet and check contract addresses.");
        return;
    }
    
    try {
        const productId = document.getElementById('searchProductId').value;
        
        if (!productId) {
            showError("Please enter a product ID");
            return;
        }
        
        showLoading("Fetching product details...");
        
        // Call smart contract function
        const product = await supplyChainContract.methods
            .getProductDetails(productId)
            .call();
        
        // Display product details
        displayProductDetails(product);
        
        showSuccess("Product details loaded successfully!");
        
    } catch (error) {
        console.error("Error fetching product details:", error);
        showError("Failed to fetch product details: " + error.message);
    }
}

/**
 * Load all products
 */
async function loadAllProducts() {
    if (!supplyChainContract) {
        showError("Contract not initialized. Please connect wallet and check contract addresses.");
        return;
    }
    
    try {
        showLoading("Loading all products...");
        
        // Get total number of products
        const totalProducts = await supplyChainContract.methods.getTotalProducts().call();
        
        if (totalProducts == 0) {
            document.getElementById('allProducts').innerHTML = "<p>No products found.</p>";
            return;
        }
        
        let productsHTML = "";
        
        // Fetch details for each product
        for (let i = 1; i <= totalProducts; i++) {
            try {
                const product = await supplyChainContract.methods.getProductDetails(i).call();
                productsHTML += formatProductCard(product);
            } catch (error) {
                console.error(`Error fetching product ${i}:`, error);
            }
        }
        
        // Display all products
        document.getElementById('allProducts').innerHTML = productsHTML || "<p>No products available.</p>";
        
        showSuccess(`Loaded ${totalProducts} products successfully!`);
        
    } catch (error) {
        console.error("Error loading all products:", error);
        showError("Failed to load products: " + error.message);
    }
}

/**
 * Authorize a user (Admin only)
 */
async function authorizeUser() {
    if (!accessControlContract) {
        showError("Access Control contract not initialized.");
        return;
    }
    
    try {
        const userAddress = document.getElementById('userAddress').value;
        
        if (!userAddress || !web3.utils.isAddress(userAddress)) {
            showError("Please enter a valid Ethereum address");
            return;
        }
        
        showLoading("Authorizing user...");
        
        // Call smart contract function
        const result = await accessControlContract.methods
            .authorizeUser(userAddress)
            .send({ from: userAccount });
        
        showSuccess(`User authorized successfully! Transaction Hash: ${result.transactionHash}`);
        
        // Clear input
        document.getElementById('userAddress').value = "";
        
        // Update transaction status
        updateTransactionStatus(result.transactionHash, "User Authorized");
        
    } catch (error) {
        console.error("Error authorizing user:", error);
        showError("Failed to authorize user: " + error.message);
    }
}

/**
 * Revoke user authorization (Admin only)
 */
async function revokeUser() {
    if (!accessControlContract) {
        showError("Access Control contract not initialized.");
        return;
    }
    
    try {
        const userAddress = document.getElementById('userAddress').value;
        
        if (!userAddress || !web3.utils.isAddress(userAddress)) {
            showError("Please enter a valid Ethereum address");
            return;
        }
        
        showLoading("Revoking user access...");
        
        // Call smart contract function
        const result = await accessControlContract.methods
            .revokeUser(userAddress)
            .send({ from: userAccount });
        
        showSuccess(`User access revoked successfully! Transaction Hash: ${result.transactionHash}`);
        
        // Clear input
        document.getElementById('userAddress').value = "";
        
        // Update transaction status
        updateTransactionStatus(result.transactionHash, "User Revoked");
        
    } catch (error) {
        console.error("Error revoking user:", error);
        showError("Failed to revoke user: " + error.message);
    }
}

/**
 * Display product details in the UI
 */
function displayProductDetails(product) {
    const productDetailsDiv = document.getElementById('productDetails');
    
    const html = `
        <div class="product-item">
            <h4>Product #${product.productId}</h4>
            <p><strong>Name:</strong> ${product.name}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Current Location:</strong> ${product.currentLocation}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${STATUS_NAMES[product.status].toLowerCase().replace(' ', '')}">${STATUS_NAMES[product.status]}</span></p>
            <p><strong>Added By:</strong> ${product.addedBy}</p>
            <p><strong>Last Updated:</strong> ${new Date(product.timestamp * 1000).toLocaleString()}</p>
        </div>
    `;
    
    productDetailsDiv.innerHTML = html;
    productDetailsDiv.style.display = 'block';
}

/**
 * Format product data into a card
 */
function formatProductCard(product) {
    return `
        <div class="product-item">
            <h4>Product #${product.productId} - ${product.name}</h4>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Location:</strong> ${product.currentLocation}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${STATUS_NAMES[product.status].toLowerCase().replace(' ', '')}">${STATUS_NAMES[product.status]}</span></p>
            <p><strong>Added By:</strong> ${product.addedBy}</p>
            <p><strong>Last Updated:</strong> ${new Date(product.timestamp * 1000).toLocaleString()}</p>
        </div>
    `;
}

/**
 * Update wallet info in the UI
 */
function updateWalletInfo(address, network) {
    document.getElementById('walletAddress').textContent = address;
    document.getElementById('networkInfo').textContent = network;
    document.getElementById('walletInfo').style.display = 'block';
    document.getElementById('connectWallet').textContent = 'Connected';
    document.getElementById('connectWallet').disabled = true;
}

/**
 * Update transaction status
 */
function updateTransactionStatus(txHash, action) {
    const statusDiv = document.getElementById('transactionStatus');
    statusDiv.innerHTML = `
        <div class="success-message">
            <p><strong>Last Transaction:</strong> ${action}</p>
            <p><strong>Transaction Hash:</strong> <a href="https://sepolia.etherscan.io/tx/${txHash}" target="_blank">${txHash}</a></p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
    `;
}

/**
 * Get network name from network ID
 */
function getNetworkName(networkId) {
    const networks = {
        1: "Ethereum Mainnet",
        3: "Ropsten Testnet", 
        4: "Rinkeby Testnet",
        5: "Goerli Testnet",
        11155111: "Sepolia Testnet",
        42: "Kovan Testnet"
    };
    
    return networks[networkId] || `Unknown Network (${networkId})`;
}

/**
 * Show loading message
 */
function showLoading(message) {
    const statusDiv = document.getElementById('transactionStatus');
    statusDiv.innerHTML = `<div class="loading">${message}</div>`;
}

/**
 * Show success message
 */
function showSuccess(message) {
    const statusDiv = document.getElementById('transactionStatus');
    statusDiv.innerHTML = `<div class="success-message">${message}</div>`;
}

/**
 * Show error message
 */
function showError(message) {
    const statusDiv = document.getElementById('transactionStatus');
    statusDiv.innerHTML = `<div class="error-message">${message}</div>`;
}

// Listen for account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
            // User disconnected wallet
            location.reload();
        } else {
            // User switched accounts
            userAccount = accounts[0];
            updateWalletInfo(userAccount, "Connected");
        }
    });
    
    window.ethereum.on('chainChanged', function (chainId) {
        // User switched networks
        location.reload();
    });
}