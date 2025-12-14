import React from "react";
import styles from "./Logo.module.css";
import Image from "next/image";

export default function Logo() {
  return (
    <div className={styles.container} style={{marginBottom: 0}}>
      <div className={styles.logoIcon}>
        <a
          className="flex items-center gap-2"
          href="/"
          data-discover="true"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00A8E8] to-[#7B61FF] flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Hubbble Logo"
              width={164}
              height={48}
              style={{ height: 48 }}
              sizes="auto"
            />
          </div>
        </a>
      </div>
    </div>
  );
}
