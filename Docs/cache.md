
# API 성능 및 캐싱 전략

## 개요

서비스의 성능 개선 및 캐싱 전략을 설계하기 위한 설계를 작성했습니다.  


### 1. 쿼리 분석 및 캐싱 전략

1.1. Slow Query 발생 원인

Slow Query는 여러 가지 원인으로 발생할 수 있으며, 주요 원인은 다음과 같습니다

	대량의 데이터 처리: 대량의 데이터를 불러올 때 쿼리 성능이 저하될 수 있습니다.
	전체 테이블 스캔: JOIN 연산 시 전체 테이블 스캔이 발생할 수 있습니다.
	잠금 문제 (비관적 잠금): 비관적 잠금으로 인해 쿼리 성능이 떨어질 수 있습니다.
	잘못된 Index: 적절하지 않은 인덱스 사용으로 쿼리 성능이 저하될 수 있습니다.

1.2. Slow Query가 발생할 수 있는 API

1.2.1. 공연 목록 조회

	문제점: 많은 요청이 들어올 때 대량의 데이터를 불러오는 쿼리로 인해 성능이 저하될 수 있습니다.

1.2.2. 남은 좌석 수 조회

	문제점: 좌석 예약 중 비관적 잠금이 발생해 대기 시간이 길어질 수 있으며, 잘못된 좌석 수를 반환할 수 있습니다.

1.2.3. 나의 스케줄 좌석 조회

	문제점: 좌석과 예약 정보를 조회할 때 많은 요청으로 인해서 성능이 저하될 수 있습니다.

### 2. 캐싱 전략

데이터베이스 부하를 줄이고 성능을 개선하기 위해 캐싱 전략을 적용합니다.

	데이터 캐싱: 자주 조회되는 데이터에 대한 캐시를 적용합니다.
	쿼리 결과 캐싱: 자주 사용되는 쿼리 결과를 캐시하여 데이터베이스 접근을 줄입니다.

### 3. API 호출 처리 능력

3.1. 트래픽 계산

	TPS (초당 처리량) : 1,000
	TPM (분당 처리량) : TPS * 60 = 60,000 

3.2. API 호출 분석

	각 유저가 호출하는 API : 목록 조회, 좌석 조회, 예약, 포인트 충전, 결제 (총 5개 API)
	재시도 횟수 : 2
	총 호출 API 수 : 10 (5개의 API * 2)

3.3. 동시접속자 수 계산

	분당 처리 가능한 동시접속자 수: 60,000 / 10 = 6,000명

3.4. 대기열 순번 계산

	  1. 1명의 유저가 예약조회부터 결제까지 걸리는 시간 : 평균 1분
    2. DB에 동시에 접근할 수 있는 트래픽의 최대치 : 1초에 약 1,000TPS ⇒ 1분에 60,000TPS
    3. 1분간 유저가 호출하는 API 횟수 :
    4. 5(예약가능날짜조회, 좌석조회, 좌석예약, 결제처리) * 2(동시성 이슈에 의해 예약실패하여 API 재시도) = 10
    5. 1분당 처리할 수 있는 동시접속자 수 = 6000명
    ⇒ 최종 결론 : 10초마다 1000명을 예약가능한 상태로 전환.