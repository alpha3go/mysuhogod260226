"use client";

import { useEffect, useState } from "react";

export default function Loading() {
    const [dots, setDots] = useState("");
    const messages = [
        "별의 흐름을 읽는 중...",
        "생년월일의 숫자를 더하는 중...",
        "사주의 오행을 분석하는 중...",
        "당신만의 귀여운 수호천사를 그리는 중..."
    ];
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const dotInterval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? "" : prev + ".");
        }, 500);

        const msgInterval = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % messages.length);
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
                    잠시만 기다려주세요{dots}
                </h2>
                <p style={{ fontSize: "1.1rem", color: "var(--secondary)", fontWeight: "600" }}>
                    {messages[msgIndex]}
                </p>
            </div>
        </div>
    );
}
