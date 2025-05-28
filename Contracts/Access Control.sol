// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AccessControl
 * @dev Contract to manage user roles and permissions
 */
contract AccessControl {
    // Owner of the contract (deployer)
    address public owner;
    
    // Mapping to store admin addresses
    mapping(address => bool) public admins;
    
    // Mapping to store authorized users (manufacturers, retailers, etc.)
    mapping(address => bool) public authorizedUsers;
    
    // Events to log role changes
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event UserAuthorized(address indexed user);
    event UserRevoked(address indexed user);
    
    // Constructor sets the deployer as owner
    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true; // Owner is also an admin
    }
    
    // Modifier: Only owner can execute
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    // Modifier: Only admin can execute
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin can perform this action");
        _;
    }
    
    // Modifier: Only authorized users can execute
    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender] || admins[msg.sender], "Not authorized");
        _;
    }
    
    /**
     * @dev Add a new admin (only owner can do this)
     * @param _admin Address to be made admin
     */
    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid address");
        require(!admins[_admin], "Already an admin");
        
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }
    
    /**
     * @dev Remove an admin (only owner can do this)
     * @param _admin Address to be removed from admin
     */
    function removeAdmin(address _admin) external onlyOwner {
        require(admins[_admin], "Not an admin");
        require(_admin != owner, "Cannot remove owner");
        
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }
    
    /**
     * @dev Authorize a user (admin can do this)
     * @param _user Address to be authorized
     */
    function authorizeUser(address _user) external onlyAdmin {
        require(_user != address(0), "Invalid address");
        require(!authorizedUsers[_user], "Already authorized");
        
        authorizedUsers[_user] = true;
        emit UserAuthorized(_user);
    }
    
    /**
     * @dev Revoke user authorization (admin can do this)
     * @param _user Address to be revoked
     */
    function revokeUser(address _user) external onlyAdmin {
        require(authorizedUsers[_user], "User not authorized");
        
        authorizedUsers[_user] = false;
        emit UserRevoked(_user);
    }
    
    /**
     * @dev Check if an address is admin
     * @param _address Address to check
     * @return bool True if admin, false otherwise
     */
    function isAdmin(address _address) external view returns (bool) {
        return admins[_address];
    }
    
    /**
     * @dev Check if an address is authorized
     * @param _address Address to check
     * @return bool True if authorized, false otherwise
     */
    function isAuthorized(address _address) external view returns (bool) {
        return authorizedUsers[_address] || admins[_address];
    }
}