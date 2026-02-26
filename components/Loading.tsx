"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";

export default function Loading() {
    const { t } = useLanguage();
    const [dots, setDots] = useState("");

    // We get translation keys instead of raw text
    const messageKeys = ["loadMsg1", "loadMsg2", "loadMsg3", "loadMsg4"];
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const dotInterval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? "" : prev + ".");
        }, 500);

        const msgInterval = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % messageKeys.length);
        }, 3500);

        return () => {
            clearInterval(dotInterval);
            clearInterval(msgInterval);
        };
    }, []);

    return (
        <div className="card" style={{
            textAlign: "center",
            padding: "60px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            minHeight: "300px",
            justifyContent: "center"
        }}>
            <div style={{
                width: "60px",
                height: "60px",
                border: "6px solid #111",
                borderTopColor: "#FF4D4D",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                boxShadow: "4px 4px 0px #111"
            }} />
            <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

            <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "8px" }}>
                    {t("loadTitle")}{dots}
                </h2>
                <p style={{ fontSize: "1.1rem", color: "var(--secondary)", fontWeight: "600" }}>
                    {t(messageKeys[msgIndex])}
                </p>
            </div>
        </div>
    );
}
