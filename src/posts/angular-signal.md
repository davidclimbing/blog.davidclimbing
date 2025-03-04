---
title: "Angular Signal, "
date: "2023-12-22"
author: "David Oh"
---

## 개요

* Angular 17에서 Signals 라는 시스템을 새롭게 도입

도입 방안을 다루기 전에..

Angular Signals는 무엇인가?

Angular가 애플리케이션 전반에 걸쳐 애플리케이션의 상태가 어디서, 어떻게 사용되는지 세분화하여 렌더링 업데이트를 최적화할 수 있도록 하는 시스템

Signals

특정 값의 변화를 알려주는, 값을 둘러싼 Wrapper이다.

signal의 값은 항상 getter function을 통해서 읽게 된다.

Kinds

Writable signals

직접적으로 값을 바꿀 수 있는 API를 제공한다.

set()

직접적으로 값을 바꿀 때 사용

update()

기존 값에서 새로운 값을 도출할 때 사용

Computed signals

다른 signal로부터 값을 도출한다.

직접적으로 값을 할당할 수 없다.

Effects

하나 또는 여러개의 signal 값이 바뀌면 실행되는 연산이다.

변화 감지 과정에서 항상 비동기적으로 실행된다.

Angular는 해당 구성 요소의 템플릿 내에서 읽은 Signal이 변경될 때마다 구성 요소의 UI를 업데이트하는 효과를 사용

Angular Signals가 왜 필요한가?

Reactivity

Zone.js

오늘날, Angular의 reactivity는 zone.js 라이브러리에 의존하며, zone.js는 데이터의 변화에 대한 "세밀한" 정보를 제공하지 않는다.

zone.js는 응용 프로그램에서 어떤 일이 일어났을 때만 사용자에게 알릴 수 있으며, 무슨 일이 일어났는지 또는 무엇이 바뀌었는지에 대한 정보를 제공할 수 없다.

Observable

템플릿 렌더링에 적합하지 않다.

Reasons

Observables are naturally asynchronous

동기식, 비동기식 데이터 흐름을 제공한다. 하지만 Observable에서 제공하는 API는 2가지 케이스를 구별하지 않음. 해당 특징은 이중성을 가져 유연함을 주지만 템플릿 반응형에서 사용할 때는 문제를 일으킬 수 있다.

Observables are not side-effect free

Subscription이 잠재적으로 임의의 행동을 촉발할 수 있음

RxJS is not glitch-free

reactive system에서 계산 또는 반응이 중간, 불일치 상태일 때 결함이 생긴다.

Signals

프레임워크는 주어진 템플릿에서 어떤 Signal이 액세스되는지 추적할 수 있으며, 모델에 대한 주어진 변경에 의해 영향을 받는 구성 요소에 대한 세밀한 정보를 제공

Signal은 그들의 값에 대한 동기식 접근을 허용

Signal을 읽을 때 side-effect가 없음

현대 Signal 구현은 결함이 없으며 사용자에게 일관성 없는 상태를 노출시키지 않음

Signal 구현은 종속성을 자동으로 추적 가능

Signal은 Angular의 종속성 주입 시스템과 잘 어울리는 구성 요소뿐만 아니라 어디에서나 사용 가능

