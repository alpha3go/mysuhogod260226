"use client";

import { useEffect, useState } from "react";

interface AdBannerProps {
    position: "left" | "right" | "bottom" | "in-content";
}

export default function AdBanner({ position }: AdBannerProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // 향후 구글 애드센스 등 실제 스크립트 로드 로직이 들어갈 부분
        // 예: (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, []);

    if (!isClient) return null;

    // Neo-Brutalism 디자인을 적용한 광고 플레이스홀더
    const baseStyle: React.CSSProperties = {
        backgroundColor: "#E2E2E2",
        border: "3px solid #111",
        boxShadow: "4px 4px 0px #111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#555",
        fontWeight: "800",
        fontSize: "0.9rem",
        textAlign: "center",
        padding: "8px",
        zIndex: 10
    };

    if (position === "left" || position === "right") {
        return (
            <div style={{
                ...baseStyle,
                position: "fixed",
                top: "50%",
                transform: "translateY(-50%)",
                [position]: "20px",
                width: "160px",
                height: "600px",
                display: "var(--display-desktop-ad, flex)" // 전역 CSS에서 미디어쿼리로 제어
            }} className="desktop-ad">
                <span style={{ fontSize: "2rem", marginBottom: "8px" }}>📈</span>
                <span>AD 160x600</span>
            </div>
        );
    }

    if (position === "bottom") {
        return (
            <div style={{
                ...baseStyle,
                position: "fixed",
                bottom: "0",
                left: "0",
                right: "0",
                height: "60px",
                borderBottom: "none",
                borderLeft: "none",
                borderRight: "none",
                boxShadow: "0px -4px 0px #111",
                display: "var(--display-mobile-ad, flex)"
            }} className="mobile-ad">
                <span>AD 320x50 (또는 반응형)</span>
            </div>
        );
    }

    // in-content
    return (
        <div style={{
            ...baseStyle,
            width: "100%",
            height: "100px",
            margin: "24px 0",
            borderRadius: "12px"
        }}>
            <span>스폰서 광고</span>
        </div>
    );
}
