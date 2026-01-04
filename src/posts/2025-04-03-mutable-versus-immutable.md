---
title: 'Mutable Vs Immutable'
date: '2025-04-03T00:00:00+09:00'
author: 'David Oh'
tag: ['JavaScript', 'React', 'Programming']
---

# JavaScript에서의 Mutable vs Immutable

JavaScript에서 mutable(가변성)과 immutable(불변성)은 데이터 구조와 값을 다루는 데 있어 매우 중요한 개념입니다. 이 두 가지 특성은 코드의 안정성, 예측 가능성, 그리고 성능에 큰 영향을 미칩니다.

## Mutable (가변성)

Mutable 객체는 생성된 후에도 그 상태나 내용이 변경될 수 있습니다.

### JavaScript의 대표적인 Mutable 자료형:

- 객체(Objects)
- 배열(Arrays)
- 함수(Functions)
- 날짜(Date)
- Map, Set, WeakMap, WeakSet

```javascript
// 객체
const person = { name: 'Kim' };
person.name = 'Park'; // 객체 내용 변경 가능
console.log(person); // { name: "Park" }

// 배열
const numbers = [1, 2, 3];
numbers.push(4); // 배열에 요소 추가 가능
console.log(numbers); // [1, 2, 3, 4]
```

## Immutable (불변성)

Immutable 값은 생성된 후에는 그 내용이 변경될 수 없습니다.

### JavaScript의 대표적인 Immutable 자료형:

- 문자열(String)
- 숫자(Number)
- 불리언(Boolean)
- null
- undefined
- Symbol
- BigInt

예시:

```javascript
let greeting = 'Hello';
greeting.toUpperCase(); // 새로운 문자열을 반환하지만 원본은 변경되지 않음
console.log(greeting); // "Hello" (원본은 그대로)

// 실제로 변경하려면 재할당이 필요
greeting = greeting.toUpperCase();
console.log(greeting); // "HELLO"
```

## 불변성(Immutability)의 장점

1. 예측 가능성: 불변 데이터는 변경되지 않으므로 코드의 동작을 예측하기 쉬움
2. 참조 투명성: 같은 입력에 항상 같은 출력을 보장
3. 동시성 제어: 여러 스레드나 비동기 작업에서 데이터 변경으로 인한 충돌 없음
4. 디버깅 용이성: 데이터가 어디서 변경되었는지 추적하기 쉬움

## React와 불변성

React에서는 상태의 불변성을 유지하는 것이 중요합니다. React는 참조 비교를 통해 컴포넌트의 리렌더링 여부를 결정하기 때문입니다.

```javascript
// 잘못된 방법 (가변적)
const handleClick = () => {
  state.count += 1;
  setState(state);
};

// 올바른 방법 (불변적)
const handleClick = () => {
  setState({ ...state, count: state.count + 1 });
};
```
