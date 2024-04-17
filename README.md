> sunrin-instagram-cli


<br/>
<p align="center">📦 sunrin-instagram-cli</p>
<p align="center"><b>sunrin-project/instagram</b> 를 효율적으로 관리하기 위해 만든 CLI</p>

<div align="center">

![Github Issue](https://img.shields.io/github/issues/sunrin-project/instagram)
![Github Issue](https://img.shields.io/github/issues-pr/sunrin-project/instagram)

</div>

<div style="height: 40px">ㅤ</div>

## 📄 목차
1. [개발 기술](#tech)
2. [파일 / 폴더 구조](#folder)
3. [개발자](#developer)
4. [문의](#contact)
5. [설치 방법](#install)
6. [사용법](#howto)
7. [트러블 슈팅](#trouble)

## 🔍 개발 기술 <a id="tech"></a>
`Typescript` - Javascript에 **Type**기능을 추가한 언어<br/>

`Spotify` - ~~개발을 하기위한 나의 레드불~~

## 📂 파일 / 폴더 구조 <a id="folder"></a>
- CLI (**Javascript**)
```
.gitignore - Github에 올라가면 안되는 파일을 적어둔 파일 (예시: .env 파일)

.npmignore - NPM에 올라가면 안되는 파일을 적어둔 파일 (예시: .env 파일)

package-lock.json - node_modules 디렉토리에 설치된 패키지들의 의존성 트리 (npm)

package.json - 개발자가 배포한 패키지에 대해, 다른 사람들이 관리하고 설치하기 쉽게 하기 위한 문서
README.md - 현재 보고있는 문서

tsconfig.json - Typescript 세팅

school.ts - CLI 코드가 들어있는 중요한 파일
```

## 🖥️ 개발자 <a id="developer"></a>
- <a href="https://github.com/iamfiro">@iamfiro</a> - 📦 CLI 개발

## 📞 문의 <a id="contact"></a>
<a href="https://www.instagram.com/sunrin_life/"><img style="border-radius: 4px" src="https://img.shields.io/badge/Instagram-E4405F?style=flat-square&logo=Instagram&logoColor=white&link=https://www.instagram.com/sunrin_today/"/></a>
> **@sunrin_today** - 인스타그램

## 📦 설치 방법 <a id="install"></a>
```bash
npm i sunrin-instagram-cli
```

## 📎 사용법 <a id="howto"></a>
> 인스타그램 자동 업로드 세팅<br/>
> ㄴ 프로젝트 초기에 인스타그램 자동 업로드 Config를 세팅합니다
```bash
> npx sic init

? What is your school named? » 선린인터넷고등학교
? What is your instagram id for upload? » 인스타그램 계정 ID
? What is your instagram password for upload? » 인스타그램 계정 PW
? Would you like to use Discord Webhook for logging? » Yes
? What is your discord webhook URL? » URL

Config file created!
```

> 급식 리스트 불러오기<br/>
> ㄴ 현재 설정된 급식 리스트를 불러옵니다

```bash
> npx sic list

결과
2024-01-02
2024-01-03
2024-01-04
2024-01-05
```

<br/>

> 급식 데이터 생성하기<br/>
> ㄴ 급식 데이터를 JSON에 생성합니다

```bash
> npx sic add

결과
? What is the date of the meal? » 2024-04-13
? What is the meal of the day seperate to /? » 잡곡밥/김치/제육볶음
=========
Added!
```

<br/>

> 급식 데이터 삭제<br/>
> ㄴ 현재 설정된 급식중의 일부를 삭제합니다
```bash
> npx sic delete

결과
? Please select the item you want to delete
> 2024-04-02
  2024-04-03
  2024-04-04
  2024-04-05
  2024-04-08
  2024-04-09
  2024-04-10
(Use arrow keys to reveal more choices)
=========
? Are you sure you want to delete this? (Use arrow keys)
> Delete This
  Exit
=========
Deleted!
```

## 🤬 트러블 슈팅 <a id="trouble"></a>
<details>
  <summary>그냥 NEIS API 써서 자동화 하면 되는거 아닌가요?</summary>
  <br/>
  저희도 프로젝트 초기에 NEIS API를 활용하여 프로그램을 자동화하려는 계획을 세웠습니다.<br/>그러나 개발 중에 NEIS API를 사용해보니 데이터를 불러오는 데 문제가 발생하거나, 오래된 데이터를 반환하는 경우가 많았습니다.<br/>
  또한 NEIS에서 제공하는 데이터를 그대로 사용하기 때문에 <b>데이터 가공이 어려웠습니다</b>.<br/>
  특히, 급식 정보의 음식 이름이 너무 길 경우 이미지가 표시되지 않는 버그가 발생했습니다. (예: <b>추억의경양식돈까스&소스</b>는 <b>돈까스</b>로 요약이 가능)<br/>
  이러한 문제들을 고려하여 "<b>직접 JSON에 급식 정보를 관리하자</b>"는 결정을 내리게 되었습니다.

  이러한 결정에 따라 매일 JSON을 관리하는 번거로움을 줄이기 위해 CLI 도구인 `📦sunrin-instagram-cli`를 개발하였습니다.<br/>
  이를 통해 JSON 데이터 관리를 효율적으로 수행할 수 있게 되었습니다.
</details>