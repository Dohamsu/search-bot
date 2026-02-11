#!/bin/bash
# =============================================================================
# Vercel 자동 셋업 스크립트
# monorepo의 모든 앱을 Vercel 프로젝트로 생성하고 GitHub 연동까지 자동 처리
#
# 사전 준비:
#   1. Vercel 계정에 GitHub Integration 설치 (https://vercel.com/integrations/github)
#   2. Vercel 토큰 생성 (https://vercel.com/account/tokens)
#   3. 환경변수 설정:
#      export VERCEL_TOKEN="your_token_here"
#      export VERCEL_TEAM_ID="team_xxx"  # (선택) 팀 사용 시
#
# 사용법:
#   chmod +x scripts/vercel-setup.sh
#   ./scripts/vercel-setup.sh              # 전체 앱 셋업
#   ./scripts/vercel-setup.sh loan-calculator  # 특정 앱만 셋업
# =============================================================================

# 토큰은 환경변수로 전달: export VERCEL_TOKEN="your_token"
# export VERCEL_TOKEN="${VERCEL_TOKEN:?VERCEL_TOKEN 환경변수를 설정하세요}"
set -euo pipefail

GITHUB_REPO="Dohamsu/search-bot"
API_BASE="https://api.vercel.com"

# ── 색상 ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ── 앱 설정 (이름:루트디렉토리:도메인프리픽스) ──
APPS=(
  "salary-calculator:apps/salary-calculator:salary"
  "mbti-test:apps/mbti-test:mbti"
  "qr-generator:apps/qr-generator:qr"
  "file-converter:apps/file-converter:file"
  "dot-art:apps/dot-art:dotart"
  "loan-calculator:apps/loan-calculator:loan"
  "text-counter:apps/text-counter:text"
  "date-calculator:apps/date-calculator:date"
  "unit-converter:apps/unit-converter:unit"
  "health-calculator:apps/health-calculator:health"
  "color-tools:apps/color-tools:color"
  "dev-tools:apps/dev-tools:devtools"
  "utility-bill:apps/utility-bill:bill"
)

# ── 공통 환경변수 (필요 시 값 채우기) ──
COMMON_ENV_VARS=(
  "NEXT_PUBLIC_GA_ID:"
  "NEXT_PUBLIC_ADSENSE_ID:"
)

# =============================================================================
# 유틸 함수
# =============================================================================

log_info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok()    { echo -e "${GREEN}[  OK]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[FAIL]${NC} $1"; }

vercel_api() {
  local method=$1
  local endpoint=$2
  local data=${3:-}

  local url="${API_BASE}${endpoint}"
  if [[ -n "${VERCEL_TEAM_ID:-}" ]]; then
    if [[ "$url" == *"?"* ]]; then
      url="${url}&teamId=${VERCEL_TEAM_ID}"
    else
      url="${url}?teamId=${VERCEL_TEAM_ID}"
    fi
  fi

  local args=(-s -X "$method" -H "Authorization: Bearer ${VERCEL_TOKEN}" -H "Content-Type: application/json")
  if [[ -n "$data" ]]; then
    args+=(-d "$data")
  fi

  curl "${args[@]}" "$url"
}

check_project_exists() {
  local name=$1
  local response
  response=$(vercel_api GET "/v9/projects/${name}" 2>/dev/null)
  if echo "$response" | grep -q '"id"'; then
    echo "$response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4
  else
    echo ""
  fi
}

# =============================================================================
# 메인: 프로젝트 생성
# =============================================================================

