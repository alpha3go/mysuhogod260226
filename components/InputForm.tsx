"use client";

import { useState } from "react";
import { globalRegionData } from "../lib/globalRegionData";
import { useLanguage } from "./LanguageContext";

interface InputFormProps {
    onSuccess: (data: any) => void;
    setLoading: (loading: boolean) => void;
}

export default function InputForm({ onSuccess, setLoading }: InputFormProps) {
    const { t, language } = useLanguage();

    const [birthDate, setBirthDate] = useState("");
    const [birthTime, setBirthTime] = useState("");
    const [isTimeUnknown, setIsTimeUnknown] = useState(false);

    const [country, setCountry] = useState("");
    const [region1Depth, setRegion1Depth] = useState("");
    const [region2Depth, setRegion2Depth] = useState("");

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCountry(e.target.value);
        setRegion1Depth(""); // Reset 1st depth
        setRegion2Depth(""); // Reset 2nd depth
    };

    const handleRegion1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRegion1Depth(e.target.value);
        setRegion2Depth(""); // Reset 2nd depth
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!birthDate) return alert(t("errorDate"));
        if (!isTimeUnknown && !birthTime) return alert(t("errorTime"));
        if (!country || !region1Depth || !region2Depth) return alert(t("errorPlace"));

        const payload = {
            birthDate,
            birthTime: isTimeUnknown ? null : birthTime,
            region: `${country} ${region1Depth} ${region2Depth}`,
            language // Pass current language to API for prompt translation
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
            alert(t("errorApi") + err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{ textAlign: "left" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "24px" }}>{t("title")}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Date of Birth */}
                <div>
                    <label style={{ fontWeight: "700", display: "block", marginBottom: "8px" }}>{t("birthDate")}</label>
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
                        {t("birthTime")}
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
                            {t("unknown")}
                        </label>
                    </div>
                </div>

                {/* Place of Birth */}
                <div>
                    <label style={{ fontWeight: "700", display: "block", marginBottom: "8px" }}>{t("place")}</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <select
                            className="input-field"
                            style={{ width: "100%", cursor: "pointer" }}
                            value={country}
                            onChange={handleCountryChange}
                            required
                        >
                            <option value="" disabled>{t("countrySelect")}</option>
                            {Object.keys(globalRegionData).map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            <select
                                className="input-field"
                                style={{ flex: 1, minWidth: "140px", cursor: "pointer" }}
                                value={region1Depth}
                                onChange={handleRegion1Change}
                                disabled={!country}
                                required
                            >
                                <option value="" disabled>{t("regionSelect")}</option>
                                {country && Object.keys(globalRegionData[country]).map((region) => (
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
                                <option value="" disabled>{t("citySelect")}</option>
                                {region1Depth && globalRegionData[country][region1Depth].map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-accent"
                    style={{ marginTop: "16px", width: "100%", fontSize: "1.2rem", padding: "16px" }}
                >
                    {t("submitBtn")}
                </button>
            </div>
        </form>
    );
}
