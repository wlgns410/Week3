# HHP-Concert-Ticketing-Project

1. [Milestone](https://github.com/users/wlgns410/projects/2/views/3)
2. [ERD](#ERD)
3. [API-DOCS](https://week3.gitbook.io/queue)
4. [Sequence_diagram](#sequence_diagram)
5. [Lock 비교](#낙관적락vs비관적락vs분산락)
6. [캐시 전략](Docs/cache.md)
7. [인덱스 전략](Docs/index.md)

<br>

---

## ERD

[ERD](https://dbdiagram.io/d/6683fece9939893daed56a48)는 여기서 보실 수도 있습니다.

<img src="https://github.com/wlgns410/Week3/assets/81137234/a2e5e557-02ec-4578-a865-1f8d8e9b8fd6" width="700" height="700">

<br>

## API-DOCS

[API 명세서](https://week3.gitbook.io/queue) 에서 보실 수 있습니다.

<br>

## Sequence_diagram

<br>

### 1. 계정 생성

<img src="https://github.com/wlgns410/Week3/assets/81137234/2de6d3d5-786c-417b-b971-2bda87de2070" width="300" height="300">

<br>

### 2. 잔액조회

<img src="https://github.com/wlgns410/Week3/assets/81137234/3cfe9931-df64-4156-813d-237048139b5d" width="500" height="400">

<br>

### 3. 잔액충전

<img src="https://github.com/wlgns410/Week3/assets/81137234/019957ff-fe38-45f2-b23b-d87bc774baa3" width="600" height="400">

<br>

### 4. 예약가능날짜 조회

<img src="https://github.com/wlgns410/Week3/assets/81137234/dc08fda8-f841-4ba1-b8d9-8af7c7b9d581" width="600" height="400">

<br>

### 5. 예약가능 좌석 조회

<img src="https://github.com/wlgns410/Week3/assets/81137234/b3e14abd-04f6-47e1-8679-b2dd689dc8a7" width="800" height="400">

<br>

### 6. 좌석 예약 요청

<img src="https://github.com/wlgns410/Week3/assets/81137234/d1ad9863-0c77-42f4-8051-568f90f84104"  width="1000" height="600">

<br>

### 6. 유저 대기열 토큰 생성

<img src="https://github.com/wlgns410/Week3/assets/81137234/21fca183-5e92-49d4-816a-93d91f612530" width="500" height="400">

<br>

### 7. 유저 대기열 토큰 조회

<img src="https://github.com/wlgns410/Week3/assets/81137234/287f40c3-8b35-4318-905e-13a2a40840ad" width="400" height="300">

<br>

### 8. 결제

<img src="https://github.com/wlgns410/Week3/assets/81137234/85842103-d2a7-4481-872a-eb3ee87228e9" width="1000" height="800">

<br>

---

<br>

## 낙관적락vs비관적락vs분산락

<br>

1. 낙관적락

낙관적 락을 이용해서 잔액 충전을 시도해봤다.

<br>

<img src="https://github.com/user-attachments/assets/318222f8-9cfe-4a71-a264-f206dcfcf0f8" width="600" height="600">

<br>

100회 동시 요청을 하는데, 8초가 걸렸다고 한다.

<img src="https://github.com/user-attachments/assets/b758ffe0-d7fc-4a7b-bf90-ef14f8d1d389" width="600" height="15">

<br>

하지만 실제 성공 횟수는 26회 정도였다.  
재시도 로직을 구현하여 충돌이 발생한 경우 재시도를 해서 일관성을 유지하게 할 수 있겠지만, 애초에 충돌이 거의 발생하지 않는다는 가정하에 사용하는 것이 낙관적락이므로 while 문을 이용해 실패한 재시도를 재귀적으로 돌리면 무한 대기열이 생길것이므로 성능적으로 좋지 않겠다는 생각이 들었다.

<br>

<img src="https://github.com/user-attachments/assets/4996a597-76a1-4ac6-87e3-1bab601e4ef5" width="600" height="600">

<br>

<img src="https://github.com/user-attachments/assets/e16773d8-d33b-4b24-b4e0-d62e40b97d9a" width="600" height="15">

<br>

비관적 락은 깔끔하게 100회가 다 성공했다.  
2.504 s만 걸려서 동시성 처리하는데에는 비관적 락이 더 적합한것 같다.  
동시성 처리하는데 시간도 적게 들고 성공확률도 높았기 때문이다.

<img src="https://github.com/user-attachments/assets/71c17365-25a4-4632-a815-f6e83d10ffa2" width="600" height="15">

<br>

하지만 300회만 시도해도 비관적락도 실패를 해버렸다.  
128건만 성공하고 172건이 실패했다.  
이상했다.

```
mysql> SHOW VARIABLES LIKE 'max_connections';
+-----------------+-------+
| Variable_name   | Value |
+-----------------+-------+
| max_connections | 151   |
+-----------------+-------+
1 row in set (0.05 sec)

```

내 mysql의 max_connections는 151이라 동시성 처리로 151 건을 성공해야하는 것이 아닌가 싶었다.

<br>

<img src="https://github.com/user-attachments/assets/18205747-07d6-4955-b49b-256efe9f1411" width="600" height="15">

결국 cpu, 메모리를 증가시키거나 redis 분산락을 사용해야 128회 이상의 동시성 처리가 가능하지 않을까라는 생각을 했다.  
하지만 지금 컴퓨터의 cpu, memory는 바꿀 수 없으니 redis의 분산락의 힘을 빌려보기로 했다.

<br>

<img src="https://github.com/user-attachments/assets/09a791f4-845e-490d-b829-652d0b0c8e0c" width="400" height="300">

<img src="https://github.com/user-attachments/assets/6b6dfee0-d0b5-43bf-99c9-f8a81552d655" width="600" height="20">

<br>

레디스 심플락으로 테스트를 해봤다.  
100회 시도시 91회를 성공했다.

<br>

<img src="https://github.com/user-attachments/assets/68cc4134-7010-4118-ac07-f9acf5aa13b1" width="400" height="300">

<img src="https://github.com/user-attachments/assets/b140ef85-30bf-42f5-94da-a8b3e3e2905e" width="600" height="20">

<br>

레디스 스핀락으로 테스트를 해봤다.  
100회 시도시 100회를 다 성공했다.

<br>

<img src="https://github.com/user-attachments/assets/143fdd08-2c33-40c9-ac3a-feac894b4a8d" width="600" height="20">

<br>

근데 300회를 시도하자 128회만 성공했다.

<br>

스핀락과 비관적 락을 300회 비동기 시도했을 때 둘 다 128회만 성공한 것이 CPU 코어수와 메모리 용량 등으로 인해서  
내 컴퓨터에서 동시 처리 가능한 작업수가 128이 최대인건지 궁금해졌다.

<br>

<img src="https://github.com/user-attachments/assets/16d406a2-7566-417f-a68a-721b6c0dba21" width="400" height="300">

마지막으로 pub/sub을 이용해 동시성처리를 해보니  
300회 이상의 동시 요청을 보내니 max connection pool 이상의 횟수를 처리하기는 했다.  
하지만 이것도 무한 retry를 시키지않고 fail 처리를 하는 이상 다 성공시키기는 어려워보였다.

<br>

결론은 pub/sub으로 동시성 처리할 수 있으면 best  
동시성 처리를 해야하는데 redis를 쓸 수 없는 환경이고 DB만 써야한다면 비관적락을 사용하는 것이 가장 좋지 않을까 싶었다.
