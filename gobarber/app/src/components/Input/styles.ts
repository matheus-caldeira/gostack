import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface IContainer {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.View<IContainer>`
  width: 100%;
  height: 60px;
  padding: 0 20px;
  background-color: #232129;
  border-radius: 10px;
  margin-bottom: 8px;

  border-width: 2px;
  border-color: #232129;

  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${props =>
    props.isFocused &&
    css`
      border-color: #ff9000;
    `}

  flex-direction: row;
  align-items: center;
`;

export const TextInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #fff;
  font-family: 'RobotoSlab-Regular';
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`;
