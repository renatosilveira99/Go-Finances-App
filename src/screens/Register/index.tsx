import React, { useState } from 'react';
import {
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import {
  useNavigation,
  NavigationProp,
  ParamListBase
} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

import { CategorySelect } from '../CategorySelect'

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from './styles'
import { useAuth } from '../../hooks/auth';

export type FormData = {
  [name: string]: any;
  [amount: number]: any;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('O nome é obrigatório'),

  amount: Yup
    .number()
    .typeError('Infome um valor válido')
    .positive('O valor deve ser positivo')
    .required('O valor é obrigatório'),
})

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { user } = useAuth();

  const { navigate }: NavigationProp<ParamListBase> = useNavigation();

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionType(type: 'income' | 'outcome') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  async function handleSubmitRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert('Atenção', 'Selecione o tipo de transação');
    }

    if (category.key === 'category') {
      return Alert.alert('Atenção', 'Selecione a categoria');
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }

    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`;
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [...currentData, newTransaction];

      AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      navigate('Listagem');

    } catch (error) {
      console.log(error);
      Alert.alert('Atenção', 'Erro ao cadastrar transação');
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>


        <Form>
          <Fields>
            <InputForm
              name='name'
              control={control}
              placeholder='Nome'
              autoCapitalize='sentences'
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <InputForm
              name='amount'
              control={control}
              placeholder='Preço'
              keyboardType='numeric'
              error={errors.amount && errors.amount.message}
            />

            <TransactionsTypes>
              <TransactionTypeButton
                type='income'
                title='Income'
                onPress={() => handleTransactionType('income')}
                isActive={transactionType === 'income'}
              />
              <TransactionTypeButton
                type='outcome'
                title='Outcome'
                onPress={() => handleTransactionType('outcome')}
                isActive={transactionType === 'outcome'}
              />

            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />

          </Fields>

          <Button
            title='Enviar'
            onPress={handleSubmit(handleSubmitRegister)}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}