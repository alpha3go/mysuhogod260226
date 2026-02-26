"use client";

import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import AdBanner from "./AdBanner";

interface ResultCardProps {
    imageUrl: string;
    angelName: string;
    comfortMessage: string;
    fortuneMessage: string;
}

export default function ResultCard({ imageUrl, angelName, comfortMessage, fortuneMessage }: ResultCardProps) {
    const [proxyImageUrl, setProxyImageUrl] = useState(imageUrl);

    useEffect(() => {
        // OpenAI Image URL to Proxy URL for CORS
        if (imageUrl && imageUrl.startsWith("http")) {
            setProxyImageUrl(`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`);
        } else {
            setProxyImageUrl(imageUrl);
        }
    }, [imageUrl]);

    const handleDownload = async () => {
        const cardElement = document.getElementById("suhogod-result-card");
        if (!cardElement) return;

        try {
            const canvas = await html2canvas(cardElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#F4F4F0"
            });
            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `My_Suhogod_${angelName.replace(/\s+/g, '_')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("이미지 저장 실패", err);
            alert("이미지 저장에 실패했습니다.");
        }
    };

    const handleCopyLink = () => {
        // For now, copy current URL (we'd need base64 encoding for deep links later)
        navigator.clipboard.writeText(window.location.href);
        alert("링크가 클립보드에 복사되었습니다!");
    };

    const handleKakaoShare = () => {
        if (window.Kakao && window.Kakao.isInitialized()) {
            window.Kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                    title: `나만의 맞춤 수호천사: ${angelName}`,
                    description: "사주와 별자리로 나만의 수호천사를 직접 만나보세요!",
                    imageUrl: "https://my-suhogod-example.com/og-image.png", // Fallback OG image
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                buttons: [
                    {
                        title: "나도 수호천사 찾기",
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                        },
                    },
                ],
            });
        } else {
            alert("카카오톡 공유를 초기화하지 못했습니다.");
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
                        나만의 맞춤 수호천사
                    </div>
                    <h2 style={{ fontSize: "2rem", fontWeight: "900", letterSpacing: "-1px" }}>{angelName}</h2>
                </div>

                {/* Image */}
                <div style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    border: "4px solid #111",
                    borderRadius: "16px",
                    backgroundColor: "#E2E2E2",
                    boxShadow: "6px 6px 0px #111",
                    position: "relative",
                    overflow: "hidden"
                }}>
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
                            <span>💭</span> 위로의 한마디
                        </h3>
                        <p style={{ fontWeight: "500", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                            {comfortMessage}
                        </p>
                    </div>

                    <div style={{ padding: "16px", background: "#fff5f5", border: "3px solid #111", borderRadius: "12px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "8px", color: "#FF4D4D", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>🍀</span> 행운 & 주의
                        </h3>
                        <p style={{ fontWeight: "500", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                            {fortuneMessage}
                        </p>
                    </div>

                </div>
            </div>

            {/* In-Content Ad */}
            <div style={{ width: "100%", maxWidth: "400px" }}>
                <AdBanner position="in-content" />
            </div>

            {/* Share Actions - Will not be captured by html2canvas because it's outside #suhogod-result-card */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "400px", marginTop: "16px" }}>

                <button onClick={handleDownload} className="btn" style={{ background: "#06D6A0", fontSize: "1.2rem", padding: "16px" }}>
                    📥 수호천사 이미지 저장하기
                </button>

                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={handleKakaoShare} className="btn" style={{ flex: 1, background: "#FEE500", border: "3px solid #111" }}>
                        💬 카톡 공유
                    </button>

                    <button onClick={handleCopyLink} className="btn" style={{ flex: 1, background: "#fff" }}>
                        🔗 링크 복사
                    </button>
                </div>

            </div>
        </div>
    );
}
