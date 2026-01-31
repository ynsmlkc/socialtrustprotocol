# Social Trust Protocol 🤝

**Social Trust Protocol** is a decentralized, reputation-based credit facility built on the **Monad Testnet**. It enables users to leverage their social capital to access undercollateralized loans.

Instead of over-collateralizing assets, users rely on "Vouches" (trust) from other peers. If you trust someone, you stake capital to vouch for them. If they borrow and default, your stake is slashed. If they repay, trust grows.

![Trust Circle Visualization](public/trust-circle-preview.png)
*(Note: Add a screenshot of the dashboard here)*

## 🌟 Key Features

### 1. **Social Vouching (The Trust Graph)**
-   Establish trust lines with peers on-chain.
-   **Interactive Visualization:** A dynamic Force Graph (`react-force-graph-2d`) visualizes your trust network in real-time.
-   **Real-time Updates:** The graph listens to blockchain events and updates instantly when new vouches are added.

### 2. **Guarantor Staking**
-   Users can stake **MON** tokens to become guarantors.
-   Staked funds form the liquidity pool available for borrowers.
-   You earn yield (implied) for providing liquidity and trust.

### 3. **Pooled Borrowing & Credit Lines**
-   **Smart Credit Limit:** Your borrowing limit is determined by the total value of trust vouched for you by your peers.
-   **Auto-Pooling:** Borrow directly from the protocol's liquidity pool without matching 1:1 with a specific lender.
-   **Top-up Loans:** Ability to increase your existing loan amount if your credit limit allows.

### 4. **Repayment system**
-   Transparent loan tracking with "Principal + Interest" breakdown.
-   Clear "Due Date" display for active loans.
-   Successfull repayment restores credit capacity effectively.

## 🛠 Tech Stack

-   **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
-   **Language:** TypeScript
-   **Styling:** TailwindCSS, Lucide Icons
-   **Blockchain Support:** 
    -   [Wagmi](https://wagmi.sh) (Hooks)
    -   [Viem](https://viem.sh) (Low-level Interface)
-   **Visualization:** React Force Graph 2D
-   **Network:** Monad Testnet

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   Metamask or Rabbit Wallet (configured for Monad Testnet)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ynsmlkc/socialtrustprotocol.git
    cd socialtrustprotocol
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⛓ Smart Contract

**Deployment Address (Monad Testnet):** 
`0x3E0E1e524ce4b7799E0348CD17F76DcEEA7cB3FF`

The protocol logic handles:
-   Staking/Unstaking
-   Trust Limit Management
-   Loan Issuance & Repayment
-   Interest Calculation
-   Default/Slashing Logic

## 🔮 Future Roadmap

-   **Trust Score:** Calculate a reputation score (0-100) based on repayment history.
-   **Activity Feed:** Real-time notifications for network activity.
-   **Vouch-Links:** Shareable links to request trust from friends easily.
-   **Leaderboard:** Gamification for top trust providers.

---

*Built for the Monad Ecosystem.*
