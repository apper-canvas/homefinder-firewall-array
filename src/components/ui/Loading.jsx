import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className = "" }) => {
  return (
    <div className={cn("animate-fade-in", className)}>
      {/* Header skeleton */}
      <div className="bg-surface border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-10 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex gap-6">
            {/* Filter sidebar skeleton */}
            <div className="w-80 bg-surface rounded-xl p-6 h-fit shadow-md">
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="space-y-3">
                    <div className="h-5 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Property grid skeleton */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                  <div key={item} className="bg-surface rounded-xl overflow-hidden shadow-md">
                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                      <div className="h-5 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;