import styled, { css } from "styled-components/native";
import { TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'
import { RFValue } from "react-native-responsive-fontsize";

interface IconsProps {
  type: 'income' | 'outcome';

}

interface ContainerProps {
  isActive: boolean;
  type: 'income' | 'outcome';
}

export const Container = styled(TouchableOpacity) <ContainerProps>`
  width: 48%;

  flex-direction: row;
  align-items: center;
  justify-content: center;

  border-width: ${({ isActive }) => isActive ? 0 : 1.5}px;
  border-style: solid;
  border-color: ${({ theme }) => theme.color.text};
  border-radius: 5px;

  padding: 16px;

  ${({ isActive, type }) => isActive && type === 'outcome' && css`
    background-color: ${({ theme }) => theme.color.attention_light};
    
  `};

  ${({ isActive, type }) => isActive && type === 'income' && css`
    background-color: ${({ theme }) => theme.color.success_light};
  `};
`;

export const Button = styled(TouchableOpacity)``;

export const Icon = styled(Feather) <IconsProps>`
  font-size: ${RFValue(24)}px;
  margin-right: 12px;

  color: ${({ theme, type }) =>
    type === 'income' ? theme.color.success : theme.color.attention
  }
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
`;