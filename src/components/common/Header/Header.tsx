import headerLogo from "../../../asset/headerLogo.svg";
import Image from "next/image";
import * as S from "./Header.style";
import Link from "next/link";
import API from "@/util/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { isSignIn } from "@/store/atom";

export default function Header() {
  const isSignInSetRecoilState = useSetRecoilState(isSignIn);
  const router = useRouter();
  const [isActive, setIsActive] = useState<boolean>(false);
  useEffect(() => {
    const Token: string | null = localStorage.getItem("accessToken");
    if (Token) {
      API.get(`/api/token/`, {
        headers: { Authorization: `Bearer ${Token}` },
      })
        .then((_) => {
          setIsActive(true);
          isSignInSetRecoilState(true);
        })
        .catch((_) => {
          setIsActive(false);
          isSignInSetRecoilState(false);
        });
    }
  }, [router]);

  const LogOutMethod = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      setIsActive(false);
      isSignInSetRecoilState(false);
      router.push("/");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/");
    }
  };
  return (
    <header>
      <S.Nav>
        <S.headerLogo>
          <Link href="/">
            <Image src={headerLogo} alt="logo" width={179} height={35} />
          </Link>
        </S.headerLogo>
        {isActive ? (
          <>
            <S.NavItem>
              <S.StyledLink href="/">채용 공고</S.StyledLink>
            </S.NavItem>
            <S.NavItem>
              <S.StyledLink href="/announcement">공고 작성</S.StyledLink>
            </S.NavItem>
            {/* <S.NavItem>문의 하기</S.NavItem> */}
            {/* <S.NavItem>내 정보</S.NavItem> */}
            <S.NavItem onClick={LogOutMethod}>로그아웃</S.NavItem>
          </>
        ) : (
          <>
            <S.NavItem>
              <S.StyledLink href="/">채용 공고</S.StyledLink>
            </S.NavItem>
            {/* <S.NavItem>문의 하기</S.NavItem> */}
            <S.NavItem>
              <S.StyledLink href="/signin">관리자 로그인</S.StyledLink>
            </S.NavItem>
          </>
        )}
      </S.Nav>
    </header>
  );
}
