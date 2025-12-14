"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sidebar, MobileHeader } from "@/components/dashboard/sidebar";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 600;
const DEFAULT_SIDEBAR_WIDTH = 256; // w-64 = 256px

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load saved width from localStorage on mount using lazy initialization
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const savedWidth = localStorage.getItem("sidebar-width");
      if (savedWidth) {
        const width = parseInt(savedWidth, 10);
        if (width >= MIN_SIDEBAR_WIDTH && width <= MAX_SIDEBAR_WIDTH) {
          return width;
        }
      }
    }
    return DEFAULT_SIDEBAR_WIDTH;
  });
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(0);

  // Save width to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-width", sidebarWidth.toString());
  }, [sidebarWidth]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      resizeStartX.current = e.clientX;
      resizeStartWidth.current = sidebarWidth;
      setIsResizing(true);
    },
    [sidebarWidth]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - resizeStartX.current;
      const newWidth = resizeStartWidth.current + deltaX;

      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth);
      }
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex h-screen overflow-hidden flex-col md:flex-row">
      <MobileHeader />
      <div
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className="hidden md:flex shrink-0"
      >
        <Sidebar />
      </div>
      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`hidden md:block w-1 bg-sidebar-border hover:bg-sidebar-ring cursor-col-resize transition-colors shrink-0 ${
          isResizing ? "bg-sidebar-ring" : ""
        }`}
      />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto p-3 sm:p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
