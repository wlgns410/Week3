# Index

프로젝트를 진행하며 대규모 데이터가 삽입되어 조회성능이 요구되는 상황이라고 가정합니다.  
때문에 인덱스를 추가하여 성능을 개선해보고자 합니다.

## 인덱스의 원리

```
  ❗️ InnoDB에서 인덱스는 테이블의 특정 열(컬럼)을 기반으로 별도의 데이터 구조를 생성합니다. 인덱스를 생성하면, 해당 열의 값과 실제 데이터의 주소를 매핑하는 데이터 구조가 형성됩니다. 이를 통해 DBMS는 인덱스를 탐색하여 원하는 데이터를 빠르게 찾을 수 있습니다.

  1. 데이터 삽입: 새로운 데이터가 테이블에 삽입될 때, 인덱스에도 해당 데이터가 추가됩니다. B+ 트리 구조에서는 새로운 데이터가 적절한 위치에 삽입되어 트리의 균형이 유지됩니다.
  2. 데이터 검색: 특정 데이터를 검색할 때, DBMS는 먼저 인덱스를 탐색합니다. B+ 트리 인덱스를 사용하면, 루트 노드에서 시작하여 자식 노드로 이동하며 검색합니다. 각 노드에는 데이터 값과 자식 노드에 대한 포인터가 포함되어 있습니다.
  3. 데이터 삭제: 데이터를 삭제할 때, 인덱스에서도 해당 데이터가 제거됩니다. B+ 트리 구조에서는 삭제 후에도 트리의 균형을 유지하도록 노드가 재조정됩니다.
```

## 쿼리 목록 분석

```
  - 잔액 조회 : 유저 PK로 조회하기 때문에 이미 인덱스가 설정되어 있습니다.
  - 잔액 충전 내역 조회 : 어드민 계정의 경우 모든 충전 내역을 조회해야하므로 조회 성능이 필요하지만 PK로 조회하기 때문에 이미 인덱스 설정이 되어있습니다.
  - 콘서트 목록 조회 : 콘서트 목록의 경우 현재 날짜 기준으로 조회가 필요할 수 있지만 현재 그런 API는 없습니다.
  - 콘서트 좌석 조회 : 좌석의 예매 상태가 수시로 변하므로 인덱스를 걸면 좋지 않아보입니다.
  - 대기열 조회 : 대기열 조회의 경우 캐싱으로 처리했으므로 인덱스로 또 처리할 필요하지 않아 보입니다.
  - 나의 결제정보 조회 : pk가 걸려있기 때문에 인덱스를 추가할 필요가 없어 보입니다.
  - 유저 상태 조회 스케쥴러 : pk로만 인덱스 설정이 되어있으니 상태로 조회하므로 인덱스가 필요해보입니다.
  - 티켓 상태 조회 스케쥴러 : 상태와 만료시간으로 조회하므로 인덱스가 필요해보입니다.
```

## 인덱스 추가 전후 비교표

```
  ❗️ 해당 결과는 데이터 100만건 기준 비교 결과입니다.
```

#### 인덱스 시간 비교

```
  🔅 인덱스 추가 전/후를 비교한 결과입니다.
```

<img src="https://github.com/user-attachments/assets/1fa354f1-c61e-4f84-b60d-2c71b9654f87" width="600" height="130">

<br>

<img src="https://github.com/user-attachments/assets/266d78d3-a2e1-4fe6-b941-0cbbcd2c093d" width="200" height="30">

<br>

<img src="https://github.com/user-attachments/assets/c7a7fe57-667e-4956-95b8-c721bc3bda7a" width="600" height="130">

<br>

<img src="https://github.com/user-attachments/assets/3a88f7d3-c660-4081-b196-17d0590ec2df" width="200" height="30">

<br>

단일 인덱스에 대한 조건을 걸었을 때, 오히려 조회 성능이 하락하는 문제가 있었습니다.

<br>

<img src="https://github.com/user-attachments/assets/5a86c17b-5a2b-45b6-9852-83ddcdc69977" width="200" height="30">

<br>

