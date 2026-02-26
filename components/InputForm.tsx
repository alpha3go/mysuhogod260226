"use client";

import { useState, useEffect } from "react";
import { globalRegionData } from "../lib/globalRegionData";
import { useLanguage } from "./LanguageContext";

interface HistoryRecord {
    name: string;
    birthDate: string;
    birthTime: string | null;
    isTimeUnknown: boolean;
    country: string;
    region1Depth: string;
    region2Depth: string;
}

interface InputFormProps {
    onSuccess: (data: any) => void;
    setLoading: (loading: boolean) => void;
}

export default function InputForm({ onSuccess, setLoading }: InputFormProps) {
    const { t, language } = useLanguage();

    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [birthTime, setBirthTime] = useState("");
    const [isTimeUnknown, setIsTimeUnknown] = useState(false);

    const [country, setCountry] = useState("");
    const [region1Depth, setRegion1Depth] = useState("");
    const [region2Depth, setRegion2Depth] = useState("");

    const [history, setHistory] = useState<HistoryRecord[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("suhogod-history");
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const saveToHistory = (record: HistoryRecord) => {
        const newHistory = [record, ...history.filter(h => h.name !== record.name)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem("suhogod-history", JSON.stringify(newHistory));
    };

    const loadRecord = (record: HistoryRecord) => {
        setName(record.name);
        setBirthDate(record.birthDate);
        setBirthTime(record.birthTime || "");
        setIsTimeUnknown(record.isTimeUnknown);
        setCountry(record.country);
        setRegion1Depth(record.region1Depth);
        setRegion2Depth(record.region2Depth);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem("suhogod-history");
    };

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
        if (!name) return alert(t("errorName") || "이름을 입력해주세요!");
        if (!birthDate) return alert(t("errorDate"));
        if (!isTimeUnknown && !birthTime) return alert(t("errorTime"));
        if (!country || !region1Depth || !region2Depth) return alert(t("errorPlace"));

        const payload = {
            name,
            birthDate,
            birthTime: isTimeUnknown ? null : birthTime,
            region: `${country} ${region1Depth} ${region2Depth}`,
            language // Pass current language to API for prompt translation
        };

        const currentEntry: HistoryRecord = {
            name, birthDate, birthTime: isTimeUnknown ? null : birthTime,
            isTimeUnknown, country, region1Depth, region2Depth
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
            saveToHistory(currentEntry);
            onSuccess({ ...data, userName: name, originalPayload: payload });
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

                {/* Name */}
                <div>
                    <label style={{ fontWeight: "700", display: "block", marginBottom: "8px" }}>{t("nameLabel")}</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder={t("namePlaceholder")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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

                {/* History Section */}
                {history.length > 0 && (
                    <div style={{ marginTop: "32px", borderTop: "3px dashed #111", paddingTop: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "800" }}>{t("recentRecords")}</h3>
                            <button
                                type="button"
                                onClick={clearHistory}
                                style={{ fontSize: "0.8rem", background: "none", border: "none", textDecoration: "underline", cursor: "pointer", fontWeight: "600", color: "#666" }}
                            >
                                {t("clearHistory")}
                            </button>
                        </div>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {history.map((record, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => loadRecord(record)}
                                    className="btn"
                                    style={{
                                        fontSize: "0.9rem",
                                        padding: "8px 14px",
                                        background: "#fff",
                                        border: "2px solid #111",
                                        boxShadow: "3px 3px 0px #111",
                                        borderRadius: "20px"
                                    }}
                                >
                                    👤 {record.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}
