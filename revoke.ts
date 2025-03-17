import {
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    clusterApiUrl,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as anchor from '@coral-xyz/anchor';

import {
    ExtensionType,
    TOKEN_2022_PROGRAM_ID,
    closeAccount,
    createInitializeMintCloseAuthorityInstruction,
    createInitializeMintInstruction,
    getMintLen,
} from "@solana/spl-token";

// Playground wallet
//   const payer = pg.wallet.keypair;

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const payer = provider.wallet as anchor.Wallet;


// Connection to devnet cluster
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Transaction signature returned from sent transaction
let transactionSignature: string;

// Generate new keypair for Mint Account
const mintKeypair = Keypair.generate();
// Address for Mint Account
const mint = mintKeypair.publicKey;
// Decimals for Mint Account
const decimals = 2;
// Authority that can mint new tokens
const mintAuthority = pg.wallet.publicKey;
// Authority that can close the Mint Account
const closeAuthority = pg.wallet.publicKey;

// Size of Mint Account with extension
const mintLen = getMintLen([ExtensionType.MintCloseAuthority]);
// Minimum lamports required for Mint Account
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

// Instruction to initialize the MintCloseAuthority Extension
const initializeMintCloseAuthorityInstruction =
    createInitializeMintCloseAuthorityInstruction(
        mint, // Mint Account address
        closeAuthority, // Designated Close Authority
        TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );

// Send transaction to close Mint Account
transactionSignature = await closeAccount(
    connection,
    payer, // Transaction fee payer
    mint, // Mint Account address
    payer.publicKey, // Account to receive lamports from closed account
    closeAuthority, // Close Authority for Mint Account
    undefined, // Additional signers
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID // Token Extension Program ID
);

console.log(
    "\nClose Mint Account:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
);