<img src="https://github.com/user-attachments/assets/08ae4bbd-1c24-4b29-843e-242034a92f06" width="200" height="30">

<br>

```
100만건에서 460만건으로 늘려 테스트를 한 결과 인덱스의 효과를 보기 시작했습니다.
기존 문제는 100만건이 전부 ACTIVE 상태인 것으로 데이터를 입력해서 50% 이상 row 가 조회되어 full index scan을 하는 시간보다 정렬 시간이 추가되어 조회 시간이 오히려 더 걸렸었습니다.
때문에 데이터를 더 추가해 조회하는 row의 필터링되는 비율을 확인해야하는 것을 깨달았습니다.
```

| queryName      | index                                               | before(ms) | after(ms) |
| :------------- | :-------------------------------------------------- | :--------- | :-------- |
| 유저 상태 조회 | CREATE INDEX idx_queueStatus ON user (queueStatus); | 4.13s      | 1.82s     |

<br>

<img src="https://github.com/user-attachments/assets/2fce7136-4603-449f-98f1-d087dece3513" width="600" height="130">

<br>

<img src="https://github.com/user-attachments/assets/f566ca72-6749-4e0d-b172-8013ce965e0b" width="200" height="30">

<br>

<img src="https://github.com/user-attachments/assets/bc935b01-cad0-4d9a-899e-748012473216" width="600" height="130">

<br>

<img src="https://github.com/user-attachments/assets/c475458c-c5f9-4201-ace7-e84739727d83" width="200" height="30">

<br>

제공된 EXPLAIN 결과를 보면, 복합 인덱스(idx_status_expiredAt)가 쿼리에 제대로 활용되지 않고 있습니다. 인덱스를 사용하지 않고 전체 테이블 스캔(ALL)을 수행하고 있습니다.  
이는 인덱스의 첫 번째 컬럼(status)에만 인덱스가 적용되고 두 번째 조건(expiredAt < NOW())이 효과적으로 사용되지 않기 때문입니다.

<img src="https://github.com/user-attachments/assets/e6494a53-7427-42f5-90a3-4eff56f8c91d" width="200" height="30">

<br>

<img src="https://github.com/user-attachments/assets/073ca029-0913-4065-bd4c-b0b04a6a2c85" width="200" height="30">

<br>

```
해당 문제는 같은 데이터 형식으로 status = WAITING으로 100만건을 넣어서 필터링이 걸리지 않아 생긴 문제였습니다.
다양한 status를 넣어 조회되는 데이터를 50% 이하로 낮추려고 500만건으로 테스트를 돌린 결과 인덱스를 넣은 것과 넣지 않은 결과가 1초정도 차이가 났습니다.
하지만 expiredAt에 대해서 범위 데이터를 인덱스 하는 것이 잘못된것을 후에 알게 되었습니다.
```

<br>

| queryName      | index                                                               | before(ms) | after(ms) |
| :------------- | :------------------------------------------------------------------ | :--------- | :-------- |
| 티켓 상태 조회 | CREATE INDEX idx_status_expiredAt ON ticketing (status, expiredAt); | 3.16s      | 2.13s     |

<br>

## 배운점

```
  1. 단일 인덱스를 걸면 오히려 메모리를 많이 사용하기 때문에 조회 성능이 하락하였습니다.
  2. 대부분 PK, FK 키를 통해 쿼리 조회를 하므로 추가적인 인덱스는 복합인덱스 설정할 때 추가되었습니다.
  3. 복합인덱스의 컬럼 순서는 카디널리티가 높은 순으로 작성하되, 특정 상황일 경우 카디널리티가 낮은 것이 먼저 작성될 수 있었습니다.
  4. 인덱스와 row 수 : 인덱스는 전체 row 수의 50% 미만으로 필터링되어야 full index scan보다 성능이 좋았습니다. 절반 이상의 row가 조회된다면 차라리 인덱스로 인한 정렬로 인해 조회 속도가 느려질 수 있다는 점을 알게 되었습니다.
  5. 인덱스를 추가하면 메모리를 점유하므로 인덱스를 점검해 사용하지 않는 인덱스를 주기적으로 제거해줘야 합니다.
```
