# SelectDropdown - Compound Component Architecture

`SelectDropdown`은 컴파운드 패턴을 기반으로 구성된 셀렉트 컴포넌트입니다.  
사용자가 **자유롭게 UI를 구성하면서도 내부 상태와 동작을 자연스럽게 공유**할 수 있도록 설계되었습니다.

---

## 컴포넌트 트리 구조

```txt
<SelectDropdown.Root>
├── <SelectDropdown.Trigger placeholder="..."> // Select Dropdown Button 역할
│
├── <SelectDropdown.Content>
│   ├── <SelectDropdown.Group label="..." />   // Context Menu의 Group Wrapper UI 
│   ├── <SelectDropdown.Item value="...">      // Context Menu Item
│   └── <SelectDropdown.Divider />             // Context Menu Divider
```

## 철학
- 상태는 SelectDropdown Root가 소유합니다.
- 하위 컴포넌트는 Context를 통해 선택값, 열림 상태, 선택 이벤트를 공유합니다.
- UI는 슬롯처럼 자유롭게 구성 가능합니다.
- 컴포넌트 구조 자체가 개발자에게 명확한 역할 분리를 제공합니다.

## 구성 요소 설명
|역할|구성 요소|설명|
|---|---|---|
|루트|SelectDropdown.Root|상태 소유자, Context 제공|
|트리거|Trigger|버튼 역할|
|컨텐츠 영역|Content|팝업 메뉴로 표시됨, Context Menu|
|아이템|Item|항목 클릭 시 선택값 변경, Context Menu Item|
|그룹|Group|Context Menu 내 그룹 표현|
|디바이더|Divider|Context Menu 내 디바이더 역할|


## 예시 사용법
```html
    <Select.Root>
        <Select.Trigger placeholder="select.." />
        <Select.Content>

            <Select.Group label="header">
                <PTextInput />
            </Select.Group>
            
            <Select.Divider />
            
            <Select.Group>
                <Select.Item value="aws" />
                <Select.Item value="azure" />
                <Select.Item value="gcp" />
            </Select.Group>
            
            <Select.Divider />
            
            <Select.Group label="footer">
                ...
            </Select.Group>

        </Select.Content>
    </Select.Root>
```

## 특징 요약
- 선언적으로 명확한 UI 구성
- 내부 상태 공유 (Context)
- 높은 커스터마이징 가능성
- 사용성과 확장성을 고려한 설계


