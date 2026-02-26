// lib/fortuneEngine.ts
// 수비학, 사주(간단 오행), 점성술 분석을 수행하여 핵심 키워드를 반환합니다.

export interface UserFortuneData {
    birthDate: string; // YYYY-MM-DD
    birthTime: string | null; // HH:MM or null
    region: string;
}

export interface FortuneResult {
    lifePathNumber: number;
    zodiacSign: string;
    zodiacAnimal: string; // 12지신 (쥐, 소, 호랑이 등)
    element: string; // 오행 (목, 화, 토, 금, 수)
}

// 1. 수비학 라이프 패스 넘버 계산
// 생년월일의 모든 숫자를 더해서 한 자리가 될 때까지 반복 (단, 11, 22, 33은 마스터 넘버로 예외 처리 가능하나 본 로직에서는 단순화)
function calculateLifePathNumber(dateString: string): number {
    const digits = dateString.replace(/-/g, '').split('').map(Number);
    let sum = digits.reduce((acc, curr) => acc + curr, 0);

    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0);
    }
    return sum;
}

// 2. 점성술 별자리(Sun Sign) 추출
function getZodiacSign(month: number, day: number): string {
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "물병자리";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "물고기자리";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "양자리";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "황소자리";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "쌍둥이자리";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "게자리";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "사자자리";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "처녀자리";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "천칭자리";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "전갈자리";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "사수자리";
    return "염소자리"; // (month === 12 && day >= 22) || (month === 1 && day <= 19)
}

// 3. 사주 기반 핵심 오행 추출 (간략화된 예시)
function getBaseElement(year: number): string {
    const lastDigit = year % 10;
    if (lastDigit === 0 || lastDigit === 1) return "금(Metal)";
    if (lastDigit === 2 || lastDigit === 3) return "수(Water)";
    if (lastDigit === 4 || lastDigit === 5) return "목(Wood)";
    if (lastDigit === 6 || lastDigit === 7) return "화(Fire)";
    return "토(Earth)";
}

// 4. 12지신(Zodiac Animal) 추출
function getZodiacAnimal(year: number): string {
    const animals = ["쥐(Rat)", "소(Ox)", "호랑이(Tiger)", "토끼(Rabbit)", "용(Dragon)", "뱀(Snake)", "말(Horse)", "양(Sheep)", "원숭이(Monkey)", "닭(Rooster)", "개(Dog)", "돼지(Pig)"];
    // (year - 4) % 12 is the standard formula for Chinese Zodiac starting from Rat
    let index = (year - 4) % 12;
    if (index < 0) index += 12;
    return animals[index];
}

export function analyzeFortune(data: UserFortuneData): FortuneResult {
    const [year, month, day] = data.birthDate.split('-').map(Number);

    const lifePathNumber = calculateLifePathNumber(data.birthDate);
    const zodiacSign = getZodiacSign(month, day);
    const zodiacAnimal = getZodiacAnimal(year);
    const element = getBaseElement(year);

    return {
        lifePathNumber,
        zodiacSign,
        zodiacAnimal,
        element
    };
}
