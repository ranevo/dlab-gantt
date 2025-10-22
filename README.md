# DLab Gantt

DLab Gantt는 프로젝트/업무를 4단계 트리와 간트 차트로 관리하는 풀스택 애플리케이션입니다. Windows 11 + MySQL 환경을 기준으로 하며, 프런트엔드(React)와 백엔드(Node.js/Express), 데이터베이스 스크립트를 제공합니다.

## 구성

- `backend/` – Express 기반 REST API
- `frontend/` – Vite + React 클라이언트
- `database/schema.sql` – MySQL 초기 스키마 스크립트
- `.env` 파일은 backend, frontend 각각에 포함되어 있습니다.

## 주요 기능

- 이메일/비밀번호/별칭 기반 회원가입 및 로그인
  - 회원가입 시 관리자가 승인해야 활성화
  - 로그인/회원가입 실패 사유를 상세히 안내
  - 기본 관리자 계정: `qltthfl@gmail.com` / `하이테크`
- 세션 유지시간 기본 10분 (설정 화면에서 변경 가능)
- 4단계(프로젝트 → 대분류 → 중분류 → 작업) 트리와 연동된 간트 차트
  - 트리 접기/펼치기 시 간트 바도 연동
  - 상태 색상, 오늘 기준 경과율 표시, 헤더 폭 조절 지원
- 항목별 메모/첨부파일/TODO 관리
  - 첨부파일 저장 경로, 메모 폰트 크기 등 설정 지원
  - TODO 전체 보기, 첨부파일 전체 보기 팝업 제공
- 관리자 기능
  - 사용자 승인/비활성화, 읽기/쓰기/삭제 권한 관리
  - 진행상태(이름/색상) CRUD, 시스템 설정 관리
- 모든 추가/수정/삭제 작업 전 확인 팝업 표시

## 설치 및 실행

### 1. 데이터베이스

MySQL에 스키마를 초기화합니다.

```bash
mysql -u <USER> -p < database/schema.sql
```

> `database/schema.sql`은 데이터베이스와 테이블을 생성하고 기본 상태/설정을 삽입합니다. 서버가 기동되면 관리자 계정이 자동으로 보정(생성/갱신)됩니다.

### 2. 백엔드

```bash
cd backend
npm install
npm run dev
```

환경 변수는 `backend/.env`에서 설정합니다. 기본값은 아래와 같습니다.

```
PORT=4000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=dlab_gantt
JWT_SECRET=super_secret_jwt_key
ATTACHMENT_STORAGE=C:\\dlab-gantt\\attachments
DEFAULT_HIGHLIGHT_COLOR=#3182ce
DEFAULT_MEMO_FONT_SIZE=14
```

Windows 환경에서는 `ATTACHMENT_STORAGE` 경로에 폴더를 만들어 두세요.

### 3. 프런트엔드

```bash
cd frontend
npm install
npm run dev
```

기본적으로 `VITE_API_URL=http://localhost:4000` 로 설정되어 있으며, 필요 시 `frontend/.env`를 수정합니다.

## 사용 방법

1. 관리자 계정(`qltthfl@gmail.com`)으로 로그인하여 신규 가입자의 상태/권한을 승인합니다.
2. 트리에서 항목을 선택하면 우측 패널에서 메모/첨부파일/TODO를 관리할 수 있습니다.
3. 상단 버튼을 통해 전체 TODO/첨부파일, 진행상태/시스템 설정, 관리자 설정 등을 팝업으로 열 수 있습니다.
4. 설정 화면에서 세션 유지시간, 하이라이트 색상, 메모 폰트, 첨부파일 경로 등을 변경할 수 있습니다.

## 테스트

현재 리포지토리에는 자동화된 테스트 스크립트가 포함되어 있지 않습니다. 백엔드 서버와 프런트엔드 개발 서버를 각각 실행한 뒤 브라우저에서 수동으로 기능을 검증할 수 있습니다.

## 라이선스

본 프로젝트는 사내 용도를 위해 작성된 예시 코드입니다.
