import { useState, useEffect } from "react";
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  Target,
} from "lucide-react";
import TopLoadingBar from "react-top-loading-bar";

import { GoalsTab } from "./tabs/GoalsTab";

type TabType =
  | "goals"
  | "risk"
  | "income"
  | "expenses"
  | "assets"
  | "liabilities";

const MyData = () => {
  const [activeTab, setActiveTab] = useState<TabType>("goals");
  const [progress, setProgress] = useState(0);

  const tabs = [
    {
      id: "goals" as TabType,
      label: "Goals",
      icon: Target,
      activeColor: "text-emerald-600",
      hoverColor: "hover:text-emerald-500",
    },
  ];

  useEffect(() => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const newProgress = ((currentIndex + 1) / tabs.length) * 100;
    setProgress(newProgress);
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "goals":
        return <GoalsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <TopLoadingBar progress={progress} color="#4f46e5" height={4} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-700  mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return <h1></h1>;
          })}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MyData;
