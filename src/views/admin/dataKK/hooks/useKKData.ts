// src/components/data-kk/hooks/useKKData.ts
import { useState, useEffect } from "react";
import { KKItem } from "../types";
import { DEMO_DATA } from "../demo-data";

export const useKKData = () => {
  const [kkList, setKKList] = useState<KKItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("dataKK");
    if (saved && JSON.parse(saved).length > 0) {
      setKKList(JSON.parse(saved));
    } else {
      setKKList(DEMO_DATA);
      localStorage.setItem("dataKK", JSON.stringify(DEMO_DATA));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dataKK", JSON.stringify(kkList));
  }, [kkList]);

  return { kkList, setKKList };
};