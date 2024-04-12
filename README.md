### sunrin-intagram-cli
> CLI 개발자 : [FIRO](https://github.com/iamfiro)

<br/>

#### 사용법
> 급식 리스트
```bash
> sunrin-instagram-cli list

결과
2024-01-02
2024-01-03
2024-01-04
2024-01-05
```
현재 설정된 급식 리스트를 불러옵니다

<br/>

> 급식 생성
```bash
> sunrin-instagram-cli add

결과
? What is the date of the meal? » 2024-04-13
? What is the meal of the day seperate to /? » 잡곡밥/김치/제육볶음
=========
Added!
```
현재 설정된 급식 리스트를 불러옵니다

<br/>

> 급식 삭제
```bash
> sunrin-instagram-cli delete

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
현재 설정된 급식중의 일부를 삭제합니다