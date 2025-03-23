import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DISASTER_GUIDES } from "../data/disasterGuides";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import ReactMarkdown from "react-markdown";
import ChatBot from "../components/ChatBot";
import Footer from "../components/Footer";
import Header from "../components/Header"; // Import Header component

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const FloatingActionButton = ({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="fixed bottom-6 right-6 bg-yellow-400 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
    onClick={onClick}
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 10l7-7m0 0l7 7m-7-7v18"
      />
    </svg>
  </motion.button>
);

const GuideModal = ({
  guide,
  onClose,
  activeTab,
  isBookmarked,
  toggleBookmark,
  handleDownload,
}) => {
  // Get theme color based on activeTab
  const getThemeColor = () => {
    return activeTab === "pre"
      ? "bg-gradient-to-br from-blue-600 to-cyan-600"
      : "bg-gradient-to-br from-orange-600 to-rose-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${getThemeColor()} p-6`}>
          <h2 className="text-2xl font-bold text-white mb-2">{guide.title}</h2>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleBookmark(guide)}
              className="flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <span className="mr-2">
                {isBookmarked(guide) ? "🔖 Bookmarked" : "🏷️ Bookmark"}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDownload(guide)}
              className="flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <span className="mr-2">📥 Download</span>
            </motion.button>

            <WhatsappShareButton
              url={window.location.href}
              title={`Check out this disaster guide: ${guide.title}`}
              className="flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <span className="mr-2">📱 Share</span>
              <WhatsappIcon size={20} round />
            </WhatsappShareButton>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-6 text-white"
                  >
                    {children}
                  </motion.h1>
                ),
                h2: ({ children }) => (
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-xl font-semibold mt-8 mb-4 ${
                      activeTab === "pre" ? "text-blue-400" : "text-orange-400"
                    }`}
                  >
                    {children}
                  </motion.h2>
                ),
                ul: ({ children }) => (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2 my-4"
                  >
                    {children}
                  </motion.ul>
                ),
                li: ({ children }) => (
                  <motion.li
                    whileHover={{ x: 4 }}
                    className="flex items-start space-x-2"
                  >
                    <span
                      className={`mt-1 text-sm ${
                        activeTab === "pre"
                          ? "text-blue-400"
                          : "text-orange-400"
                      }`}
                    >
                      •
                    </span>
                    <span className="text-gray-300">{children}</span>
                  </motion.li>
                ),
                blockquote: ({ children }) => (
                  <motion.blockquote
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`border-l-4 ${
                      activeTab === "pre"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-orange-500 bg-orange-500/10"
                    } pl-4 py-2 my-4 text-gray-300`}
                  >
                    {children}
                  </motion.blockquote>
                ),
                code: ({ children }) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-800 rounded-lg p-4 my-4"
                  >
                    <pre className="text-gray-300">{children}</pre>
                  </motion.div>
                ),
              }}
            >
              {guide.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 text-white/80 hover:text-white"
          onClick={onClose}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const DISASTER_BOXES = {
  pre: [
    {
      id: "natural",
      title: "Natural Disaster Prevention",
      icon: "🛡️",
      items: [
        {
          id: "floods",
          name: "Flood Prevention",
          icon: "🌊",
          color: "from-sky-400 to-blue-600",
        },
        {
          id: "earthquakes",
          name: "Earthquake Preparedness",
          icon: "🏚️",
          color: "from-orange-400 to-red-600",
        },
        {
          id: "cyclones",
          name: "Cyclone Safety",
          icon: "🌪️",
          color: "from-teal-400 to-cyan-600",
        },
        {
          id: "landslides",
          name: "Landslide Prevention",
          icon: "⛰️",
          color: "from-amber-400 to-yellow-600",
        },
        {
          id: "thunderstorms",
          name: "Thunderstorm Safety",
          icon: "⛈️",
          color: "from-indigo-400 to-purple-600",
        },
        {
          id: "wildfires",
          name: "Wildfire Prevention",
          icon: "🔥",
          color: "from-red-400 to-rose-600",
        },
        {
          id: "tsunami",
          name: "Tsunami Preparedness",
          icon: "🌊",
          color: "from-cyan-400 to-blue-700",
        },
        {
          id: "volcano",
          name: "Volcanic Eruption Safety",
          icon: "🌋",
          color: "from-red-500 to-orange-700",
        },
        {
          id: "avalanche",
          name: "Avalanche Prevention",
          icon: "⛄",
          color: "from-blue-300 to-indigo-500",
        },
        {
          id: "tornado",
          name: "Tornado Safety",
          icon: "🌪️",
          color: "from-slate-400 to-gray-600",
        },
      ],
    },
    {
      id: "environmental",
      title: "Environmental Prevention",
      icon: "🌍",
      items: [
        {
          id: "drought",
          name: "Drought Preparedness",
          icon: "🏜️",
          color: "from-yellow-400 to-orange-600",
        },
        {
          id: "airQuality",
          name: "Air Quality Protection",
          icon: "😷",
          color: "from-emerald-400 to-green-600",
        },
        {
          id: "heatwave",
          name: "Heat Wave Safety",
          icon: "🌡️",
          color: "from-rose-400 to-red-600",
        },
        {
          id: "coldwave",
          name: "Cold Wave Protection",
          icon: "❄️",
          color: "from-blue-400 to-indigo-600",
        },
        {
          id: "pollution",
          name: "Pollution Control",
          icon: "🏭",
          color: "from-purple-400 to-violet-600",
        },
        {
          id: "oilSpill",
          name: "Oil Spill Prevention",
          icon: "🛢️",
          color: "from-gray-600 to-zinc-800",
        },
        {
          id: "deforestation",
          name: "Deforestation Prevention",
          icon: "🌳",
          color: "from-green-500 to-emerald-700",
        },
        {
          id: "coastalErosion",
          name: "Coastal Erosion Control",
          icon: "🏖️",
          color: "from-yellow-400 to-amber-600",
        },
      ],
    },
    {
      id: "manmade",
      title: "Man-made Disaster Prevention",
      icon: "⚠️",
      items: [
        {
          id: "industrialAccidents",
          name: "Industrial Safety",
          icon: "🏭",
          color: "from-slate-400 to-gray-600",
        },
        {
          id: "structuralCollapse",
          name: "Structural Safety",
          icon: "🏗️",
          color: "from-zinc-400 to-neutral-600",
        },
        {
          id: "terroristAttacks",
          name: "Public Safety",
          icon: "🚨",
          color: "from-red-500 to-rose-700",
        },
      ],
    },
    {
      id: "health",
      title: "Health Crisis Prevention",
      icon: "🏥",
      items: [
        {
          id: "pandemic",
          name: "Pandemic Preparedness",
          icon: "🦠",
          color: "from-green-400 to-emerald-600",
        },
      ],
    },
    {
      id: "technological",
      title: "Technological Disaster Prevention",
      icon: "⚡",
      items: [
        {
          id: "cyberAttack",
          name: "Cyber Attack Prevention",
          icon: "💻",
          color: "from-blue-600 to-indigo-800",
        },
        {
          id: "powerFailure",
          name: "Power Grid Protection",
          icon: "🔌",
          color: "from-yellow-500 to-amber-700",
        },
        {
          id: "nuclearIncident",
          name: "Nuclear Safety",
          icon: "☢️",
          color: "from-red-600 to-rose-800",
        },
        {
          id: "chemicalSpill",
          name: "Chemical Safety",
          icon: "⚗️",
          color: "from-green-600 to-emerald-800",
        },
      ],
    },
    {
      id: "biological",
      title: "Biological Threat Prevention",
      icon: "🧬",
      items: [
        {
          id: "epidemic",
          name: "Epidemic Prevention",
          icon: "🦠",
          color: "from-red-400 to-rose-600",
        },
        {
          id: "bioterrorism",
          name: "Bioterrorism Prevention",
          icon: "🧪",
          color: "from-purple-500 to-violet-700",
        },
        {
          id: "pestInfestation",
          name: "Pest Control",
          icon: "🐜",
          color: "from-green-400 to-emerald-600",
        },
        {
          id: "invasiveSpecies",
          name: "Invasive Species Control",
          icon: "🌿",
          color: "from-lime-400 to-green-600",
        },
      ],
    },
  ],
  post: [
    {
      id: "natural",
      title: "Natural Disaster Recovery",
      icon: "🔄",
      items: [
        {
          id: "floods",
          name: "Flood Recovery",
          icon: "💧",
          color: "from-blue-500 to-cyan-600",
        },
        {
          id: "earthquakes",
          name: "Earthquake Response",
          icon: "🏘️",
          color: "from-red-500 to-orange-600",
        },
        {
          id: "cyclones",
          name: "Cyclone Aftermath",
          icon: "🌀",
          color: "from-cyan-500 to-teal-600",
        },
        {
          id: "landslides",
          name: "Landslide Recovery",
          icon: "🏔️",
          color: "from-yellow-500 to-amber-600",
        },
        {
          id: "thunderstorms",
          name: "Storm Recovery",
          icon: "⚡",
          color: "from-purple-500 to-indigo-600",
        },
        {
          id: "wildfires",
          name: "Wildfire Recovery",
          icon: "🧯",
          color: "from-rose-500 to-red-600",
        },
        {
          id: "tsunami",
          name: "Tsunami Recovery",
          icon: "🏊",
          color: "from-blue-500 to-cyan-700",
        },
        {
          id: "volcano",
          name: "Volcanic Aftermath",
          icon: "🗻",
          color: "from-orange-500 to-red-700",
        },
        {
          id: "avalanche",
          name: "Avalanche Recovery",
          icon: "🏔️",
          color: "from-indigo-400 to-blue-600",
        },
        {
          id: "tornado",
          name: "Tornado Aftermath",
          icon: "🌪️",
          color: "from-gray-500 to-slate-700",
        },
      ],
    },
    {
      id: "environmental",
      title: "Environmental Recovery",
      icon: "🌱",
      items: [
        {
          id: "drought",
          name: "Post-Drought Recovery",
          icon: "🌿",
          color: "from-orange-500 to-yellow-600",
        },
        {
          id: "airQuality",
          name: "Air Quality Recovery",
          icon: "🌬️",
          color: "from-green-500 to-emerald-600",
        },
        {
          id: "heatwave",
          name: "Heat Wave Recovery",
          icon: "🌡️",
          color: "from-red-500 to-rose-600",
        },
        {
          id: "coldwave",
          name: "Cold Wave Recovery",
          icon: "🧊",
          color: "from-indigo-500 to-blue-600",
        },
        {
          id: "pollution",
          name: "Pollution Cleanup",
          icon: "🧹",
          color: "from-violet-500 to-purple-700",
        },
        {
          id: "oilSpill",
          name: "Oil Spill Cleanup",
          icon: "🧴",
          color: "from-zinc-500 to-gray-700",
        },
        {
          id: "deforestation",
          name: "Reforestation",
          icon: "🌱",
          color: "from-emerald-500 to-green-700",
        },
        {
          id: "coastalErosion",
          name: "Coastal Restoration",
          icon: "🏝️",
          color: "from-amber-500 to-yellow-700",
        },
      ],
    },
    {
      id: "manmade",
      title: "Man-made Disaster Response",
      icon: "🚑",
      items: [
        {
          id: "industrialAccidents",
          name: "Industrial Recovery",
          icon: "🏢",
          color: "from-gray-500 to-slate-600",
        },
        {
          id: "structuralCollapse",
          name: "Structural Recovery",
          icon: "🏗️",
          color: "from-neutral-500 to-zinc-600",
        },
        {
          id: "terroristAttacks",
          name: "Public Recovery",
          icon: "🚔",
          color: "from-rose-600 to-red-700",
        },
      ],
    },
    {
      id: "health",
      title: "Health Crisis Recovery",
      icon: "💉",
      items: [
        {
          id: "pandemic",
          name: "Pandemic Recovery",
          icon: "🏥",
          color: "from-emerald-500 to-green-600",
        },
      ],
    },
  ],
};

// Update the DisasterBox component to be more compact
const DisasterBox = ({ item, activeTab, onGuideSelect }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${item.color} p-4 shadow-lg border border-white/10 hover:border-white/20 transition-all`}
    onClick={() => onGuideSelect(item.id, activeTab)}
  >
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{item.icon}</span>
        <div>
          <h3 className="text-sm font-semibold text-white">{item.name}</h3>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === "pre"
                ? "bg-blue-500/20 text-blue-100"
                : "bg-orange-500/20 text-orange-100"
            }`}
          >
            {activeTab === "pre" ? "Prevention" : "Recovery"}
          </span>
        </div>
      </div>

      {/* Guide Preview */}
      <div className="space-y-1 mb-2">
        {DISASTER_GUIDES[activeTab][item.id]
          ?.map((guide, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 2 }}
              className="flex items-center space-x-1 text-xs text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <span>•</span>
              <span>{guide.title}</span>
            </motion.div>
          ))
          .slice(0, 2)}
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <button className="w-full py-1.5 px-3 bg-white/10 hover:bg-white/20 rounded-md text-xs text-white transition-colors">
          View Guide
        </button>
      </div>
    </div>

    {/* Background Icon */}
    <div className="absolute -bottom-4 -right-4 text-white/5 transform rotate-12">
      <span className="text-[8rem]">{item.icon}</span>
    </div>
  </motion.div>
);

// Modify the DisasterSection component's grid layout
const DisasterSection = ({ section, activeTab, onGuideSelect }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
      <span className="text-3xl">{section.icon}</span>
      {section.title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {section.items.map((item) => (
        <DisasterBox
          key={item.id}
          item={item}
          activeTab={activeTab}
          onGuideSelect={onGuideSelect}
        />
      ))}
    </div>
  </div>
);

function Mitigation() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "pre"
  );
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [bookmarks, setBookmarks] = useLocalStorage("bookmarkedGuides", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSections, setFilteredSections] = useState(
    DISASTER_BOXES[activeTab]
  );

  useEffect(() => {
    // Handle incoming disaster selection
    if (location.state?.selectedDisaster) {
      const guide =
        DISASTER_GUIDES[location.state.activeTab][
          location.state.selectedDisaster
        ]?.[0];
      if (guide) {
        setSelectedGuide(guide);
      }
    }
  }, [location.state]);

  const isBookmarked = useCallback(
    (guide) => {
      return bookmarks.some((b) => b.title === guide.title);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (guide) => {
      setBookmarks((current) => {
        const isCurrentlyBookmarked = current.some(
          (b) => b.title === guide.title
        );
        if (isCurrentlyBookmarked) {
          return current.filter((b) => b.title !== guide.title);
        } else {
          return [...current, guide];
        }
      });
    },
    [setBookmarks]
  );

  const handleDownload = useCallback((guide) => {
    const element = document.createElement("a");
    const file = new Blob([guide.content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${guide.title}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, []);

  const handleGuideSelect = useCallback((disasterId, tab) => {
    const guide = DISASTER_GUIDES[tab][disasterId]?.[0];
    if (guide) {
      setSelectedGuide(guide);
    }
  }, []);

  const handleSearch = useCallback(
    (query) => {
      const normalizedQuery = query.toLowerCase();
      setSearchQuery(query);

      const filtered = DISASTER_BOXES[activeTab]
        .map((section) => ({
          ...section,
          items: section.items.filter(
            (item) =>
              item.name.toLowerCase().includes(normalizedQuery) ||
              DISASTER_GUIDES[activeTab][item.id]?.some(
                (guide) =>
                  guide.title.toLowerCase().includes(normalizedQuery) ||
                  guide.content.toLowerCase().includes(normalizedQuery)
              )
          ),
        }))
        .filter((section) => section.items.length > 0);

      setFilteredSections(filtered);
    },
    [activeTab]
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header /> {/* Use imported Header component */}
      <main className="flex-grow container mx-auto px-6 py-8 md:ml-48">
        <div className="mb-8">
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for disasters, guides, or keywords..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-10 
                bg-[#F8F8F8] text-black
                placeholder-gray-400
                border border-gray-700 
                rounded-xl
                focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 
                transition-all duration-300"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-4">
            Disaster Management Guidelines
          </h1>
          <p className="text-gray-500 text-lg">
            Comprehensive guides for disaster preparedness and recovery
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("pre")}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "pre"
                ? "bg-yellow-400 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Prevention & Preparedness
          </button>
          <button
            onClick={() => setActiveTab("post")}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "post"
                ? "bg-yellow-400 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Recovery & Response
          </button>
        </div>

        {/* Disaster Sections */}
        <div className="space-y-12">
          {filteredSections.map((section) => (
            <DisasterSection
              key={section.id}
              section={section}
              activeTab={activeTab}
              onGuideSelect={handleGuideSelect}
            />
          ))}
        </div>

        {/* Guide Modal */}
        <AnimatePresence>
          {selectedGuide && (
            <GuideModal
              guide={selectedGuide}
              onClose={() => setSelectedGuide(null)}
              activeTab={activeTab}
              isBookmarked={isBookmarked}
              toggleBookmark={toggleBookmark}
              handleDownload={handleDownload}
            />
          )}
        </AnimatePresence>
      </main>
      <ChatBot />
      <FloatingActionButton
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
      <Footer />
      <AnimatePresence>
        {window.scrollY > 300 && (
          <FloatingActionButton
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Mitigation;