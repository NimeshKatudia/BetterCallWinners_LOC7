import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  Target,
  AlertTriangle,
  Shield,
} from "lucide-react";
import {
  portfolioSummary,
  monthlyData,
  assetAllocation,
  performanceData,
  liabilities as liabilitiesData,
  recentActivity as recentActivityData,
  investmentGoals,
  riskMetrics,
  marketIndicators,
} from "../data/portfolioData";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface RiskMetrics {
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
}

interface Liability {
  type: string;
  amount: number;
  monthlyPayment: number;
  interestRate: number;
  paid: number;
  isSecured: boolean;
  description: string;
}

interface Activity {
  type: string;
  amount: string;
  date: string;
  status: string;
  category?: string;
  balance?: string;
}

// Extend RiskMetrics interface to include riskScore
interface RiskMetricsWithScore extends RiskMetrics {
  riskScore: number;
}

const Portfolio = () => {
  const liabilities = liabilitiesData as Liability[];
  const recentActivity = recentActivityData as Activity[];

  // Format currency helper - Updated for INR
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0, // INR typically doesn't use decimals
    }).format(value);
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const scaleIn = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 },
  };

  // Number animation for portfolio value
  const CountingNumber = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const duration = 1000; // 1 second animation
      const steps = 60;
      const stepValue = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [value]);

    return formatCurrency(displayValue);
  };

  // Add riskScore calculation based on other metrics
  const riskMetricsWithScore: RiskMetricsWithScore = {
    volatility: riskMetrics.volatility,
    sharpeRatio: riskMetrics.sharpeRatio,
    maxDrawdown: riskMetrics.maxDrawdown,
    beta: riskMetrics.beta,
    alpha: riskMetrics.alpha,
    riskScore: Math.round(
      (riskMetrics.volatility / 20 + riskMetrics.beta / 1.5) * 50
    ),
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Portfolio Value Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm"
          {...scaleIn}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              My Wealth
            </h2>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <Wallet className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mb-6">
            <motion.h1
              className="text-5xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <CountingNumber value={portfolioSummary.totalValue} />
            </motion.h1>
            <div className="flex items-center">
              <ArrowUpRight className="h-6 w-6 text-green-500" />
              <span className="text-green-500 text-xl font-semibold ml-1">
                +{portfolioSummary.monthlyChange}%
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                Ethereum currency growth rate
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Invested Amount
              </p>
              <div className="flex items-center mt-1">
                <span className="text-lg font-semibold text-gray-900 dark:text-white ml-1">
                  +1,234
                </span>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                YTD Return
              </p>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white ml-1">
                  +18.2%
                </span>
              </div>
            </div>
          </div>

          {/* Portfolio Health */}
          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Credit Score
            </h3>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-indigo-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Score
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                92/100
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-indigo-500 h-1.5 rounded-full"
                style={{ width: "92%" }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Asset Allocation Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          {...scaleIn}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Asset Allocation
            </h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium">
              Rebalance
            </button>
          </div>

          <div className="flex">
            {/* Pie Chart - Make it larger and more prominent */}
            <div className="flex-1 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocation.map((asset) => ({
                      ...asset,
                      // Update asset names to reflect Indian market terminology
                      name: asset.name
                        .replace("US Stocks", "Indian Stocks")
                        .replace(
                          "Vehicles && Equipment",
                          "Vehicles && Equipment"
                        )
                        .replace("US Bonds", "Indian Bonds")
                        .replace("Real Estate", "Real Estate (India)"),
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{
                          filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))",
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Allocation"]}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Asset Information - More compact layout */}
            <div className="w-48 ml-4 flex flex-col justify-center">
              {assetAllocation.map((asset) => (
                <div key={asset.name} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: asset.color }}
                      />
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {asset.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {asset.value}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                    {formatCurrency(asset.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target vs Actual - More compact */}
          <div className="border-t dark:border-gray-700 mt-4 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                Target vs Actual
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                2% variance
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-16">
                  Stocks
                </span>
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-2">
                  <div
                    className="h-1.5 bg-indigo-500 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white w-8">
                  45%
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-16">
                  Bonds
                </span>
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-2">
                  <div
                    className="h-1.5 bg-green-500 rounded-full"
                    style={{ width: "25%" }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-900 dark:text-white w-8">
                  25%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Secondary Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {/* Monthly Returns */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          variants={{
            hidden: { opacity: 0, x: -20 },
            show: { opacity: 1, x: 0 },
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monthly Returns
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(portfolioSummary.monthlyReturns)}
              </h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <span className="text-green-500 text-sm ml-1">
              +{portfolioSummary.returnsChange}%
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              vs last month
            </span>
          </div>
        </motion.div>

        {/* Risk Score */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Risk Score
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {riskMetricsWithScore.riskScore}/100
              </h3>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
            <div
              className="bg-yellow-500 h-2.5 rounded-full"
              style={{ width: `${riskMetricsWithScore.riskScore}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Goal Progress */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          variants={{
            hidden: { opacity: 0, x: 20 },
            show: { opacity: 1, x: 0 },
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loan Progress
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {portfolioSummary.goalProgress}%
              </h3>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded-lg">
              <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${portfolioSummary.goalProgress}%` }}
            ></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Investment Goals Progress */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Loans Given
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {investmentGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={goal.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {goal.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {goal.timeline}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatCurrency(goal.current)}
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatCurrency(goal.target)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      ></motion.div>

      {/* Recent Activity Section */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Track your latest financial movements
              </p>
            </div>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      activity.amount.startsWith("+")
                        ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    }`}
                  >
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.type}
                      </p>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          activity.status === "Completed"
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.date}
                      </p>
                      {activity.category && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">
                            •
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      activity.amount.startsWith("+")
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {activity.amount}
                  </p>
                  {activity.balance && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Balance: {activity.balance}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Portfolio;