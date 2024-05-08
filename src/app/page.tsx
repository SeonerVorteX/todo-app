"use client";

import Image from "next/image";
import "./styles.css";
import Main from "@/components/main/Main";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Main />
    </>
  );
}
