import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import "../styles/components/loading.css";

export default function Loading() {
  return (
    <div id="loading">
      <AiOutlineLoading3Quarters className="spin" size={48} color={"#fff"} />
    </div>
  );
}
