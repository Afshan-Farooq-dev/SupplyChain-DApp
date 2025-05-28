// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AccessControl.sol";

/**
 * @title SupplyChain
 * @dev Main contract for supply chain product tracking
 */
contract SupplyChain {
    // Reference to AccessControl contract
    AccessControl public accessControl;
    
    // Counter for generating unique product IDs
    uint256 public productCounter;
    
    // Enum for product status
    enum Status {
        Manufactured,
        InTransit,
        AtRetailer,
        Sold,
        Delivered
    }
    
    // Struct to define Product
    struct Product {
        uint256 productId;
        string name;
        string currentLocation;
        Status status;
        address addedBy;
        uint256 timestamp;
        string description;
    }
    
    // Mapping to store all products (productId => Product)
    mapping(uint256 => Product) public products;
    
    // Array to store all product IDs for easy iteration
    uint256[] public allProductIds;
    
    // Events to log actions
    event ProductAdded(
        uint256 indexed productId,
        string name,
        address indexed addedBy,
        uint256 timestamp
    );
    
    event StatusUpdated(
        uint256 indexed productId,
        Status newStatus,
        string newLocation,
        address indexed updatedBy,
        uint256 timestamp
    );
    
    // Constructor takes AccessControl contract address
    constructor(address _accessControlAddress) {
        accessControl = AccessControl(_accessControlAddress);
        productCounter = 0;
    }
    
    // Modifier: Only authorized users can execute
    modifier onlyAuthorized() {
        require(
            accessControl.isAuthorized(msg.sender),
            "Not authorized to perform this action"
        );
        _;
    }
    
    /**
     * @dev Add a new product to the supply chain
     * @param _name Product name
     * @param _description Product description
     * @param _location Initial location
     */
    function addProduct(
        string memory _name,
        string memory _description,
        string memory _location
    ) external onlyAuthorized {
        require(bytes(_name).length > 0, "Product name cannot be empty");
        require(bytes(_location).length > 0, "Location cannot be empty");
        
        // Increment counter and create new product
        productCounter++;
        
        // Create new product
        products[productCounter] = Product({
            productId: productCounter,
            name: _name,
            currentLocation: _location,
            status: Status.Manufactured,
            addedBy: msg.sender,
            timestamp: block.timestamp,
            description: _description
        });
        
        // Add to array for tracking
        allProductIds.push(productCounter);
        
        // Emit event
        emit ProductAdded(productCounter, _name, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Update product status and location
     * @param _productId Product ID to update
     * @param _newStatus New status
     * @param _newLocation New location
     */
    function updateStatus(
        uint256 _productId,
        Status _newStatus,
        string memory _newLocation
    ) external onlyAuthorized {
        require(_productId > 0 && _productId <= productCounter, "Invalid product ID");
        require(bytes(_newLocation).length > 0, "Location cannot be empty");
        
        // Get product reference
        Product storage product = products[_productId];
        
        // Update product details
        product.status = _newStatus;
        product.currentLocation = _newLocation;
        product.timestamp = block.timestamp;
        
        // Emit event
        emit StatusUpdated(_productId, _newStatus, _newLocation, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get product details
     * @param _productId Product ID to query
     * @return Product details
     */
    function getProductDetails(uint256 _productId)
        external
        view
        returns (
            uint256 productId,
            string memory name,
            string memory currentLocation,
            Status status,
            address addedBy,
            uint256 timestamp,
            string memory description
        )
    {
        require(_productId > 0 && _productId <= productCounter, "Invalid product ID");
        
        Product memory product = products[_productId];
        
        return (
            product.productId,
            product.name,
            product.currentLocation,
            product.status,
            product.addedBy,
            product.timestamp,
            product.description
        );
    }
    
    /**
     * @dev Get all product IDs
     * @return Array of all product IDs
     */
    function getAllProductIds() external view returns (uint256[] memory) {
        return allProductIds;
    }
    
    /**
     * @dev Get total number of products
     * @return Total product count
     */
    function getTotalProducts() external view returns (uint256) {
        return productCounter;
    }
    
    /**
     * @dev Convert status enum to string
     * @param _status Status enum
     * @return String representation of status
     */
    function getStatusString(Status _status) external pure returns (string memory) {
        if (_status == Status.Manufactured) return "Manufactured";
        if (_status == Status.InTransit) return "In Transit";
        if (_status == Status.AtRetailer) return "At Retailer";
        if (_status == Status.Sold) return "Sold";
        if (_status == Status.Delivered) return "Delivered";
        return "Unknown";
    }
}