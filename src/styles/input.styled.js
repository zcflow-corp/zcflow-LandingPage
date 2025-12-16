import styled from 'styled-components'
import { Input } from 'antd'

// Styled input component with updated colors and font
export const InputStyled = styled(Input)`
  width: 100%;
  padding: 0.8rem;
  border-radius: var(--radius);
  border: 1px solid var(--c-line-acc);
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--c-text);

  &:focus {
    border-color: var(--c-primary);
    box-shadow: 0 0 5px var(--c-primary);
  }

  &.ant-input {
    font-size: 1rem;
  }
`

export const TextAreaStyled = styled(Input.TextArea)`
  width: 100%;
  padding: 0.8rem;
  border-radius: var(--radius);
  border: 1px solid var(--c-line-acc);
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--c-text);

  &:focus {
    border-color: var(--c-primary);
    box-shadow: 0 0 5px var(--c-primary);
  }
`

// Button Styled Component
export const ButtonStyled = styled.button`
  background: var(--c-primary);
  color: var(--c-white);
  padding: 1rem;
  border-radius: var(--radius);
  width: 100%;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: var(--c-primary-accessible);
  }
`
