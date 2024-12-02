"use client";
import React, { useState } from "react";
import Personalexpense from "./personalexpense";
import Companyexpense from "./companyexpense";

export default function Home() {
  return (
    <div className="flex flex-wrap justify-center py-6">
      <Personalexpense />
      <Companyexpense />
    </div>
  );
}