create_project() {
  local app_name=$1
  local root_dir=$2
  local domain_prefix=$3

  echo ""
  log_info "━━━ ${app_name} ━━━"

  # 이미 존재하는지 확인
  local project_id
  project_id=$(check_project_exists "$app_name")

  if [[ -n "$project_id" ]]; then
    log_warn "프로젝트 '${app_name}' 이미 존재 (ID: ${project_id}) → 스킵"
    return 0
  fi

  # 프로젝트 생성 + GitHub 연결
  local payload
  payload=$(cat <<ENDJSON
{
  "name": "${app_name}",
  "framework": "nextjs",
  "rootDirectory": "${root_dir}",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "gitRepository": {
    "type": "github",
    "repo": "${GITHUB_REPO}"
  }
}
ENDJSON
)

  local response
  response=$(vercel_api POST "/v10/projects" "$payload")

  # 응답 확인
  project_id=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

  if [[ -z "$project_id" ]]; then
    local error_msg
    error_msg=$(echo "$response" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4)
    log_error "프로젝트 생성 실패: ${error_msg:-알 수 없는 오류}"
    echo "$response" | head -c 300
    echo ""
    return 1
  fi

  log_ok "프로젝트 생성 완료 (ID: ${project_id})"

  # 환경변수 설정: NEXT_PUBLIC_SITE_URL
  add_env_var "$project_id" "NEXT_PUBLIC_SITE_URL" "https://${app_name}.vercel.app"

  # 공통 환경변수 설정
  for env_entry in "${COMMON_ENV_VARS[@]}"; do
    local key="${env_entry%%:*}"
    local value="${env_entry#*:}"
    if [[ -n "$value" ]]; then
      add_env_var "$project_id" "$key" "$value"
    fi
  done

  log_ok "${app_name} 셋업 완료 → https://${app_name}.vercel.app"
}

# =============================================================================
# 환경변수 추가
# =============================================================================

add_env_var() {
  local project_id=$1
  local key=$2
  local value=$3

  local payload
  payload=$(cat <<ENDJSON
{
  "key": "${key}",
  "value": "${value}",
  "type": "plain",
  "target": ["production", "preview"]
}
ENDJSON
)

  local response
  response=$(vercel_api POST "/v10/projects/${project_id}/env" "$payload")

  if echo "$response" | grep -q '"created"'; then
    log_ok "  ENV: ${key} 설정 완료"
  elif echo "$response" | grep -q 'already exist'; then
    log_warn "  ENV: ${key} 이미 존재 → 스킵"
  else
    log_warn "  ENV: ${key} 설정 실패"
  fi
}

# =============================================================================
# 전체 상태 확인
# =============================================================================

show_status() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${BLUE} Vercel 프로젝트 상태${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  printf "%-22s %-8s %s\n" "앱" "상태" "URL"
  echo "─────────────────────────────────────────────"

  for entry in "${APPS[@]}"; do
    local name="${entry%%:*}"
    local project_id
    project_id=$(check_project_exists "$name")
    if [[ -n "$project_id" ]]; then
      printf "%-22s ${GREEN}%-8s${NC} %s\n" "$name" "연결됨" "https://${name}.vercel.app"
    else
      printf "%-22s ${RED}%-8s${NC} %s\n" "$name" "미연결" "-"
    fi
  done
  echo ""
}

# =============================================================================
# 엔트리포인트
# =============================================================================

main() {
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${BLUE} Search Bot - Vercel 자동 셋업${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # 토큰 확인
  if [[ -z "${VERCEL_TOKEN:-}" ]]; then
    log_error "VERCEL_TOKEN 환경변수가 설정되지 않았습니다."
    echo ""
    echo "  토큰 생성: https://vercel.com/account/tokens"
    echo "  설정 방법: export VERCEL_TOKEN=\"your_token_here\""
    echo ""
    exit 1
  fi

  log_ok "토큰 확인됨"
  log_info "GitHub 레포: ${GITHUB_REPO}"
  log_info "팀 ID: ${VERCEL_TEAM_ID:-개인 계정}"

  # 특정 앱만 지정한 경우
  if [[ $# -gt 0 ]]; then
    local target=$1
    for entry in "${APPS[@]}"; do
      local name="${entry%%:*}"
      local rest="${entry#*:}"
      local root="${rest%%:*}"
      local domain="${rest#*:}"
      if [[ "$name" == "$target" ]]; then
        create_project "$name" "$root" "$domain"
        show_status
        return 0
      fi
    done
    log_error "앱 '${target}'을(를) 찾을 수 없습니다."
    exit 1
  fi

  # 전체 앱 셋업
  log_info "총 ${#APPS[@]}개 앱 셋업 시작"

  local success=0
  local failed=0

  for entry in "${APPS[@]}"; do
    local name="${entry%%:*}"
    local rest="${entry#*:}"
    local root="${rest%%:*}"
    local domain="${rest#*:}"
    if create_project "$name" "$root" "$domain"; then
      ((success++))
    else
      ((failed++))
    fi
  done

  # 결과 요약
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${GREEN} 완료: ${success}개 성공${NC} / ${RED}${failed}개 실패${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  show_status

  echo "이제 main 브랜치에 push하면 자동으로 배포됩니다."
  echo ""
}

main "$@"
