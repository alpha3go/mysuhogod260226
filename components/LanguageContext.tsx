"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ko" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    ko: {
        title: "내 정보 입력하기",
        birthDate: "생년월일 *",
        birthTime: "태어난 시간 *",
        unknown: "모름",
        place: "태어난 장소 *",
        countrySelect: "국가 선택",
        regionSelect: "도/광역시 선택",
        citySelect: "시/군/구 선택",
        submitBtn: "나만의 수호천사 그리기 👉",
        errorDate: "생년월일을 입력해주세요!",
        errorTime: "태어난 시간을 입력하거나 '모름'을 체크해주세요!",
        errorPlace: "태어난 장소를 모두 선택해주세요!",
        errorApi: "오류가 발생했습니다: ",
        appTitle: "My Suhogod",
        appDesc1: "사주, 수비학, 어스트롤로지로 분석하는",
        appDesc2: "나만의 귀여운 맞춤 수호천사",
        loadTitle: "잠시만 기다려주세요",
        loadMsg1: "별의 흐름을 읽는 중...",
        loadMsg2: "생년월일의 숫자를 더하는 중...",
        loadMsg3: "사주의 오행을 분석하는 중...",
        loadMsg4: "당신만의 귀여운 수호천사를 그리는 중...",
        myAngel: "나만의 맞춤 수호천사",
        comfort: "위로의 한마디",
        fortune: "행운 & 주의",
        saveFull: "결과 전체 저장하기",
        saveImageOnly: "수호천사만 저장하기",
        kakaoShare: "카톡 공유",
        copyLink: "링크 복사",
        linkCopied: "링크가 클립보드에 복사되었습니다!"
    },
    en: {
        title: "Enter Your Information",
        birthDate: "Date of Birth *",
        birthTime: "Time of Birth *",
        unknown: "Unknown",
        place: "Place of Birth *",
        countrySelect: "Select Country",
        regionSelect: "State / Province",
        citySelect: "City / District",
        submitBtn: "Generate My Guardian Angel 👉",
        errorDate: "Please enter your date of birth!",
        errorTime: "Please enter your time of birth or check 'Unknown'!",
        errorPlace: "Please select your full place of birth!",
        errorApi: "An error occurred: ",
        appTitle: "My Suhogod",
        appDesc1: "Analyze your guardian angel based on",
        appDesc2: "Saju, Numerology, and Astrology",
        loadTitle: "Please Wait",
        loadMsg1: "Reading the stars...",
        loadMsg2: "Calculating your birth numbers...",
        loadMsg3: "Analyzing the five elements...",
        loadMsg4: "Drawing your unique guardian angel...",
        myAngel: "My Guardian Angel",
        comfort: "Comforting Words",
        fortune: "Fortune & Warnings",
        saveFull: "Save Result Card",
        saveImageOnly: "Save Image Only",
        kakaoShare: "Share via Kakao",
        copyLink: "Copy Link",
        linkCopied: "Link copied to clipboard!"
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>("ko");

    useEffect(() => {
        // Check browser language or saved preference
        const savedLang = localStorage.getItem("suhogod-lang") as Language;
        if (savedLang && (savedLang === "ko" || savedLang === "en")) {
            setLanguage(savedLang);
        } else {
            const browserLang = navigator.language.startsWith("ko") ? "ko" : "en";
            setLanguage(browserLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("suhogod-lang", lang);
    };

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
