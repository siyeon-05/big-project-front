# 진행 상황

## <2026-01-19>

### 1. 로그인 ID 정책 변경 (email → id)

- 기존 로그인 방식에서 이메일(email) 기반 → 아이디(id) 기반으로 변경
- 개인정보 보호 이슈 때문에 백엔드 정책에 맞게 프론트엔드 수정
- **수정 파일**
    - Login.jsx
    - Signup.jsx
    - FindID.jsx
    - FindPassword.jsx

### 2. 로컬 환경 JWT 기반 회원가입 / 로그인 백엔드 연동 완료

- 로컬 환경에서 JWT 인증 방식으로 회원가입 및 로그인 API 연동
- axios 기반 공통 API 설정 및 토큰 처리 로직 추가
- 로그인 성공 시 토큰 저장, 로그아웃 시 토큰 삭제 처리
- **추가 파일**
    - client.js (axios 인스턴스 및 공통 설정 파일 생성)
    - .env (배포할 때 필요)
    - .env.local (로컬 실행 할 때만 필요)
- **수정 파일**
    - package.json (axios 라이브러리 추가)
    - Login.jsx (로그인 API 연동 및 토큰 저장 처리)
    - Signup.jsx (회원가입 API 연동)
    - SiteHeader.jsx (로그아웃 시 토큰 삭제 처리 추가)

---

## <2026-01-20>

### 1. 투자 게시판 등록 페이지 구현

- 기업 정보 입력 폼 UI 구성 (회사명, 한 줄 소개, 로고 URL, 지역, 회사 규모, 태그(최대 5개), 공식 홈페이지, 담당자 이름/이메일, 상세 소개)
- 우측 미리보기 카드 영역 구성 (입력값 기반 실시간 미리보기)
- 하단 버튼 기능 구현
    - 임시 저장 기능 구현
    - 등록하기 기능 구현
- **추가 파일**
    - InvestmentPostCreate.jsx
    - InvestmentPostCreate.css
- **수정 파일**
    - App.jsx (등록 페이지 라우트 추가)
    - main.jsx (등록 페이지 CSS import)
    - InvestmentBoard.jsx (등록 버튼 → 등록 페이지 이동)
    - InvestmentPostCreate.css (임시 저장 후 불러올 때 모달 텍스트/버튼 스타일)

### 2. 투자 게시판 수정 페이지 구현

- 기존 작성된 게시글 데이터를 불러와 폼에 세팅
- 하단 버튼 기능 구현
    - 수정 저장 버튼 기능 구현
    - 삭제 버튼 기능 구현
- 업데이트한 날짜 미리보기에 추가
- **추가 파일**
    - InvestmentPostEdit.jsx
- **수정 파일**
    - App.jsx (수정 페이지 라우트 추가)
    - InvestmentBoard.jsx (내가 만든 카드 클릭 시 수정 페이지로 이동)

### 3.  카드 하단에 업데이트 한 날짜 표시

- **수정 파일**
    - InvestmentBoard.jsx (미리보기 카드 하단에 “업데이트:” 텍스트 추가)
    - InvestmentPostCreate.css (업데이트 텍스트 스타일 및 하단 레이아웃 보정)
    - InvestmentPostEdit.jsx (수정 페이지 미리보기 카드 하단에 업데이트 날짜 표시)