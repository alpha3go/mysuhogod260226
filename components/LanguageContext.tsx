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
        appDesc1: "사주, 수비학, 별자리로 분석하는",
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
        copyLink: "결과 링크 복사 (공유)",
        linkCopied: "링크가 클립보드에 복사되었습니다!",
        analysisTitle: "기운 분석 (사주·수비학·점성술)",
        luckyNumbersTitle: "행운의 숫자",
        luckyFoodTitle: "행운의 음식",
        luckyOutfitTitle: "행운의 코디",
        luckyPlaceTitle: "행운의 장소",
        nameLabel: "이름",
        namePlaceholder: "이름을 입력해주세요 (예: 홍길동)",
        backToHome: "다시 하기 (다른 사람 분석)",
        recentRecords: "최근 분석한 분들",
        noRecords: "아직 기록이 없습니다.",
        clearHistory: "기록 삭제",
        userAngelTitle: "님의 수호천사",
        styleTitle: "수호신 스타일 변경",
        themeAnimal: "귀여운 동물",
        themeGeneral: "든든한 장군",
        themeFriend: "친근한 친구",
        regenerateBtn: "새로 생성하기"
    },
    en: {
        title: "Enter Your Information",
        birthDate: "Date of Birth",
        birthTime: "Time of Birth",
        timeUnknown: "Time Unknown",
        placeOfBirth: "Place of Birth",
        submitBtn: "Find My Guardian Angel",
        errorDate: "Please enter your birth date!",
        errorTime: "Please enter your birth time!",
        errorPlace: "Please select all birth place fields!",
        errorApi: "An error occurred: ",
        errorName: "Please enter your name!",
        appTitle: "My Suhogod",
        appDesc1: "Analyze with Saju, Numerology, and Zodiac signs",
        appDesc2: "Your own cute personalized guardian angel",
        loadTitle: "Please wait",
        loadMsg1: "Reading the flow of stars...",
        loadMsg2: "Gathering energy of five elements...",
        loadMsg3: "Summoning your guardian angel...",
        myAngel: "My Guardian Angel",
        comfort: "Comforting Message",
        fortune: "Fortune & Warnings",
        saveFull: "Save Result Card",
        saveImageOnly: "Save Image Only",
        copyLink: "Copy Result Link (Share)",
        linkCopied: "Link copied to clipboard!",
        analysisTitle: "Energy Analysis (Saju·Num·Ast)",
        luckyNumbersTitle: "Lucky Numbers",
        luckyFoodTitle: "Lucky Food",
        luckyOutfitTitle: "Lucky Outfit",
        luckyPlaceTitle: "Lucky Place",
        nameLabel: "Name",
        namePlaceholder: "Enter name (e.g. John Doe)",
        backToHome: "Try Again (Analyze Someone Else)",
        recentRecords: "Recent Analyses",
        noRecords: "No records yet.",
        clearHistory: "Clear",
        userAngelTitle: "'s Guardian Angel",
        styleTitle: "Change Style",
        themeAnimal: "Cute Animal",
        themeGeneral: "Strong General",
        themeFriend: "Friendly Companion",
        regenerateBtn: "Re-generate"
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
