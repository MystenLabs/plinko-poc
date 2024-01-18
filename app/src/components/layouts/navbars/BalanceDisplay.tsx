import { FaCoins } from "react-icons/fa"; // Ensure you have this import

const BalanceDisplay = ({ balance = 100, currencySymbol = "SUI" }) => {
  return (
    <div className="flex items-center justify-center bg-gray-200 rounded-lg px-3 py-2">
      <FaCoins className="text-lg mr-2" /> {/* Coin icon */}
      <span className="font-bold">{balance}</span>
      <span className="ml-1">{currencySymbol}</span>
    </div>
  );
};

export default BalanceDisplay;
