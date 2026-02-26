"use client";

import { useState } from "react";
import { regionData } from "../lib/regionData";

interface InputFormProps {
    onSuccess: (data: any) => void;
    setLoading: (loading: boolean) => void;
}

export default function InputForm({ onSuccess, setLoading }: InputFormProps) {
    const [birthDate, setBirthDate] = useState("");
    const [birthTime, setBirthTime] = useState("");
    const [isTimeUnknown, setIsTimeUnknown] = useState(false);

    const [region1Depth, setRegion1Depth] = useState("");
    const [region2Depth, setRegion2Depth] = useState("");

    const handleRegion1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRegion1Depth(e.target.value);
        setRegion2Depth(""); // Reset 2nd depth
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!birthDate) return alert("생년월일을 입력해주세요!");
        if (!isTimeUnknown && !birthTime) return alert("태어난 시간을 입력하거나 '모름'을 체크해주세요!");
        if (!region1Depth || !region2Depth) return alert("태어난 장소를 모두 선택해주세요!");

        const payload = {
            birthDate,
            birthTime: isTimeUnknown ? null : birthTime,
            region: `${region1Depth} ${region2Depth}`,
        };

        try {
            setLoading(true);
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "API 에러");
            setLoading(false);
            onSuccess(data);
        } catch (err: any) {
            console.error(err);
            alert("오류가 발생했습니다: " + err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{ textAlign: "left" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "24px" }}>내 정보 입력하기</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Date of Birth */}
                <div>
                    <label style={{ fontWeight: "700", display: "block", marginBottom: "8px" }}>생년월일 *</label>
                    <input
                        type="date"
                        className="input-field"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                        max={new Date().toISOString().split("T")[0]} // Prevent future dates
                    />
                </div>

                {/* Time of Birth */}
                <div style={{ position: "relative" }}>
                    <label style={{ fontWeight: "700", display: "block", marginBottom: "8px" }}>
                        태어난 시간 *
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                        <input
                            type="time"
                            className="input-field"
                            style={{ flex: 1, minWidth: "150px" }}
                            value={birthTime}
                            onChange={(e) => setBirthTime(e.target.value)}
                            disabled={isTimeUnknown}
                            required={!isTimeUnknown}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", cursor: "pointer", border: "3px solid #111", padding: "10px 16px", borderRadius: "12px", background: isTimeUnknown ? "#FFD23F" : "#fff", transition: "all 0.2s" }}>
                            <input
                                type="checkbox"
                                checked={isTimeUnknown}
                                onChange={(e) => setIsTimeUnknown(e.target.checked)}
                                style={{ width: "20px", height: "20px", accentColor: "#FF4D4D" }}
                            />
                            모름
                        </label>
                    </div>
                </div>

                {/* Place of Birth */}
                <div>
                    <label style={{ fontWeight: "700", display: "block", marginBottom: "8px" }}>태어난 장소 *</label>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <select
                            className="input-field"
                            style={{ flex: 1, minWidth: "140px", cursor: "pointer" }}
                            value={region1Depth}
                            onChange={handleRegion1Change}
                            required
                        >
                            <option value="" disabled>도/광역시 선택</option>
                            {Object.keys(regionData).map((region) => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>

                        <select
                            className="input-field"
                            style={{ flex: 1, minWidth: "140px", cursor: "pointer" }}
                            value={region2Depth}
                            onChange={(e) => setRegion2Depth(e.target.value)}
                            disabled={!region1Depth}
                            required
                        >
                            <option value="" disabled>시/군/구 선택</option>
                            {region1Depth && regionData[region1Depth].map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-accent"
                    style={{ marginTop: "16px", width: "100%", fontSize: "1.2rem", padding: "16px" }}
                >
                    나만의 수호천사 그리기 👉
                </button>
            </div>
        </form>
    );
}
