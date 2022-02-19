import React, { useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import { ActivityIndicator, Alert } from 'react-native'
import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'

import { useAuth } from '../../hooks/auth'

import { SignInSocialButton } from '../../components/SignInSocialButton'

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles'
import { useTheme } from 'styled-components'

export function SignIn() {
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false)

  const { signInWithGoogle } = useAuth()

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true)
      return await signInWithGoogle();
    } catch (error: any) {
      console.log(error)
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login com o Google')
    }

    setIsLoading(false)
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {'\n'}
          umas das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />

          <SignInSocialButton
            title="Entrar com Apple"
            svg={AppleSvg}
          />
        </FooterWrapper>

        {isLoading &&
          <ActivityIndicator
            color={theme.color.shape}
            style={{ marginTop: 18 }}
            size="large"
          />
        }
      </Footer>
    </Container>
  );
}