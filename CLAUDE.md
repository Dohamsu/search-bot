# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

13개 수익형 유틸리티 웹앱으로 구성된 npm workspaces 모노레포. 각 앱은 독립 배포되며 `{prefix}.onekit.co.kr` 도메인을 사용한다.

## Commands

```bash
# 전체 빌드
npm run build:all

# 개별 dev (salary, mbti, qr, file, dot, loan, text, date, unit, health, color, dev, bill)
npm run dev:salary          # localhost:3000
npm run dev:mbti            # localhost:3001

# 개별 빌드
npm run build:salary

# 개별 앱 직접 실행
npm run dev --workspace=apps/salary-calculator
npm run build --workspace=apps/salary-calculator

# 린트 (앱 내부)
cd apps/salary-calculator && npx eslint .
```

테스트 프레임워크는 설정되어 있지 않다.

## Architecture

**모노레포 구조**: npm workspaces (`apps/*`). 공유 패키지 없이 각 앱이 독립적으로 동일한 패턴을 구현한다.

**기술 스택**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Lucide React (아이콘)

**앱별 구조** (모든 앱 동일):
```
apps/{app-name}/app/
├── page.tsx            # 메인 페이지 ("use client")
├── layout.tsx          # 루트 레이아웃 (metadata, GA, AdSense, JSON-LD)
├── globals.css         # Tailwind + CSS 변수 (앱별 테마 색상)
├── components/         # UI 컴포넌트
├── lib/                # 비즈니스 로직 (계산, 변환 등)
├── i18n/               # 다국어 (ko/en) - Context 기반 커스텀 구현
│   ├── index.tsx       # LocaleProvider, useTranslation hook
│   ├── ko.json, en.json
│   └── LanguageSwitcher.tsx
├── robots.ts, sitemap.ts
├── opengraph-image.tsx # next/og ImageResponse 기반 OG 이미지
├── privacy/, terms/    # 정적 페이지
└── public/ads.txt      # AdSense 인증
```

**i18n 패턴**: 외부 라이브러리 없이 React Context + localStorage로 구현. `_i18n-template/` 디렉토리가 신규 앱용 템플릿.

**SEO/수익화**: 모든 앱의 layout.tsx에 GA4(`G-YRKEEK84RK`)와 AdSense(`ca-pub-3400073425613266`)가 하드코딩. Schema.org JSON-LD 포함.

**배포**: 각 앱이 별도 Vercel 프로젝트. `vercel.json`의 `ignoreCommand`로 변경된 앱만 빌드. 도메인은 `onekit.co.kr` 하위.

## Key Conventions

- 메인 페이지는 항상 `"use client"` (인터랙티브 계산기/도구)
- CSS 변수로 앱별 테마 관리 (예: `--salary-primary`, `--mbti-primary`)
- sitemap.ts에서 동적 라우트를 프로그래밍 방식으로 생성 (salary: 2000~15000 범위)
- OG 이미지는 `next/og`의 ImageResponse + Noto Sans KR 폰트
- 교차 앱 홍보를 위한 RelatedTools 컴포넌트
- next.config.ts는 최소 설정 (Next.js 기본값 사용)

## App Registry

| 약칭 | 앱 | 포트 | 도메인 prefix |
|------|-----|------|---------------|
| salary | salary-calculator | 3000 | salary |
| mbti | mbti-test | 3001 | mbti |
| qr | qr-generator | 3002 | qr |
| file | file-converter | 3003 | file |
| dot | dot-art | 3004 | dotart |
| loan | loan-calculator | 3005 | loan |
| text | text-counter | 3006 | text |
| date | date-calculator | 3007 | date |
| unit | unit-converter | 3008 | unit |
| health | health-calculator | 3009 | health |
| color | color-tools | 3010 | color |
| dev | dev-tools | 3011 | dev |
| bill | utility-bill | 3012 | bill |
