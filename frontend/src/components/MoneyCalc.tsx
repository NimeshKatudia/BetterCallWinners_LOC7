import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Plus, X } from "lucide-react";

interface Asset {
  id: number;
  type: string;
  description: string;
  location: string;
  condition: string;
  value: number;
  loan: string;
  insurance: string;
}

interface CalculatorProps {
  title: string;
  children: React.ReactNode;
}

const CalculatorCard: React.FC<CalculatorProps> = ({ title, children }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
      {title}
    </h3>
    {children}
  </div>
);

const formatRupees = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-[50rem] w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

const MoneyCalc = () => {
  const [timeframe, setTimeframe] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 1,
      type: "Financial",
      description: "Equity shares in blue-chip companies",
      location: "NSE/BSE",
      value: 100000,
      condition: "New",
      loan: "No",
      insurance: "No",
    },
    {
      id: 2,
      type: "Financial",
      description: "SIP in growth-oriented mutual funds",
      location: "AMC Account",
      value: 200000,
      condition: "New",
      loan: "No",
      insurance: "No",
    },
    {
      id: 3,
      type: "Jewelry",
      description: "24K Gold Bars",
      location: "Bank Locker",
      value: 150000,
      condition: "New",
      loan: "No",
      insurance: "No",
    },
    {
      id: 4,
      type: "Property",
      description: "3BHK Apartment in Mumbai",
      location: "Mumbai, India",
      value: 5000000,
      condition: "New",
      loan: "Yes",
      insurance: "Yes",
    },
  ]);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    type: "",
    description: "",
    location: "",
    value: 0,
    condition: "",
    loan: "",
    insurance: "",
  });

  const addAsset = () => {
    if (
      newAsset.type &&
      newAsset.description &&
      newAsset.location &&
      newAsset.value &&
      newAsset.condition &&
      newAsset.loan &&
      newAsset.insurance
    ) {
      setAssets([
        ...assets,
        {
          id: assets.length + 1,
          type: newAsset.type,
          description: newAsset.description,
          location: newAsset.location,
          value: newAsset.value,
          condition: newAsset.condition,
          loan: newAsset.loan,
          insurance: newAsset.insurance,
        },
      ]);
      setNewAsset({
        type: "",
        description: "",
        location: "",
        value: 0,
        condition: "",
        loan: "",
        insurance: "",
      });
    }
  };

  const colors = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
        <TrendingUp className="h-6 w-6 mr-2 text-indigo-500" />
        Manage Your Assets
      </h2>

      {/* Time Control and Add Asset Button */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-4">
              <label className="text-base font-medium text-gray-700 dark:text-gray-300">
                Projection Timeframe
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTimeframe(Math.max(1, timeframe - 1))}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <span className="font-bold">-</span>
                </button>
                <span className="text-sm font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full min-w-[80px] text-center">
                  {timeframe} years
                </span>
                <button
                  onClick={() => setTimeframe(Math.min(30, timeframe + 1))}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <span className="font-bold">+</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-2 left-0 w-full">
                <div className="relative">
                  {[0, 25, 50, 75, 100].map((mark) => (
                    <div
                      key={mark}
                      className="absolute top-0 w-px h-2 bg-gray-300 dark:bg-gray-600"
                      style={{ left: `${mark}%` }}
                    />
                  ))}
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={timeframe}
                onChange={(e) => setTimeframe(Number(e.target.value))}
                className="w-full h-2 appearance-none cursor-pointer bg-transparent focus:outline-none"
                style={{
                  WebkitAppearance: "none",
                  background: `linear-gradient(to right, rgb(79, 70, 229) ${
                    (timeframe / 30) * 100
                  }%, rgb(229, 231, 235) ${(timeframe / 30) * 100}%)`,
                  borderRadius: "9999px",
                }}
              />
              <style>{`
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 20px;
                  height: 20px;
                  background: #fff;
                  border: 2px solid rgb(79, 70, 229);
                  border-radius: 50%;
                  cursor: pointer;
                  transition: all 0.15s ease-in-out;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                input[type='range']::-webkit-slider-thumb:hover {
                  transform: scale(1.1);
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                }
                input[type='range']::-webkit-slider-thumb:active {
                  transform: scale(0.9);
                  background: rgb(79, 70, 229);
                }
                input[type='range']::-moz-range-thumb {
                  width: 20px;
                  height: 20px;
                  background: #fff;
                  border: 2px solid rgb(79, 70, 229);
                  border-radius: 50%;
                  cursor: pointer;
                  transition: all 0.15s ease-in-out;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                input[type='range']::-moz-range-thumb:hover {
                  transform: scale(1.1);
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                }
                input[type='range']::-moz-range-thumb:active {
                  transform: scale(0.9);
                  background: rgb(79, 70, 229);
                }
              `}</style>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
              {[1, 10, 20, 30].map((year) => (
                <button
                  key={year}
                  onClick={() => setTimeframe(year)}
                  className={`px-2 py-1 rounded transition-colors ${
                    timeframe === year
                      ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {year} {year === 1 ? "year" : "years"}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium min-w-[160px] hover:shadow-lg active:transform active:scale-95"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Assets Table */}
        <CalculatorCard title="Your Assets">
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Asset type
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Asset description
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Value (₹)
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {assets.map((asset) => {
                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {asset.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {asset.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {formatRupees(asset.value)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {asset.location}
                      </td>
                    </tr>
                  );
                })}
                {/* <tr className="bg-indigo-50 dark:bg-indigo-900/20 font-medium">
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                    Total Portfolio
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    -
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                    {formatRupees(
                      assets.reduce(
                        (sum, asset) =>
                          sum + asset.currentValue * asset.quantity,
                        0
                      )
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    -
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {formatRupees(
                      assets.reduce(
                        (sum, asset) =>
                          sum +
                          calculateFutureValue(
                            asset.currentValue * asset.quantity,
                            asset.expectedReturn,
                            timeframe
                          ),
                        0
                      )
                    )}
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </CalculatorCard>

        {/* Growth Chart */}
        {/* <CalculatorCard title="Portfolio Growth Projection">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={generateGraphData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="year"
                  label={{ value: "Years", position: "bottom", offset: -5 }}
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <YAxis
                  label={{
                    value: "Value (₹)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { textAnchor: "middle" },
                  }}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatRupees(value),
                    name === "Total" ? "Total Portfolio" : name,
                  ]}
                  labelFormatter={(label) => `Year ${label}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    padding: "8px 12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  wrapperStyle={{
                    outline: "none",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {value === "Total" ? "Total Portfolio" : value}
                    </span>
                  )}
                  wrapperStyle={{
                    paddingTop: "20px",
                  }}
                />
                {assets.map((asset, index) => (
                  <Line
                    key={asset.id}
                    type="monotone"
                    dataKey={asset.name}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 6,
                      stroke: colors[index % colors.length],
                      strokeWidth: 2,
                      fill: "white",
                    }}
                  />
                ))}
                <Line
                  type="monotone"
                  dataKey="Total"
                  stroke="#000000"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 8,
                    stroke: "#000000",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CalculatorCard> */}
      </div>

      {/* Add New Asset Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Add New Asset
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Asset Type
            </label>
            <select
              value={newAsset.type}
              onChange={(e) =>
                setNewAsset({ ...newAsset, type: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Type</option>
              <option value="Property">Property</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Equipment">Equipment</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Asset Description
            </label>
            <input
              type="text"
              value={newAsset.description}
              onChange={(e) =>
                setNewAsset({ ...newAsset, description: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Make, Model, Size, Features"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Asset Location
            </label>
            <input
              type="text"
              value={newAsset.location}
              onChange={(e) =>
                setNewAsset({ ...newAsset, location: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Market Value (₹)
            </label>
            <input
              type="number"
              value={newAsset.value}
              onChange={(e) =>
                setNewAsset({ ...newAsset, value: Number(e.target.value) })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ownership Proof
            </label>
            <input
              type="file"
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Condition
            </label>
            <select
              value={newAsset.condition}
              onChange={(e) =>
                setNewAsset({ ...newAsset, condition: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Existing Loan/Mortgage?
            </label>
            <select
              value={newAsset.loan}
              onChange={(e) =>
                setNewAsset({ ...newAsset, loan: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Insurance Policy
            </label>
            <select
              value={newAsset.insurance}
              onChange={(e) =>
                setNewAsset({ ...newAsset, insurance: e.target.value })
              }
              className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          {newAsset.insurance === "Yes" && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Insurance Document
              </label>
              <input
                type="file"
                className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          )}
        </div>
        <button
          onClick={() => {
            addAsset();
            setIsModalOpen(false);
          }}
          className="mt-6 w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Add Asset
        </button>
      </Modal>
    </div>
  );
};

export default MoneyCalc;
