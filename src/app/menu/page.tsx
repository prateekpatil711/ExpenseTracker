"use client";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import axios from "axios";

export default function Menu() {
  return (
    <main>
      <h1 className="text-2xl">Expense and Finance</h1>

      <div className="Menubar">
      <Link className="links" href="/ ">Home</Link>
      <Link className="links" href="/expense">Expenses</Link>
      <Link className="links" href="/dashboard">Dashboard</Link>
      </div>
    </main>
  );
}
