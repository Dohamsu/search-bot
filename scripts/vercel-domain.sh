#!/bin/bash
# =============================================================================
# Vercel 도메인 연결 스크립트
# 10개 앱에 onekit.kr 서브도메인을 일괄 매핑
#
# 사용법:
#   chmod +x scripts/vercel-domain.sh
#   ./scripts/vercel-domain.sh              # 전체 도메인 매핑
#   ./scripts/vercel-domain.sh status       # 현재 상태 확인
# =============================================================================

# 토큰은 환경변수로 전달: export VERCEL_TOKEN="your_token"
# export VERCEL_TOKEN="${VERCEL_TOKEN:?VERCEL_TOKEN 환경변수를 설정하세요}"
set -euo pipefail

DOMAIN="onekit.co.kr"
API_BASE="https://api.vercel.com"

# ── 색상 ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# ── 앱:서브도메인 매핑 (현재 Vercel에 배포된 10개) ──
APPS=(
  "salary-calculator:salary"
  "mbti-test:mbti"
  "qr-generator:qr"
  "file-converter:file"
  "loan-calculator:loan"
  "text-counter:text"
  "date-calculator:date"
  "health-calculator:health"
  "color-tools:color"
  "utility-bill:bill"
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

# =============================================================================
# 프로젝트에 도메인 추가
# =============================================================================

add_domain_to_project() {
  local project_name=$1
  local subdomain=$2
  local full_domain="${subdomain}.${DOMAIN}"

  log_info "━━━ ${project_name} → ${full_domain} ━━━"

  # 도메인 추가 요청
  local payload="{\"name\": \"${full_domain}\"}"
  local response
  response=$(vercel_api POST "/v10/projects/${project_name}/domains" "$payload")

  if echo "$response" | grep -q '"name"'; then
    if echo "$response" | grep -q '"verified":true'; then
      log_ok "${full_domain} 추가 완료 (인증됨)"
    else
      log_ok "${full_domain} 추가 완료 (DNS 설정 필요)"
    fi
  elif echo "$response" | grep -q 'already'; then
    log_warn "${full_domain} 이미 등록됨 → 스킵"
  else
    local error_msg
    error_msg=$(echo "$response" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4)
    log_error "${full_domain} 추가 실패: ${error_msg:-알 수 없는 오류}"
    echo "  응답: $(echo "$response" | head -c 200)"
  fi

  # NEXT_PUBLIC_SITE_URL 환경변수도 업데이트
  update_site_url "$project_name" "https://${full_domain}"
}

# =============================================================================
# 메인 도메인 (onekit.kr) 추가 — salary-calculator에 연결
# =============================================================================

add_root_domain() {
  log_info "━━━ 루트 도메인: ${DOMAIN} → salary-calculator ━━━"

  local payload="{\"name\": \"${DOMAIN}\"}"
  local response
  response=$(vercel_api POST "/v10/projects/salary-calculator/domains" "$payload")

  if echo "$response" | grep -q '"name"'; then
    log_ok "${DOMAIN} 추가 완료"
  elif echo "$response" | grep -q 'already'; then
    log_warn "${DOMAIN} 이미 등록됨"
  else
    local error_msg
    error_msg=$(echo "$response" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4)
    log_error "${DOMAIN} 추가 실패: ${error_msg:-}"
  fi
}

# =============================================================================
# 환경변수 업데이트
# =============================================================================

update_site_url() {
  local project_name=$1
  local new_url=$2

  # 기존 환경변수 확인 후 업데이트
  local response
  response=$(vercel_api GET "/v9/projects/${project_name}/env")

  local env_id
  env_id=$(echo "$response" | grep -B5 '"NEXT_PUBLIC_SITE_URL"' | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

  if [[ -n "$env_id" ]]; then
    # 기존 환경변수 삭제 후 재생성
    vercel_api DELETE "/v9/projects/${project_name}/env/${env_id}" > /dev/null 2>&1

    local payload
    payload=$(cat <<ENDJSON
{
  "key": "NEXT_PUBLIC_SITE_URL",
  "value": "${new_url}",
  "type": "plain",
  "target": ["production", "preview"]
}
ENDJSON
)
    vercel_api POST "/v10/projects/${project_name}/env" "$payload" > /dev/null 2>&1
    log_ok "  ENV: NEXT_PUBLIC_SITE_URL → ${new_url}"
  else
    local payload
    payload=$(cat <<ENDJSON
{
  "key": "NEXT_PUBLIC_SITE_URL",
  "value": "${new_url}",
  "type": "plain",
  "target": ["production", "preview"]
}
ENDJSON
)
    vercel_api POST "/v10/projects/${project_name}/env" "$payload" > /dev/null 2>&1
    log_ok "  ENV: NEXT_PUBLIC_SITE_URL → ${new_url} (신규)"
  fi
}

# =============================================================================
# 상태 확인
# =============================================================================

show_status() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${BLUE} 도메인 매핑 상태${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  printf "%-22s %-28s %-10s\n" "프로젝트" "도메인" "상태"
  echo "────────────────────────────────────────────────────────"

  # 루트 도메인
  local response
  response=$(vercel_api GET "/v9/projects/salary-calculator/domains")
  if echo "$response" | grep -q "\"${DOMAIN}\""; then
    printf "%-22s %-28s ${GREEN}%-10s${NC}\n" "salary-calculator" "${DOMAIN}" "연결됨"
  fi

  # 서브도메인
  for entry in "${APPS[@]}"; do
    local name="${entry%%:*}"
    local sub="${entry#*:}"
    local full="${sub}.${DOMAIN}"

    response=$(vercel_api GET "/v9/projects/${name}/domains")
    if echo "$response" | grep -q "\"${full}\""; then
      local verified
      verified=$(echo "$response" | grep -A2 "\"${full}\"" | grep -o '"verified":[a-z]*' | head -1 | cut -d: -f2)
      if [[ "$verified" == "true" ]]; then
        printf "%-22s %-28s ${GREEN}%-10s${NC}\n" "$name" "$full" "활성"
      else
        printf "%-22s %-28s ${YELLOW}%-10s${NC}\n" "$name" "$full" "DNS 대기"
      fi
    else
      printf "%-22s %-28s ${RED}%-10s${NC}\n" "$name" "$full" "미등록"
    fi
  done
  echo ""
}

# =============================================================================
# DNS 설정 안내
# =============================================================================

show_dns_guide() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${CYAN} DNS 설정 가이드 (도메인 등록업체에서 설정)${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo -e "${YELLOW}방법 A: CNAME 레코드 (권장)${NC}"
  echo "도메인 관리 페이지에서 아래 레코드를 추가하세요:"
  echo ""
  printf "  %-10s %-25s %-10s %s\n" "타입" "호스트" "TTL" "값"
  echo "  ──────────────────────────────────────────────────────"
  printf "  %-10s %-25s %-10s %s\n" "A" "@" "3600" "76.76.21.21"
  for entry in "${APPS[@]}"; do
    local sub="${entry#*:}"
    printf "  %-10s %-25s %-10s %s\n" "CNAME" "$sub" "3600" "cname.vercel-dns.com."
  done
  echo ""
  echo -e "${YELLOW}방법 B: Vercel 네임서버 (가장 간편)${NC}"
  echo "도메인 등록업체에서 네임서버를 아래로 변경:"
  echo "  ns1.vercel-dns.com"
  echo "  ns2.vercel-dns.com"
  echo "(이 방법을 쓰면 개별 DNS 레코드 추가 불필요)"
  echo ""
}

# =============================================================================
# 엔트리포인트
# =============================================================================

main() {
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${BLUE} OneKit.kr - Vercel 도메인 매핑${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [[ -z "${VERCEL_TOKEN:-}" ]]; then
    log_error "VERCEL_TOKEN이 설정되지 않았습니다."
    exit 1
  fi

  # status 명령
  if [[ "${1:-}" == "status" ]]; then
    show_status
    return 0
  fi

  log_ok "토큰 확인됨"
  log_info "도메인: ${DOMAIN}"
  log_info "앱 수: ${#APPS[@]}개"

  # 루트 도메인 추가
  echo ""
  add_root_domain

  # 서브도메인 매핑
  local success=0
  local failed=0

  for entry in "${APPS[@]}"; do
    local name="${entry%%:*}"
    local sub="${entry#*:}"
    echo ""
    if add_domain_to_project "$name" "$sub"; then
      ((success++))
    else
      ((failed++))
    fi
  done

  # 결과
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${GREEN} 완료: ${success}개 성공${NC} / ${RED}${failed}개 실패${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  show_dns_guide
  show_status
}

main "$@"
