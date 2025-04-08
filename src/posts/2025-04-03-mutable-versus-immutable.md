---
title: "Mutable Vs Immutable"
date: "2025-04-03"
author: "David Oh"
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
// 객체 (Mutable)
const person = { name: "Kim" };
person.name = "Park";  // 객체 내용 변경 가능
console.log(person);   // { name: "Park" }

// 배열 (Mutable)
const numbers = [1, 2, 3];
numbers.push(4);       // 배열에 요소 추가 가능
console.log(numbers);  // [1, 2, 3, 4]
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
// 문자열 (Immutable)
let greeting = "Hello";
greeting.toUpperCase();  // 새로운 문자열을 반환하지만 원본은 변경되지 않음
console.log(greeting);   // "Hello" (원본은 그대로)

// 실제로 변경하려면 재할당이 필요
greeting = greeting.toUpperCase();
console.log(greeting);   // "HELLO"
```

## 불변성(Immutability)의 장점
1. 예측 가능성: 불변 데이터는 변경되지 않으므로 코드의 동작을 예측하기 쉬움
2. 참조 투명성: 같은 입력에 항상 같은 출력을 보장
3. 동시성 제어: 여러 스레드나 비동기 작업에서 데이터 변경으로 인한 충돌 없음
4. 디버깅 용이성: 데이터가 어디서 변경되었는지 추적하기 쉬움

## 불변성 구현 방법
1. Object.freeze()
```javascript
const user = Object.freeze({ name: "Kim", age: 30 });
user.age = 31;  // 엄격 모드에서는 오류 발생, 아니면 무시됨
console.log(user.age);  // 여전히 30
```

주의: Object.freeze()는 얕은(shallow) 동결만 수행합니다.

2. 새 객체 생성
```javascript
// 스프레드 연산자 사용
const original = { name: "Kim", age: 30 };
const updated = { ...original, age: 31 };

// Object.assign() 사용
const another = Object.assign({}, original, { age: 32 });
```

3. 불변성 라이브러리 사용
```js
// Immer 라이브러리 예시
import produce from 'immer';

const original = { user: { name: "Kim", age: 30 } };
const updated = produce(original, draft => {
draft.user.age = 31;
});
```

## React와 불변성

React에서는 상태의 불변성을 유지하는 것이 중요합니다. React는 참조 비교를 통해 컴포넌트의 리렌더링 여부를 결정하기 때문입니다.

```javascript
// 잘못된 방법 (가변적)
const handleClick = () => {
state.count += 1;  // React가 변경을 감지할 수 없음
setState(state);
};

// 올바른 방법 (불변적)
const handleClick = () => {
   setState({ ...state, count: state.count + 1 });
};
```
## 결론
JavaScript에서 mutable과 immutable은 각각 장단점이 있습니다. 불변성은 코드의 예측 가능성과 디버깅을 용이하게 하지만, 때로는 성능 오버헤드가 발생할 수 있습니다. 반면 가변성은 직관적이고 효율적이지만 예기치 않은 부작용을 일으킬 수 있습니다. 상황에 따라 적절한 접근 방식을 선택하는 것이 중요합니다.
현대 JavaScript 개발에서는 불변성 원칙이 점점 더 중요해지고 있으며, React, Redux 같은 프레임워크에서는 불변성을 기본 원칙으로 채택하고 있습니다.
