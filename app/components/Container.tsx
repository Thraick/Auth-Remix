
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

interface Props {
  children: React.ReactNode;
  // All other props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

export default function FixedContainer({ children, ...rest }: Props) {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container
        fixed
        {...rest}>
        {children}
      </Container>
    </React.Fragment >
  );
}

