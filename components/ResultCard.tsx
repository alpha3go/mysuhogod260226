"use client";

import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import AdBanner from "./AdBanner";
import { useLanguage } from "./LanguageContext";

interface ResultCardProps {
    imageUrl: string;
    angelName: string;
    userName?: string;
    comfortMessage: string;
    fortuneMessage: string;
    luckyNumbers?: number[];
    luckyFood?: string;
    luckyOutfit?: string;
    luckyPlace?: string;
    analysisSummary?: string;
    onBack?: () => void;
    onStyleChange?: (theme: string) => Promise<string | null>;
    onRegenerate?: () => Promise<string | null>;
}

export default function ResultCard({
    imageUrl, angelName, userName, comfortMessage, fortuneMessage,
    luckyNumbers, luckyFood, luckyOutfit, luckyPlace, analysisSummary,
    onBack, onStyleChange, onRegenerate
}: ResultCardProps) {
    const { t } = useLanguage();
    const [proxyImageUrl, setProxyImageUrl] = useState(imageUrl);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [activeTheme, setActiveTheme] = useState("friend");
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const captureAreaRef = useRef<HTMLDivElement>(null); // New ref for the capture area

    const fetchAndSetProxy = async (url: string) => {
        if (!url || !url.startsWith("http")) {
            setProxyImageUrl(url); // For local or non-http images
            return;
        }
        setIsImageLoading(true);
        try {
            const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
            const blob = await res.blob();
            const localUrl = URL.createObjectURL(blob);
            setProxyImageUrl(localUrl);
        } catch (err) {
            console.error("Proxy error", err);
            setProxyImageUrl(url); // Fallback to original if proxy fails
        } finally {
            setIsImageLoading(false);
        }
    };

    useEffect(() => {
        fetchAndSetProxy(imageUrl);
    }, [imageUrl]);

    const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        link.click();
    };

    const handleManualRegenerate = async () => {
        if (isImageLoading || !onRegenerate) return;
        setIsImageLoading(true);
        const newUrl = await onRegenerate();
        if (newUrl) {
            await fetchAndSetProxy(newUrl);
        } else {
            setIsImageLoading(false);
        }
    };

    const handleThemeChange = async (theme: string) => {
        if (theme === activeTheme || isImageLoading) return;
        setActiveTheme(theme);
        if (onStyleChange) {
            setIsImageLoading(true);
            const newUrl = await onStyleChange(theme);
            if (newUrl) {
                // proxy handle will be triggered by props update but if we want instant feedback:
                await fetchAndSetProxy(newUrl);
            } else {
                setIsImageLoading(false);
            }
        }
    };

    const handleDownloadFull = async () => {
        const cardElement = document.getElementById("suhogod-result-card");
        if (!cardElement) return;

        try {
            const canvas = await html2canvas(cardElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#F4F4F0"
            });
            downloadCanvas(canvas, `My_Suhogod_${angelName.replace(/\s+/g, '_')}_Full.png`);
        } catch (err) {
            console.error("전체 이미지 저장 실패", err);
            alert(t("errorApi") + " Image Save Failed");
        }
    };

    const handleDownloadImageOnly = async () => {
        if (!imageContainerRef.current) return;

        try {
            const canvas = await html2canvas(imageContainerRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null // transparent
            });
            downloadCanvas(canvas, `My_Suhogod_${angelName.replace(/\s+/g, '_')}_Character.png`);
        } catch (err) {
            console.error("캐릭터 이미지 저장 실패", err);
            alert(t("errorApi") + " Image Save Failed");
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert(t("linkCopied"));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
            <div
                className="card result-card"
                id="suhogod-result-card"
                style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    width: "100%",
                    maxWidth: "400px"
                }}
            >
                {/* Title */}
                <div>
                    <div style={{ display: "inline-block", background: "#FFD23F", border: "3px solid #111", padding: "4px 12px", borderRadius: "20px", fontWeight: "800", fontSize: "0.9rem", marginBottom: "8px" }}>
                        {userName ? `${userName}${t("userAngelTitle")}` : t("myAngel")}
                    </div>
                    <h2 style={{ fontSize: "2rem", fontWeight: "900", letterSpacing: "-1px" }}>{angelName}</h2>
                </div>

                {/* Style Selection */}
                <div style={{ marginBottom: "0px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "12px", textAlign: "left" }}>✨ {t("styleTitle")}</h3>
                    <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
                        {[
                            { id: "friend", label: t("themeFriend") },
                            { id: "animal", label: t("themeAnimal") },
                            { id: "general", label: t("themeGeneral") }
                        ].map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => handleThemeChange(theme.id)}
                                className="btn"
                                style={{
                                    flexShrink: 0,
                                    fontSize: "0.85rem",
                                    padding: "8px 16px",
                                    background: activeTheme === theme.id ? "#FFD23F" : "#fff",
                                    border: "2px solid #111",
                                    cursor: isImageLoading ? "wait" : "pointer",
                                    boxShadow: activeTheme === theme.id ? "none" : "3px 3px 0px #111",
                                    transform: activeTheme === theme.id ? "translate(2px, 2px)" : "none"
                                }}
                            >
                                {theme.label}
                            </button>
                        ))}
                        <button
                            onClick={handleManualRegenerate}
                            className="btn"
                            disabled={isImageLoading}
                            style={{
                                flexShrink: 0,
                                fontSize: "0.85rem",
                                padding: "8px 16px",
                                background: "#fff",
                                border: "2px solid #111",
                                cursor: isImageLoading ? "wait" : "pointer",
                                boxShadow: "3px 3px 0px #111",
                                color: "#4D88FF",
                                fontWeight: "800"
                            }}
                        >
                            🔄 {t("regenerateBtn")}
                        </button>
                    </div>
                </div>

                {/* Main Image Container for Independent Capture */}
                <div
                    ref={imageContainerRef}
                    style={{
                        width: "100%",
                        aspectRatio: "1/1",
                        border: "4px solid #111",
                        borderRadius: "16px",
                        backgroundColor: "#E2E2E2",
                        boxShadow: "6px 6px 0px #111",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    {proxyImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={proxyImageUrl}
                            alt="My Suhogod"
                            crossOrigin="anonymous"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                filter: isImageLoading ? "blur(4px)" : "none",
                                transition: "filter 0.3s ease"
                            }}
                        />
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "4rem" }}>
                            👼
                        </div>
                    )}
                    {isImageLoading && (
                        <div style={{
                            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                            background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
                            zIndex: 5
                        }}>
                            <div className="loading-spinner" style={{ width: "40px", height: "40px", border: "5px solid #FFD23F", borderTopColor: "transparent", borderRadius: "50%" }}></div>
                        </div>
                    )}
                </div>

                {/* Texts */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
                    <div style={{ padding: "16px", background: "#f0f8ff", border: "3px solid #111", borderRadius: "12px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "8px", color: "#4D88FF", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>💭</span> {t("comfort")}
                        </h3>
                        <p style={{ fontWeight: "500", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                            {comfortMessage}
                        </p>
                    </div>

                    <div style={{ padding: "16px", background: "#fff5f5", border: "3px solid #111", borderRadius: "12px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "8px", color: "#FF4D4D", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>🍀</span> {t("fortune")}
                        </h3>
                        <p style={{ fontWeight: "500", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                            {fortuneMessage}
                        </p>
                    </div>

                    {/* Analysis Summary */}
                    {analysisSummary && (
                        <div style={{ padding: "16px", background: "#f8f0ff", border: "3px solid #111", borderRadius: "12px" }}>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "8px", color: "#B34DFF", display: "flex", alignItems: "center", gap: "8px" }}>
                                <span>🔮</span> {t("analysisTitle")}
                            </h3>
                            <p style={{ fontWeight: "500", lineHeight: "1.6", fontSize: "0.95rem" }}>
                                {analysisSummary}
                            </p>
                        </div>
                    )}

                    {/* Lucky Info Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div style={{ padding: "12px", background: "#fff", border: "3px solid #111", borderRadius: "12px", boxShadow: "3px 3px 0px #111" }}>
                            <div style={{ fontSize: "0.8rem", fontWeight: "800", color: "#888", marginBottom: "4px" }}>{t("luckyFoodTitle")}</div>
                            <div style={{ fontWeight: "700" }}>{luckyFood || "-"}</div>
                        </div>
                        <div style={{ padding: "12px", background: "#fff", border: "3px solid #111", borderRadius: "12px", boxShadow: "3px 3px 0px #111" }}>
                            <div style={{ fontSize: "0.8rem", fontWeight: "800", color: "#888", marginBottom: "4px" }}>{t("luckyOutfitTitle")}</div>
                            <div style={{ fontWeight: "700" }}>{luckyOutfit || "-"}</div>
                        </div>
                        <div style={{ padding: "12px", background: "#fff", border: "3px solid #111", borderRadius: "12px", boxShadow: "3px 3px 0px #111", gridColumn: "span 2" }}>
                            <div style={{ fontSize: "0.8rem", fontWeight: "800", color: "#888", marginBottom: "4px" }}>{t("luckyPlaceTitle")}</div>
                            <div style={{ fontWeight: "700" }}>{luckyPlace || "-"}</div>
                        </div>
                    </div>

                    {/* Lucky Numbers */}
                    {luckyNumbers && luckyNumbers.length > 0 && (
                        <div style={{ padding: "16px", background: "#E7FFAC", border: "3px solid #111", borderRadius: "12px", textAlign: "center" }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "12px" }}>{t("luckyNumbersTitle")}</h3>
                            <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
                                {luckyNumbers.map((num, i) => (
                                    <span key={i} style={{
                                        width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                                        background: "#fff", border: "2px solid #111", borderRadius: "50%", fontWeight: "800",
                                        boxShadow: "2px 2px 0px #111"
                                    }}>
                                        {num}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ width: "100%", maxWidth: "400px" }}>
                <AdBanner position="in-content" />
            </div>

            {/* Share Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "400px", marginTop: "16px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={handleDownloadFull} className="btn" style={{ flex: 1, background: "#06D6A0", fontSize: "1rem", padding: "14px" }}>
                        🖼️ {t("saveFull")}
                    </button>
                    <button onClick={handleDownloadImageOnly} className="btn" style={{ flex: 1, background: "#118AB2", color: "#fff", fontSize: "1rem", padding: "14px", border: "3px solid #111" }}>
                        👼 {t("saveImageOnly")}
                    </button>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    {/* Kakao share button removed */}
                    <button onClick={handleCopyLink} className="btn" style={{ flex: 1, background: "#FFD23F", border: "3px solid #111", height: "54px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        🔗 <span style={{ fontSize: "1.1rem", fontWeight: "800" }}>{t("copyLink")}</span>
                    </button>
                </div>

                {onBack && (
                    <button onClick={onBack} className="btn btn-accent" style={{ marginTop: "12px", fontSize: "1.1rem", padding: "16px" }}>
                        🔙 {t("backToHome")}
                    </button>
                )}
            </div>
        </div>
    );
}
