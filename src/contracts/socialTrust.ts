export const SOCIAL_TRUST_CONTRACT = {
    address: "0x3E0E1e524ce4b7799E0348CD17F76DcEEA7cB3FF" as `0x${string}`,
    abi: [
        // --- Events ---
        {
            "anonymous": false,
            "inputs": [
                { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
                { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
            ],
            "name": "Staked",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                { "indexed": true, "internalType": "address", "name": "voucher", "type": "address" },
                { "indexed": true, "internalType": "address", "name": "borrower", "type": "address" },
                { "indexed": false, "internalType": "uint256", "name": "limit", "type": "uint256" }
            ],
            "name": "TrustUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                { "indexed": true, "internalType": "address", "name": "borrower", "type": "address" },
                { "indexed": false, "internalType": "uint256", "name": "newTotalDebt", "type": "uint256" }
            ],
            "name": "LoanTaken",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                { "indexed": true, "internalType": "address", "name": "borrower", "type": "address" },
                { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
                { "indexed": false, "internalType": "uint256", "name": "protocolFee", "type": "uint256" }
            ],
            "name": "LoanRepaid",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                { "indexed": true, "internalType": "address", "name": "borrower", "type": "address" },
                { "indexed": false, "internalType": "uint256", "name": "slashedAmount", "type": "uint256" }
            ],
            "name": "LoanDefaulted",
            "type": "event"
        },

        // --- Functions ---
        {
            "inputs": [],
            "name": "stake",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                { "internalType": "address", "name": "borrower", "type": "address" },
                { "internalType": "uint256", "name": "limit", "type": "uint256" }
            ],
            "name": "updateTrust",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
            "name": "borrow",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "repay",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "address", "name": "borrower", "type": "address" }],
            "name": "checkDefault",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },

        // --- Views ---
        {
            "inputs": [{ "internalType": "address", "name": "borrower", "type": "address" }],
            "name": "getMyCreditLimit",
            "outputs": [{ "internalType": "uint256", "name": "totalLimit", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
            "name": "stakers",
            "outputs": [
                { "internalType": "uint256", "name": "stakedAmount", "type": "uint256" },
                { "internalType": "uint256", "name": "lockedAmount", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                { "internalType": "address", "name": "", "type": "address" },
                { "internalType": "address", "name": "", "type": "address" }
            ],
            "name": "trustLimits",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
            "name": "activeLoans",
            "outputs": [
                { "internalType": "address", "name": "borrower", "type": "address" },
                { "internalType": "uint256", "name": "totalAmount", "type": "uint256" },
                { "internalType": "uint256", "name": "totalInterest", "type": "uint256" },
                { "internalType": "uint256", "name": "dueDate", "type": "uint256" },
                { "internalType": "bool", "name": "isActive", "type": "bool" }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
} as const;
