"use client";

import { useEffect, useRef } from "react";

interface ContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function ContextMenu({
  isVisible,
  position,
  onRename,
  onDelete,
  onClose,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-300 rounded shadow-lg py-1 z-50 min-w-[120px]"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button
        onClick={onRename}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
      >
        Rename
      </button>
      <button
        onClick={onDelete}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-red-600"
      >
        Delete
      </button>
    </div>
  );
}
