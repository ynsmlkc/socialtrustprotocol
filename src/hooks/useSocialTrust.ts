import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { SOCIAL_TRUST_CONTRACT } from '@/contracts/socialTrust';
import { parseEther, formatEther } from 'viem';

export function useSocialTrust() {
    const { address } = useAccount();
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    // --- READS ---

    // Get Staker Info (Staked Amount, Locked Amount)
    const { data: stakerData, refetch: refetchStaker } = useReadContract({
        ...SOCIAL_TRUST_CONTRACT,
        functionName: 'stakers',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    // Active Loan Info
    const { data: loanData, refetch: refetchLoan } = useReadContract({
        ...SOCIAL_TRUST_CONTRACT,
        functionName: 'activeLoans',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    // --- WRITES ---

    // Stake (Deposit)
    const stake = (amount: string) => {
        writeContract({
            ...SOCIAL_TRUST_CONTRACT,
            functionName: 'stake',
            value: parseEther(amount),
        });
    };

    // Withdraw (Unstake)
    const withdraw = (amount: string) => {
        writeContract({
            ...SOCIAL_TRUST_CONTRACT,
            functionName: 'withdraw',
            args: [parseEther(amount)],
        });
    };

    // Update Trust (Vouch)
    const updateTrust = (borrower: string, limit: string) => {
        writeContract({
            ...SOCIAL_TRUST_CONTRACT,
            functionName: 'updateTrust',
            args: [borrower as `0x${string}`, parseEther(limit)],
        });
    };

    // Borrow (Auto-pooling, no voucher needed)
    const borrow = (amount: string) => {
        writeContract({
            ...SOCIAL_TRUST_CONTRACT,
            functionName: 'borrow',
            args: [parseEther(amount)],
        });
    };

    // 4. Repay (Payable, No Args)
    const repay = (amount: string) => {
        writeContract({
            ...SOCIAL_TRUST_CONTRACT,
            functionName: 'repay',
            value: parseEther(amount),
        });
    };

    // Wait for transaction
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    // Helper to format data
    const stakedAmount = stakerData ? parseFloat(formatEther(stakerData[0])) : 0;
    const lockedAmount = stakerData ? parseFloat(formatEther(stakerData[1])) : 0;
    const availableAmount = stakedAmount - lockedAmount;

    // Loan Helper
    // loanData: [borrower, totalAmount, totalInterest, dueDate, isActive]
    const activeLoan = loanData && loanData[4] ? { // Check isActive
        totalDebt: parseFloat(formatEther(loanData[1] + loanData[2])),
        principal: parseFloat(formatEther(loanData[1])),
        interest: parseFloat(formatEther(loanData[2])),
        dueDate: Number(loanData[3]) * 1000,
    } : null;

    return {
        // Data
        stakedAmount,
        lockedAmount,
        availableAmount,
        activeLoan,

        // Actions
        stake,
        withdraw,
        updateTrust,
        borrow,
        repay,

        // Status
        isPending,
        isConfirming,
        isConfirmed,
        error, // Expose error
        refetchStaker,
        refetchLoan,
    };
};

// Hook for reading My Total Credit Limit (from all vouchers)
export function useMyCreditLimit() {
    const { address } = useAccount();
    const { data: limitData, refetch, isLoading } = useReadContract({
        ...SOCIAL_TRUST_CONTRACT,
        functionName: 'getMyCreditLimit',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    return {
        limit: limitData ? parseFloat(formatEther(limitData)) : 0,
        refetch,
        isLoading
    };
}

// Hook for checking a specific trust relation (Use 'trustLimits' mapping now)
export function useTrustLimit(voucher: string, borrower: string) {
    const { data: limitData, refetch, isLoading, isError, error } = useReadContract({
        ...SOCIAL_TRUST_CONTRACT,
        functionName: 'trustLimits', // Changed to mapping name
        args: (voucher && borrower && voucher.startsWith("0x") && borrower.startsWith("0x"))
            ? [voucher as `0x${string}`, borrower as `0x${string}`]
            : undefined,
        query: {
            enabled: !!(voucher && borrower && voucher.startsWith("0x") && borrower.startsWith("0x")),
            retry: 2,
        }
    });

    return {
        limit: limitData ? parseFloat(formatEther(limitData)) : 0,
        refetch,
        isLoading,
        isError,
        error
    };
}
