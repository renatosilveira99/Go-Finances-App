import React from "react";
import { TouchableOpacityProps } from 'react-native';
import { Container, Title, Icon, Button } from "./styles";

interface Props extends TouchableOpacityProps {
  title: string;
  type: 'income' | 'outcome';
  isActive: boolean;
}

const icons = {
  income: 'arrow-up-circle',
  outcome: 'arrow-down-circle'
}

export function TransactionTypeButton({ type, title, isActive, ...rest }: Props) {
  return (
    <Container
      {...rest}
      isActive={isActive}
      type={type}
    >

      <Button
        {...rest}
      >
        <Icon
          name={icons[type]}
          type={type}
        />
      </Button>
      <Title>
        {title}
      </Title>
    </Container>
  );
}