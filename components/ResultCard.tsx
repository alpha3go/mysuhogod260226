"use client";

import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import AdBanner from "./AdBanner";
import { useLanguage } from "./LanguageContext";

interface ResultCardProps {
    imageUrl: string;
    angelName: string;
    comfortMessage: string;
    fortuneMessage: string;
    luckyNumbers?: number[];
    luckyFood?: string;
    luckyOutfit?: string;
    luckyPlace?: string;
    analysisSummary?: string;
}

export default function ResultCard({
    imageUrl, angelName, comfortMessage, fortuneMessage,
    luckyNumbers, luckyFood, luckyOutfit, luckyPlace, analysisSummary
}: ResultCardProps) {
    const { t } = useLanguage();
    const [proxyImageUrl, setProxyImageUrl] = useState(imageUrl);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // OpenAI Image URL to Proxy URL for CORS
        if (imageUrl && imageUrl.startsWith("http")) {
            setProxyImageUrl(`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`);
        } else {
            setProxyImageUrl(imageUrl);
        }
    }, [imageUrl]);

    const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        link.click();
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

    const handleKakaoShare = () => {
        if (window.Kakao && window.Kakao.isInitialized()) {
            window.Kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                    title: `${t("myAngel")}: ${angelName}`,
                    description: t("appDesc2"),
                    imageUrl: "https://my-suhogod-example.com/og-image.png", // Fallback OG image
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                buttons: [
                    {
                        title: t("submitBtn"),
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                        },
                    },
                ],
            });
        } else {
            alert(t("errorApi") + " Kakao Init Failed");
        }
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
                        {t("myAngel")}
                    </div>
                    <h2 style={{ fontSize: "2rem", fontWeight: "900", letterSpacing: "-1px" }}>{angelName}</h2>
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
                        <img src={proxyImageUrl} alt="My Suhogod" crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "4rem" }}>
                            👼
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

            {/* Split Download Buttons */}
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
                    <button onClick={handleKakaoShare} className="btn" style={{ flex: 1, background: "#FEE500", border: "3px solid #111" }}>
                        💬 {t("kakaoShare")}
                    </button>

                    <button onClick={handleCopyLink} className="btn" style={{ flex: 1, background: "#fff" }}>
                        🔗 {t("copyLink")}
                    </button>
                </div>
            </div>
        </div>
    );
}
