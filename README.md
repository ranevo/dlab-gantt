# DLab Gantt 프로젝트 대시보드

MySQL에 저장된 프로젝트와 TODO 데이터를 기반으로 트리, TODO 보드, Gantt 차트를 한 화면에서 제공하는 풀스택 예시 애플리케이션입니다. 프론트엔드는 기존 정적 데모의 룩앤필을 유지하면서 REST API를 통해 데이터를 불러오고, 백엔드는 Node.js/Express로 구성되어 있습니다.

## 주요 기술 스택

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js 18+, Express 4, mysql2
- **Database**: MySQL 8 (또는 호환되는 MariaDB)
- **운영 환경**: Windows 11 PowerShell을 기준으로 설치/실행 절차를 정리했습니다.

## 디렉터리 구조

```
.
├── backend/          # Express API 서버 소스
├── frontend/         # 정적 자산 (index.html, styles.css, main.js)
├── database/         # 스키마 & 샘플 데이터 SQL
└── README.md
```

## 사전 준비

1. **Node.js / npm**: Windows 11에서 PowerShell을 관리자 권한으로 열고 다음 명령으로 설치할 수 있습니다.
   ```powershell
   winget install OpenJS.NodeJS.LTS
   ```
2. **MySQL 서버**: MySQL 8.x를 설치하고 서비스가 실행 중인지 확인합니다. (예: [MySQL Installer](https://dev.mysql.com/downloads/installer/) 사용)
3. **저장소 클론**:
   ```powershell
   git clone https://github.com/<your-account>/dlab-gantt.git
   cd dlab-gantt
   ```

## 데이터베이스 초기화

1. PowerShell에서 MySQL 클라이언트를 실행해 스키마와 샘플 데이터를 불러옵니다.
   ```powershell
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```
   > 기본 데이터베이스 이름은 `dlab_gantt`입니다. 필요 시 `schema.sql`을 수정하세요.

2. (선택) 별도의 전용 계정을 만들고 권한을 부여합니다.
   ```sql
   CREATE USER 'dlab_user'@'localhost' IDENTIFIED BY 'dlab_password';
   GRANT ALL PRIVILEGES ON dlab_gantt.* TO 'dlab_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

## 백엔드 환경 변수 설정

1. `backend` 디렉터리로 이동하여 예제 환경 변수를 복사합니다.
   ```powershell
   cd backend
   copy .env.example .env
   ```
2. `.env` 파일을 열어 실제 MySQL 접속 정보(호스트, 사용자, 비밀번호 등)를 입력합니다.

예시:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=dlab_user
DB_PASSWORD=dlab_password
DB_NAME=dlab_gantt
PORT=3000
```

## 서버 설치 및 실행

1. 필요한 패키지를 설치합니다.
   ```powershell
   npm install
   ```
2. 개발 모드로 Express 서버를 실행합니다. (자동 재시작)
   ```powershell
   npm run dev
   ```
   또는 프로덕션 모드로 실행하려면 `npm start`를 사용하세요.

3. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 프론트엔드가 Express를 통해 서빙되고, API 결과를 반영한 대시보드를 확인할 수 있습니다.

## 제공되는 REST API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/projects` | 전체 프로젝트 트리를 TODO 정보와 함께 반환 |
| GET | `/api/projects/export` | 프로젝트/일정 데이터를 JSON 파일로 다운로드 |
| GET | `/api/projects/:slug` | 특정 프로젝트와 하위 항목 정보를 반환 |
| PATCH | `/api/todos/:id` | TODO 완료 여부를 업데이트 |

응답은 UTF-8 JSON 형식이며, `completed` 필드는 불리언으로 전달됩니다.

## 프론트엔드 동작

- 트리에서 프로젝트를 선택하면 해당 TODO가 로드되고, 완료 여부를 서버에 즉시 반영합니다.
- 헤더 우측의 **데이터 다운로드** 버튼을 눌러 현재 서버에 저장된 프로젝트/Gantt 정보를 JSON 파일로 내려받을 수 있습니다.
- Gantt 차트는 MySQL에 저장된 `start_date`, `end_date`, `status` 값을 기반으로 주 단위 타임라인을 생성합니다.
- 오류 발생 시 TODO 패널 하단에 상태 메시지가 표시되며, 서버 오류/네트워크 장애도 안내합니다.

## 개발 팁

- Express 서버는 `backend/src` 이하에 구성되어 있으므로 필요 시 라우터/서비스/레포지토리 레이어를 확장하세요.
- 추가 샘플 데이터를 넣고 싶다면 `database/seed.sql`을 참고하여 INSERT문을 작성한 뒤 다시 로드하면 됩니다.
- Windows 11 외 환경에서도 동일한 명령을 사용할 수 있으나, 쉘 명령어(`copy` → `cp` 등)에 맞춰 조정해야 합니다.

## 라이선스

이 프로젝트는 데모 목적의 예제 코드로, 별도의 라이선스를 명시하지 않았습니다. 자유롭게 참고하시되, 실제 서비스 적용 시 보안과 예외 처리를 강화하세요.
