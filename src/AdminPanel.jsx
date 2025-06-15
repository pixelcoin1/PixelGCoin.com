import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useContractWrite,
  usePrepareContractWrite
} from "wagmi";
import { InjectedConnector } from "@wagmi/core/connectors/injected";

const CONTRACT_ADDRESS = "0x7C7fdB3013C0786f5C84d51dC05b999AF1759Cd7";
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "monthsLocked", "type": "uint256" }
    ],
    "name": "lockAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function AdminPanel() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();

  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [lockAddress, setLockAddress] = useState("");
  const [lockMonths, setLockMonths] = useState("");

  const { config: mintConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "mint",
    args: [mintTo, BigInt(mintAmount || "0")]
  });
  const { write: mintWrite } = useContractWrite(mintConfig);

  const { config: lockConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "lockAddress",
    args: [lockAddress, BigInt(lockMonths || "0")]
  });
  const { write: lockWrite } = useContractWrite(lockConfig);

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>PXG Admin Panel</h1>

      {!isConnected ? (
        <button onClick={() => connect()}>Wallet verbinden</button>
      ) : (
        <div>
          <p>Verbunden: {address}</p>
          <button onClick={() => disconnect()}>Trennen</button>
        </div>
      )}

      <div>
        <h2>Mint</h2>
        <input
          placeholder="Empfänger-Adresse"
          value={mintTo}
          onChange={(e) => setMintTo(e.target.value)}
        />
        <input
          placeholder="Betrag (z. B. 100000)"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
        />
        <button onClick={() => mintWrite?.()} disabled={!mintWrite}>
          Mint ausführen
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Adresse sperren</h2>
        <input
          placeholder="Adresse"
          value={lockAddress}
          onChange={(e) => setLockAddress(e.target.value)}
        />
        <input
          placeholder="Monate (z. B. 6)"
          value={lockMonths}
          onChange={(e) => setLockMonths(e.target.value)}
        />
        <button onClick={() => lockWrite?.()} disabled={!lockWrite}>
          Adresse sperren
        </button>
      </div>
    </div>
  );
}
